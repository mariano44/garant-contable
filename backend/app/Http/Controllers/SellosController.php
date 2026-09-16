<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sellos;
use App\Models\User;
use Validator;
use ZipArchive;

class SellosController extends Controller
{
    function obtener(Request $request){
        // $sellos = Sellos::where('idusuario',$request->idusuario)->();
        // $records=\DB::table('sellos')->Where('idusuario','$request->idusuario')->get();        
        return response()->json(Sellos::where('idusuario',$request->idusuario)->firstOrFail());
    }

    function insertarciec(Request $request){
        $data = Sellos::where('idusuario','=',$request->idusuario)->firstOrFail();
        if ($data == null) {
            $messages = [
                "passciec.required" => "Se requiere la contraseña de la CIEC."      
            ];
            
            $validator = Validator::make($request->all(), [
                'passciec' => 'required|String',
            ],$messages);
    
            if($validator->fails()){
                return response()->json($validator->errors()->toJson(), 400);
            }
            $sellos = new Sellos;
            $sellos->passciec = $request->passciec;
            $sellos->idusuario = $request->userid;
            $sellos->save();
            return response()->json([
                'message' => 'Se ha agregado la contraseña de la CIEC correctamente!'
            ], 201);
        } else {
            $messages = [
                "passciec.required" => "Se requiere la contraseña de la CIEC."      
            ];
            
            $validator = Validator::make($request->all(), [
                'passciec' => 'required|String',
            ],$messages);
    
            if($validator->fails()){
                return response()->json($validator->errors()->toJson(), 400);
            }
            $data->passciec = $request->passciec;
            $data->save();
            return response()->json([
                'message' => 'Se ha actualizado la contraseña del a CIEC correctamente!',
                'sellos' => Sellos::find($request->id)
            ], 201);
        }
    }

    function insertarfiel(Request $request){
        $data = Sellos::where('idusuario','=',$request->idusuario)->firstOrFail();
        if ($data == null) {
            $user = User::find($request->idusuario);            
            $rfc = $user->rfc;
            
            if(!is_dir(public_path()."/Sellos/".$rfc)){                
                mkdir(public_path()."/Sellos/".$rfc); 
            }
            $tempname = 'FIEL_'.$rfc.".key";
            
            $sellos = new Sellos;
            $sellos->idusuario = $request->idusuario;
            $sellos->save();
            if(!is_dir(public_path()."/Sellos/".$rfc."/".$sellos->id)){
                mkdir(public_path()."/Sellos/".$rfc."/".$sellos->id);
            }
            
            $fulldir = public_path()."/Sellos/".$rfc."/".$sellos->id."/FIEL_".$rfc;
            if(!file_exists($fulldir.".key")){
                move_uploaded_file($pathllave,$fulldir.".key");        
                $pathllave = $request->fielkey->path();    
                $salida1 = "openssl pkcs8 -inform DER -in ".$fulldir.".key -out ".$fulldir.".key.pem -passin pass:".$request->passcsd; 
                exec($salida1,$output,$return);
                if( !file_exists($fulldir.".key.pem")){
                    return response()->json([
                        'message' => 'La contraseña no corresponde al archivo .KEY!'
                    ], 400);
                }
                unlink($fulldir.".key.pem");
                $request->csdkey = $fulldir.".key";
                $sellos->fielkey = $fulldir.".key";
            }
            if(move_uploaded_file( $pathcer, $fulldir.".cer")) {
                $rutacer = "openssl x509 -inform DER -outform PEM -in ".$fulldir.".cer -pubkey > ".$fulldir.".cer.pem"; 
                exec($rutacer,$output,$return_val);
                $pathcer = $request->fielcer->path();

                //Verificar si la llave utilizada para sellar no corresponde a un CSD (es de una FIEL)
                $informacion_certificado = openssl_x509_parse(file_get_contents($fulldir.".cer.pem"));
                $uso_certificado = $informacion_certificado["extensions"]["keyUsage"];
                
                if( $uso_certificado == "Digital Signature, Non Repudiation"){		
                    return response()->json([
                        'message' => 'Cuidado! haz cargado los archivos CSD en lugar de la FIEL, favor de subir los archivos correctos.'
                    ], 400);
                }
                unlink($fulldir.".cer.pem");
                $request->csdcer = $fulldir.".cer";
                $sellos->fielcer = $fulldir.".cer";
            }
            if($request->passfiel != ''){
                $sellos->passfiel = $request->passfiel;
            }            
            $sellos->save();
            // $Sellos = Sellos::where("id",$sellos->id)->update($request->all());
            return response()->json([
                'message' => 'Se han agregad0 los archivos la FIEL correctamente!'
            ], 201);

        }else{
            $user = User::find($request->idusuario);
            $sellos = Sellos::where('idusuario','=',$request->idusuario)->firstOrFail();
            $rfc = $user->rfc;
            
            if(!is_dir(public_path()."/Sellos/".$rfc)){
                mkdir(public_path()."/Sellos/".$rfc);
            }
            
            if(!is_dir(public_path()."/Sellos/".$rfc."/".$sellos->id)){
                mkdir(public_path()."/Sellos/".$rfc."/".$sellos->id);
            }
            
            $fulldir = public_path()."/Sellos/".$rfc."/".$sellos->id."/FIEL_".$rfc;
            if(!file_exists($fulldir.".key")){
                move_uploaded_file($pathllave,$fulldir.".key");
                $pathllave = $request->fielkey->path();
                $salida1 = "openssl pkcs8 -inform DER -in ".$fulldir.".key -out ".$fulldir.".key.pem -passin pass:".$request->passcsd; 
                exec($salida1,$output,$return);
                if( !file_exists($fulldir.".key.pem")){
                    return response()->json([
                        'message' => 'La contraseña no corresponde al archivo .KEY!'
                    ], 400);
                }
                unlink($fulldir.".key.pem");
                $request->csdkey = $fulldir.".key";
                $data->fielkey = $fulldir.".key";
            }

            if(move_uploaded_file( $pathcer, $fulldir.".cer")) {
                $rutacer = "openssl x509 -inform DER -outform PEM -in ".$fulldir.".cer -pubkey > ".$fulldir.".cer.pem"; 
                exec($rutacer,$output,$return_val);
                $pathcer = $request->fielcer->path();
                //Verificar si la llave utilizada para sellar no corresponde a un CSD (es de una FIEL)
                $informacion_certificado = openssl_x509_parse(file_get_contents($fulldir.".cer.pem"));
                $uso_certificado = $informacion_certificado["extensions"]["keyUsage"];
                
                if( $uso_certificado != "Digital Signature, Non Repudiation"){		
                    return response()->json([
                        'message' => 'Cuidado! haz cargado los archivos CSD en lugar de la FIEL, favor de subir los archivos correctos.'
                    ], 400);
                }
                unlink($fulldir.".cer.pem");
                $request->csdcer = $fulldir.".cer";
                $data->fielcer = $fulldir.".cer";
            }
            if($request->passfiel != ''){
                $data->passfiel = $request->passfiel;
            }            
            $data->save();
            // $Sellos = Sellos::where("id",$sellos->id)->update($request->all());
            return response()->json([
                'message' => 'Se han actualizado los archivos de la FIEL correctamente!'
            ], 201);
        }
    }

