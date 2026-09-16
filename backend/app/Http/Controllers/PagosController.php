<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Planes;
use App\Models\Pagos;
use Validator;
use Illuminate\Http\Request;
use App\Mail\SendPassword;
use App\Mail\WelcomeBack;
use App\Mail\NuevaCuenta;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class PagosController extends Controller
{
    public function CreacionSubscripcion(Request $request){
        
        if($request->event_type == 'BILLING.SUBSCRIPTION.ACTIVATED'){
            $pagos = New Pagos();
            // $pagos->httpcall = $request->resource['subscriber']['payer_id']."-".$request->resource['subscriber']['email_address']."-".$request->resource['subscriber']['name']['given_name']."-".$request->resource['subscriber']['name']['surname'];
            $pagos->httpcall = $request;
            $pagos->save();
            
            $user = User::where('email','=',$request->resource['subscriber']['email_address'])->first();
            $planes = Planes::all();

            if($user == null){
                $plan = '';
                $planname = '';
                foreach($planes as $p){
                    if(intval($request->resource['billing_info']['last_payment']['amount']['value']) == intval($p->costo)){
                        $plan = $p->id;
                        $planname = $p->nombre;
                    }
                }

                $password = Str::random(12);
                                
                $usuario = new User();
                $usuario->password = Hash::make($password);
                $usuario->email = $request->resource['subscriber']['email_address'];
                $usuario->tipo = "cliente";
                $usuario->nombres = $request->resource['subscriber']['name']['given_name'];
                $usuario->apellidos = $request->resource['subscriber']['name']['surname'];
                $usuario->payer_id = $request->resource['subscriber']['payer_id'];
                $usuario->sus_id = $request->resource['id'];
                $usuario->fecha_sus = date('Y-m-d H:i:s',strtotime($request->create_time));
                $usuario->activo = 1;         
                $usuario->planid = $plan;       
                $usuario->save();
                // Mail::to($request->resource['subscriber']['email_address'])
                Mail::to('soporte@dvaweb.mx')
                    ->send(new Sendpassword($password,
                                            $request->resource['subscriber']['email_address'],
                                            $request->resource['subscriber']['name']['given_name'],
                                            $request->resource['subscriber']['name']['surname']));
                
                // Mail::to($request->resource['subscriber']['email_address'])->send(new Sendpassword($password,$request->resource['subscriber']['email_address'],$request->resource['subscriber']['name']['surname']));
                
                
                $endpointUrl = "https://crm.garantcontable.com/webservice.php"; 
                $userName="soporte"; 
                $headers = array('Accept' => 'application/json');
                
                $req = Http::post($endpointUrl."?operation=getchallenge&username=".$userName, $headers);    
                
                $response = $req['result'];
            
                $challengeToken = $response['token'];
                /***************************************/ 
                //access key of the user admin, found on my preferences page. 
                $userAccessKey = config('app.crm_access_key'); // clave de webservice del CRM 
                
                $generatedKey = md5($challengeToken.$userAccessKey); 
                $reqLogin = Http::asForm()->post($endpointUrl."?operation=login&username=".$userName."&accessKey=".$generatedKey,["operation"=>"login","username"=>$userName,"accessKey"=>$generatedKey]);
                
                $response = json_decode($reqLogin); 
                // return response()->json(["result"=>$response->result->sessionName]);
                $sessionId = $response->result->sessionName; 
                // $userId = $response['result']['userId']; 

                $params = array();
                $params['accountname'] = $request->resource['subscriber']['name']['given_name']." ".$request->resource['subscriber']['name']['surname'];
                $params['account_type'] = 'Customer';
                $params['email1'] = $request->resource['subscriber']['email_address'];
                $params['cf_854'] = $request->resource['subscriber']['payer_id'];
                $params['cf_856'] = $planname;
                $params['assigned_user_id'] = '20x3';
                $objectJson = json_encode($params);
                
                $moduleName = 'Accounts';
                $params = array("sessionName"=>$sessionId, "operation"=>'create', "element"=>$objectJson, "elementType"=>$moduleName);
                $req = Http::asForm()->post($endpointUrl."?operation=create&sessionName=".$sessionId."&element=".$objectJson."&elementType=".$moduleName, $params);
                date_default_timezone_set('America/Mazatlan');
                Mail::to('supervision@garantcontable.com')
                    ->cc('direccion@garantcontable.com')
                    ->send(new NuevaCuenta($request->resource['subscriber']['email_address'],
                                            $request->resource['subscriber']['name']['given_name'],
                                            $request->resource['subscriber']['name']['surname'],
                                            $planname,
                                            $request->resource['subscriber']['payer_id'],
                                            date('d/m/Y',strtotime($request->resource['start_time']))));
            }else{
                Mail::to($request->resource['subscriber']['email_address'])->send(new WelcomeBack($request->resource['subscriber']['email_address'],$request->resource['subscriber']['name']['given_name'],$request->resource['subscriber']['name']['surname']));
            }
        }
        
        return response()->json(["result"=>$request->resource['subscriber']]);
    }
}
