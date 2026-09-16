<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\Profile;
use App\Models\User;
use App\Models\Rol;
use App\Models\Planes;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use App\Mail\acuseCancelacionCliente;
use App\Mail\acuseCancelacionInterno;
use Validator;

class ProfileController extends Controller
{
    /**
     * Get the Profile User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function profile(Request $request) {
        $user = User::find($request->id);
        $plan = Planes::find($user->planid);
        $rol = Rol::find($user->rolid);
        if($plan != null){
            $user->planname = $plan->nombre;
            $user->rolname = '';
            $user->planid = $plan->id;
        }
        if($rol != null){
            $user->planname = '';
            $user->rolname = $rol->nombre;
            $user->rolid = $rol->id;
        }

        return response()->json(['user'=>$user,
                                'roles'=>Rol::all(),
                                'planes'=>Planes::all()]);
    }

    /**
     * Update a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request) {
        
        $messages = [
            "nombres.required" => "Nombres Requeridos.",
            "apellidos.required" => "Apellidos Requeridos.",
            "rfc.required" => "RFC Requerido.",        
        ];
        
        $validator = Validator::make($request->all(), [
            'nombres' => 'required|string|max:200',
            'apellidos' => 'required|string|max:200',
            'rfc' => 'required|string|max:15', 
        ],$messages);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }
        
        $perfil = User::where("id",$request->id)->update([
            'nombres'=>$request->nombres,
            'apellidos'=>$request->apellidos,
            'rfc'=>$request->rfc,
            'curp'=>$request->curp,
            'telefono'=>$request->telefono,
            'regimen'=>$request->regimen,
            'descripcion'=>$request->descripcion,
            'logo'=>$request->logoname,
            'logocuadrado'=>$request->logocuadrado
        ]);
        if($request->logo != 'undefined' && $request->logo != '' && $request->logo != NULL){
            $this->insertarlogo($request->rfc,$request->logo,$request->id);
        }
        
        return response()->json([
            'message' => 'Se ha actualizado el usuario correctamente!',
            'user' => User::find($request->id)
        ], 201);
    }

    public function updatecontador(Request $request) {
        $messages = [
            "nombres.required" => "Nombres Requeridos.",
            "apellidos.required" => "Apellidos Requeridos."        
        ];
        
        $validator = Validator::make($request->all(), [
            'nombres' => 'required|string|max:200',
            'apellidos' => 'required|string|max:200'
        ],$messages);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }
        
        $perfil = User::where("id",$request->id)->update($request->all());
        
        return response()->json([
            'message' => 'Se ha actualizado el contador correctamente!',
            'user' => User::find($request->id)
        ], 201);
    }

    function insertarlogo($rfc,$logo,$id){
            
        $user = User::where('id','=',$id)->firstOrFail();
       
        if(!is_dir(public_path()."/Sellos/".$rfc)){
            mkdir(public_path()."/Sellos/".$rfc);
        }
        
        if(!is_dir(public_path()."/Sellos/".$rfc."/perfil")){
            mkdir(public_path()."/Sellos/".$rfc."/perfil");
        }
        
        $file = $logo;
        $file->move(base_path('/public/Sellos/'.$rfc.'/perfil/'),$file->getClientOriginalName());
    
    }

    function insertarfotoperfil(Request $request){
            
        $user = User::where('id','=',$request->idusuario)->firstOrFail();
        if($request->tipo == 'cliente'){
            $rfc = $request->rfc;
        }else{
            $rfc = $request->idusuario;
        }        
        if(!is_dir(public_path()."/Sellos/".$rfc)){
            mkdir(public_path()."/Sellos/".$rfc);
        }
        
        if(!is_dir(public_path()."/Sellos/".$rfc."/perfil")){
            mkdir(public_path()."/Sellos/".$rfc."/perfil");
        }
        
        $file = $request->perfil;
        $file->move(base_path('/public/Sellos/'.$rfc.'/perfil/'),$file->getClientOriginalName());
        $user->logo = $file->getClientOriginalName();
        $user->save();
        return response()->json([
            'message' => 'Se agregado una nueva foto de perfil!',
            'path'=> $fulldir
        ], 201);
    
    }

    function actualizarplan(Request $request){
        $user = User::where('id','=',$request->idusuario)->firstOrFail();
        $user->planid = $request->planid;
        $user->save();
        $plan = Planes::find($user->planid);

        return response()->json([
            'message' => 'Se ha actualizado el Plan contratado del cliente!',
            'plan'=> $plan->nombre
        ], 201);
    }

    function actualizarrol(Request $request){
        $user = User::where('id','=',$request->idusuario)->firstOrFail();
        $user->rolid = $request->rolid;
        $user->save();        
        $roles = Rol::find($user->rolid);

        return response()->json([
            'message' => 'Se ha actualizado el Rol del contador. El contador, deberá de iniciar sesión para establecer los cambios.',
            'rol'=> $roles->nombre
        ], 201);
    }

    public function cambiarcontrasenia(Request $request){
        $messages = [            
            "password.required" => "La contraseña es requerida.",
            "password.confirmed" => "Las contraseñas no coinciden.",
        ];
        $validator = Validator::make($request->all(), [
            'password' => 'required|string|confirmed|min:6'
        ],$messages);
        
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }
        
        $usuario = User::findOrFail($request->id);
        $usuario->password = Hash::make($request->password);
        $usuario->save();

        return response()->json(['message', 'Se ha cambiado la contraseña correctamente!.']);
    }

    public function cancelarsuscripcion(Request $request){
        $usuario = User::findOrFail($request->id);
        $plan = Planes::findOrFail($usuario->planid);
        $contador = User::findOrFail($usuario->asignadoa);
        // claves solo para dev (desarrollo)
        // $paypalid = config('app.ppciddev');
        // $paypalsecret = config('app.ppcsdev');
        //Claves para producción
        $paypalid = config('app.ppcid');
        $paypalsecret = config('app.ppcs');
        $data = [
            'grant_type' => 'client_credentials',
        ];
        // DEV API
        // $req =  json_decode(Http::asForm()->withBasicAuth($paypalid,$paypalsecret)->post('https://api-m.sandbox.paypal.com/v1/oauth2/token', $data));
        // PROD API
        $req = json_decode(Http::asForm()->withBasicAuth($paypalid,$paypalsecret)->post('https://api-m.paypal.com/v1/oauth2/token', $data));        
        
        $token = $req->access_token;
        
        $data = [
            "reason"=>$request->motivo
        ];
        // DEV API
        //$response = Http::withToken($token)->post('https://api-m.sandbox.paypal.com/v1/billing/subscriptions/'.$usuario->sus_id.'/cancel',$data);
        // PROD API
        $response = Http::withToken($token)->post('https://api-m.paypal.com/v1/billing/subscriptions/'.$usuario->sus_id.'/cancel',$data);
        
        date_default_timezone_set('America/Mazatlan');
        $usuario->status = 0;
        $usuario->motivo = $request->motivo;
        $usuario->fechacancel = date('Y-m-d H:i:s');
        $usuario->save();
        Mail::to('supervision@garantcontable.com')
            ->cc('direccion@garantcontable.com')
            ->bcc($contador->email)
            ->send(new acuseCancelacionInterno($usuario->id,
                                    date('d/m/Y H:i:s'),
                                    $usuario->nombres,
                                    $usuario->apellidos,
                                    $plan->nombre,
                                    $contador->nombres." ".$contador->apellidos));

        // Mail::to('soporte@dvaweb.mx')
        Mail::to($usuario->email)
        ->send(new acuseCancelacionCliente(date('d/m/Y H:i:s'),
                                            $usuario->nombres,
                                            $usuario->apellidos,
                                            $plan->nombre,
                                            $usuario->id
               ));
        return response()->json(['message', 'Se ha cancelado tu suscripción a Garant Contable correctamente.',200]);
    }

    public function getLogo(Request $request){
        $user = User::where('rfc','=',$request->rfc)->firstOrFail();
        return response()->json(['logo'=>$user->logo,"cuadrado"=>$user->logocuadrado]);
    }
}