    function insertarcsd(Request $request){
        $data = Sellos::where('idusuario','=',$request->idusuario)->first();
        if ($data == null) {
            $user = User::find($request->idusuario);            
            $rfc = $user->rfc;
            
            if(!is_dir(public_path()."/Sellos/".$rfc)){
                mkdir(public_path()."/Sellos/".$rfc); 
            }
            $tempname = 'CSD_'.$rfc.".key";

            $sellos = new Sellos;
            $sellos->idusuario = $request->idusuario;
            $sellos->save();
            mkdir(public_path()."/Sellos/".$rfc."/".$sellos->id);
            $fulldir = public_path()."/Sellos/".$rfc."/".$sellos->id."/CSD_".$rfc;
            if(!file_exists($fulldir.".key")){
                $pathllave = $request->csdkey->path();
                move_uploaded_file($pathllave,$fulldir.".key");
                $salida1 = "openssl pkcs8 -inform DER -in ".$fulldir.".key -out ".$fulldir.".key.pem -passin pass:".$request->passcsd; 
                exec($salida1,$output,$return);
                if( !file_exists($fulldir.".key.pem")){
                    return response()->json([
                        'message' => 'La contraseña no corresponde al archivo .KEY!'
                    ], 400);								
                }                
                $sellos->csdkey = $fulldir.".key"; 
            }
            if(move_uploaded_file( $pathcer, $fulldir.".cer")) {
                $rutacer = "openssl x509 -inform DER -outform PEM -in ".$fulldir.".cer -pubkey > ".$fulldir.".cer.pem"; 
                exec($rutacer,$output,$return_val);
                $pathcer = $request->csdcer->path();
                //Verificar si la llave utilizada para sellar no corresponde a un CSD (es de una FIEL)
                $informacion_certificado = openssl_x509_parse(file_get_contents($fulldir.".cer.pem"));
                $uso_certificado = $informacion_certificado["extensions"]["keyUsage"];
                
                if( $uso_certificado != "Digital Signature, Non Repudiation"){		
                    return response()->json([
                        'message' => 'Cuidado! haz cargado los archivos de la FIEL en lugar del CSD, favor de subir los archivos correctos.'
                    ], 400);
                }                
                $sellos->csdcer = $fulldir.".cer"; 
            }
            if($request->passcsd != ''){
                $sellos->passcsd = $request->passcsd;
            }
            $sellos->save();
            return response()->json([
                'message' => 'Se han actualizado los archivos CSD correctamente!'
            ], 201);

        }else{
            $user = User::find($request->idusuario);   
            $sellos = Sellos::where('idusuario','=',$request->idusuario)->firstOrFail();
            $rfc = $user->rfc;
            if(!is_dir(public_path()."/Sellos/".$rfc)){                
                mkdir(public_path()."/Sellos/".$rfc); 
            }
            
            if(!is_dir(public_path()."/Sellos/".$rfc."/".$sellos->id)){
                mkdir(public_path()."/Sellos/".$rfc."/".$sellos->id);
            }
            
            $fulldir = public_path()."/Sellos/".$rfc."/".$sellos->id."/CSD_".$rfc;
            if(!file_exists($fulldir.".key")){
                $pathllave = $request->csdkey->path();  
                move_uploaded_file($pathllave,$fulldir.".key");  
                $salida1 = "openssl pkcs8 -inform DER -in ".$fulldir.".key -out ".$fulldir.".key.pem -passin pass:".$request->passcsd; 
                exec($salida1,$output,$return);
                if( !file_exists($fulldir.".key.pem")){
                    return response()->json([
                        'message' => 'La contraseña no corresponde al archivo .KEY!'
                    ], 400);								
                }                
                $data->csdkey = $fulldir.".key";
            }
            
            $pathcer = $request->csdcer->path();
            if(move_uploaded_file( $pathcer, $fulldir.".cer")) {
                $rutacer = "openssl x509 -inform DER -outform PEM -in ".$fulldir.".cer -pubkey > ".$fulldir.".cer.pem"; 
                exec($rutacer,$output,$return_val);
                $pathcer = $request->csdcer->path();
                //Verificar si la llave utilizada para sellar no corresponde a un CSD (es de una FIEL)
                $informacion_certificado = openssl_x509_parse(file_get_contents($fulldir.".cer.pem"));
                $uso_certificado = $informacion_certificado["extensions"]["keyUsage"];
                
                if( $uso_certificado != "Digital Signature, Non Repudiation"){		
                    return response()->json([
                        'message' => 'Cuidado! haz cargado los archivos de la FIEL en lugar del CSD, favor de subir los archivos correctos.'
                    ], 400);
                }                
                $data->csdcer = $fulldir.".cer";
            }
            if($request->passcsd != ''){
                $data->passcsd = $request->passcsd;
            }
            
            $data->save();
            
            // $Sellos = Sellos::where("id",$request->id)->update($request->all());
            // var_dump($Sellos);exit;
            return response()->json([
                'message' => 'Se han actualizado los archivos CSD correctamente!'
            ], 201);

        }
    }

