<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use App\Mail\SendPassword;
use App\Mail\ContadorAsignado;
use Illuminate\Support\Facades\Mail;
use Validator;


class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct() {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    public function isValidToken(Request $request)
    {
        return response()->json(['valid' => auth()->check()]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request){        
        $messages = [
            "email.required" => "Correo Requerido",
            "email.exists" => "El usuario no existe",
            "password.required" => "La contraseña es requerida"
        ];
    	$validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users',
            'password' => 'required|string',
        ],$messages);

        if ($validator->fails()) {            
            return response()->json($validator->errors(), 422);
        }
        
        if (! $token = auth()->attempt($validator->validated())) {
            return response()->json(['error' => 'Contraseña Incorrecta'], 401);
        }

        return $this->createNewToken($token);
    }

    /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request) {
        $password = Str::random(12);
        $request->request->add(['password' => $password]);
        $request->request->add(['password_confirmation' => $password]);
        $messages = [
            "email.required" => "Correo Requerido.",
            "email.email" => "El correo no es válido.",
            "email.unique" => "Este correo ya está ocupado.",
            "password.required" => "La contraseña es requerida.",
            "password.confirmed" => "Las contraseñas no coinciden.",
            "password.min" => "Contraseña debe de ser de 6 digitos como mínimo",
            "rfc.unique" => "Este RFC ya se encuentra en nuestra plataforma."
        ];
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|confirmed|min:6',
            'rfc' => 'unique:users',
        ],$messages);
        
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }
        
        $user = User::create(array_merge(
                    $validator->validated(),
                    ['password' => bcrypt($password)]
                ));
        $usuario = User::findOrFail($user->id);
        $usuario->tipo = "cliente";
        $usuario->nombres = $request->nombres;
        $usuario->apellidos = $request->apellidos;
        $usuario->rfc = $request->rfc;
        $usuario->razonsocial = $request->razonsocial;
        $usuario->regimen = $request->regimen;
        $usuario->telefono = $request->telefono;
        $usuario->movil = $request->movil;
        $usuario->save();
        Mail::to($request->email)->send(new Sendpassword($password,$request->email,$request->nombres,$request->apellidos));
        return response()->json([
            'message' => 'Te haz registrado correctamente! Se enviará tu contraseña por correo electrónico.',
            'user' => $user
        ], 201);
    }

    /**
     * Nuevo Usuario
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function nuevo(Request $request) {
        $messages = [
            "email.required" => "Correo Requerido.",
            "email.email" => "El correo no es válido.",
            "email.unique" => "Este correo ya está ocupado.",
        ];
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:100|unique:users',
        ],$messages);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }
        
        $user = User::create(array_merge(
                    $validator->validated(),
                    ['password' => bcrypt($request->password)]
                ));
                
        $user->nombres = $request->nombres;
        $user->apellidos = $request->apellidos;
        $user->telefono = $request->telefono;
        $user->rolid = $request->rolid;
        $user->tipo = 'contador';
        $user->save();
        return response()->json([
            'message' => 'El usuario se ha registrado correctamente!',
            'user' => $user->id
        ], 201);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout() {
        auth()->logout();
        return response()->json(['message' => 'User successfully signed out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh() {
        return $this->createNewToken(auth()->refresh());
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function userProfile() {
        return response()->json(auth()->user());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function createNewToken($token){
        $user = auth()->user();
        if($user->status == 0 && $user->tipo == 'contador'){
            return response()->json([
                'message' => 'El usuario ha sido desactivado, favor de comunicarse con supervisión o dirección de Garant Contable'
            ],400);
        }
        if($user->tipo == 'contador'){
            $user->permisos = DB::table('rols_permisos')->where("idrol","=",$user->rolid)->get();
            $getrolname = DB::table('rols')->select('nombre')->where('id',"=",$user->rolid)->get();
            foreach($getrolname as $rolname){
                $user->rolname = $rolname->nombre;
            }
        }else{
            $user->permisos = DB::table('planes_permisos')->where("idplan","=",$user->planid)->get();
            $getplanname = DB::table('planes')->select('nombre')->where('id',"=",$user->planid)->get();
            foreach($getplanname as $planname){
                $user->planname = $planname->nombre;
            }
        }
        $getLast = DB::table('last')->where('idusuario','=',$user->id)->get();
        $last = '';
        foreach($getLast as $l){
            $last = $l->cliente;
        }

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => $user,
            'tipo' => $user->tipo,
            'last' => $last
        ]);
    }

    public function listado(Request $request) {
        if($request->tipo != 'ALL'){
            if($request->tipo == 'contador'){
                $users = DB::table('users')
                    ->select(DB::raw('users.*, rols.nombre as rol, planes.nombre as plan'))
                    ->leftJoin('rols','users.rolid',"=","rols.id")
                    ->leftJoin('planes','users.planid',"=","planes.id")
                    ->where('tipo','=',$request->tipo)
                    ->where('activo','=',$request->estado)
                    ->get();
            }else if($request->tipo == 'cliente'){
                $users = DB::table('users')
                    ->select(DB::raw('users.*, planes.nombre as rol, planes.nombre as plan'))
                    ->leftJoin('rols','users.rolid',"=","rols.id")
                    ->leftJoin('planes','users.planid',"=","planes.id")
                    ->where('tipo','=',$request->tipo)
                    ->where('activo','=',$request->estado)
                    ->get();
            }else{
                $relacion = DB::table('relacionrolplanes')->where('rolid','=',$request->rolid)->get();
                $planid = '';
                foreach($relacion as $rel){                
                    $planid = $rel->planid;
                }
                $users = DB::table('users')
                    ->select(DB::raw('users.*, planes.nombre as rol, planes.nombre as plan'))
                    ->leftJoin('rols','users.rolid',"=","rols.id")
                    ->leftJoin('planes','users.planid',"=","planes.id")
                    ->where('activo','=',$request->estado)
                    ->where('planid','=',$planid)
                    ->get();
            }
        }else{
            $users = DB::table('users')          
                    ->select(DB::raw('users.*, rols.nombre as rol, planes.nombre as plan'))
                    ->leftJoin('rols','users.rolid',"=","rols.id")
                    ->leftJoin('planes','users.planid',"=","planes.id")          
                    ->where('activo','=',$request->estado)
                    ->get();
        }

        return response()->json(['result' => $users]);
    }

    public function listadoAsignado(Request $request) {
       
        $users = DB::table('users')
            ->select(DB::raw('users.*, planes.nombre as rol, planes.nombre as plan'))
            ->leftJoin('rols','users.rolid',"=","rols.id")
            ->leftJoin('planes','users.planid',"=","planes.id")
            ->where('tipo','=',$request->tipo)
            ->where('activo','=',$request->estado)
            ->where('asignadoa','=',$request->userid)
            ->get();
            

        return response()->json(['result' => $users]);
    }

    public function usuariosporplan(Request $request){
        
        $getrols = DB::table('rols')->where('nombre','like','%'.$request->plan.'%')->get();
        
        $rol = '';
        foreach($getrols as $rols){
            $rol = $rols->id;
        }
        
        $users = DB::table('users')
                    ->select(DB::raw('users.*'))
                    ->leftJoin('rols','users.rolid',"=","rols.id")
                    ->where('users.rolid','=',$rol)
                    ->where('users.activo','=','1')
                    ->get();
        
        return response()->json(['result' => $users]);
    }

    public function asignar(Request $request){
        
        if($request->asignadoa == ''){
            return response()->json(['error','Se tiene que asignar un usuario al cliente'],400);
        }
        $affected = DB::table('users')
              ->where('id', $request->clienteid)
              ->update(['asignadoa' => $request->asignadoa]);

        $Cliente = User::where('id','=',$request->clienteid)->firstOrFail();
        $Contador = User::where('id','=',$request->asignadoa)->firstOrFail();

        Mail::to($Cliente->email)
                  ->send(new ContadorAsignado($Contador->email,
                                          $Contador->nombres,
                                          $Contador->apellidos,
                                          $Contador->movil));

        return response()->json(['message' => 'Se ha actualizado el cliente correctamente!'],201);
    }

    public function insertlast(Request $request){
        
        $getLastcliente = DB::table('last')->where('idusuario','=',$request->idusuario);
        $lastcliente = '';
        foreach($getLastcliente as $last){
            $lastcliente = $last;
        }
        
        if(!$lastcliente){
            DB::table('last')->insert([
                'idusuario' => $request->idusuario,
                'cliente' => $request->cliente,
                'created_at'=>date('Y-m-d H:i:s'),
                'updated_at'=>date('Y-m-d H:i:s')
            ]);
        }else{
            $affected = DB::table('last')
              ->where('idusuario', $request->idusuario)
              ->update(['cliente' => $request->cliente]);
        }

        return response()->json(['message' => ''],201);
    }

    public function last(Request $request){
        $getLast = DB::table('last')->where('idusuario','=',$request->idusuario)->get();
        $last = '';
        foreach($getLast as $l){
            $last = $l->cliente;
        }

        return response()->json(['last'=>$last],201);
    }

}