    function descargararchivo(Request $request){
        // var_dump($request);exit;
        switch($request->archivo){
            case 'fielkey':
                $file= public_path(). "/Sellos/".$request->rfc."/".$request->id."/FIEL_".$request->rfc.".key";
                $filename = "FIEL_".$request->rfc.".key";
                $zipFileName = "FIEL_".$request->rfc.".zip";
            break;
            case 'fielcer':
                $file= public_path(). "/Sellos/".$request->rfc."/".$request->id."/FIEL_".$request->rfc.".cer";
                $filename = "FIEL_".$request->rfc.".cer";
                $zipFileName = "FIEL_".$request->rfc.".zip";
            break;
            case 'csdkey':
                $file= public_path(). "/Sellos/".$request->rfc."/".$request->id."/CSD_".$request->rfc.".key";
                $filename = "CSD_".$request->rfc.".key";
                $zipFileName = "CSD_".$request->rfc.".zip";
            break;
            case 'csdcer':
                $file= public_path(). "/Sellos/".$request->rfc."/".$request->id."/CSd_".$request->rfc.".cer";
                $filename = "CSD_".$request->rfc.".cer";
                $zipFileName = "CSD_".$request->rfc.".zip";
            break;
        
            default:
            break;
        }
        $filetopath=public_path(). "/Sellos/".$request->rfc."/".$request->id.'/'.$zipFileName;
        if(file_exists($filetopath)){
            unlink($filetopath);
        }
        $zip = new ZipArchive;
        if ($zip->open(public_path(). "/Sellos/".$request->rfc."/".$request->id."/".$zipFileName, ZipArchive::CREATE) === TRUE) {            
            $zip->addFile(public_path(). "/Sellos/".$request->rfc."/".$request->id."/".$filename,$filename);            
            $zip->close();
        }
        
        $headers = array(
            'Content-Type' => 'application/octet-stream',
        );
        if(file_exists($filetopath)){
            return response()->download($filetopath, $zipFileName,$headers);
        }
    }
    
}
