<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Documentos;
use App\Models\Declaraciones;
use App\Models\Sellos;
use Validator;
use ZipArchive;

class DocumentosController extends Controller
{
    function lista(Request $request){  
        $user = User::where('rfc','=',$request->rfc)->firstOrFail();    
        $docs = DB::table('documentos')->where('idusuario','=',$user->id)->get();
        $d = array();
        foreach($docs as $do){
            array_push($d,$do);
        }

        $decs = DB::table('declaraciones')->where('idusuario','=',$user->id)->get();
        $de = array();
        foreach($decs as $dec){
            array_push($de,$dec);
        }
        $docsrel = DB::table('documentosrelacionados')->select('iddoc')->where('idusuario', '=', $user->id)->get();
        $arr = array();
        foreach($docsrel as $dr){
            array_push($arr,$dr->iddoc);
        }
        $docsrelacionadas = DB::table('declaraciones')
                              ->where('idusuario','=',$user->id)
                              ->where('aceptada','=','1')
                              ->whereNotIn('id', $arr)
                              ->get();
        
        $der = array();
        foreach($docsrelacionadas as $dr){
            array_push($der,$dr);
        }

        return response()->json(["result"=> $d,"declaraciones"=>$de,"docsrelacionadas"=>$der]);
    }

    function obtsellos(Request $request){        
        $user = User::where('rfc','=',$request->rfc)->firstOrFail();
        $data = Sellos::where('idusuario','=',$user->id)->first();
        return response()->json(["result" => $data]);
    }

    function nuevo(Request $request){
        $user = User::where('rfc','=',$request->rfc)->firstOrFail();
        if(!is_dir(public_path()."/Sellos/".$request->rfc)){                
            mkdir(public_path()."/Sellos/".$request->rfc); 
        }
        $tempname = $request->filename;
        $filepath = $request->archivo->path();
        $fulldir = public_path()."/Sellos/".$request->rfc."/".$tempname;
        
        $docs = new Documentos;
        $docs->idusuario = $user->id;
        $docs->nombre = $tempname;
        $docs->categoria = $request->categoria;
        if($request->categoria == 'Estado de cuenta'){
            $docs->ejercicio = $request->ejercicio;
            $docs->periodo = $request->periodo;
        }
        $docs->save();
        
        if(!file_exists($fulldir)){
            move_uploaded_file($filepath,$fulldir);
        }else{
            return response()->json(["message"=>"¡El archivo ya existe!"],400);    
        }

        return response()->json(["result" => $docs,"message"=>"¡Se ha guardado el archivo correctamente!"],200);
    }

    function descargararchivo(Request $request){
                
        $filetopath=public_path(). "/Sellos/".$request->rfc."/".$request->archivo;
        $headers = array(
            'Content-Type' => 'application/octet-stream',
        );
        if(file_exists($filetopath)){
            return response()->download($filetopath, $request->archivo,$headers);
        }
    }

    function eliminararchivo(Request $request){
                
        $filetopath=public_path(). "/Sellos/".$request->rfc."/".$request->archivo;
 
        if(file_exists($filetopath)){
            unlink($filetopath);
        }
        if($request->tab == 'doc'){
            $documento = Documentos::find($request->id);
            $documento->delete();
        }else{
            $declaracion = Declaraciones::find($request->id);
            $declaracion->delete();
        }
        

        return response()->json(["message"=>"¡Se ha eliminado el archivo correctamente!"],200);    

    }

    function nuevadeclaracion(Request $request){
        $user = User::where('rfc','=',$request->rfc)->firstOrFail();
        if(!is_dir(public_path()."/Sellos/".$request->rfc)){                
            mkdir(public_path()."/Sellos/".$request->rfc); 
        }
        $tempname = $request->filename;
        $filepath = $request->archivo->path();
        $fulldir = public_path()."/Sellos/".$request->rfc."/".$tempname;
        
        $dec = new Declaraciones;
        $dec->idusuario = $user->id;
        $dec->nombre = $tempname;
        $dec->categoria = $request->categoria;
        $dec->aceptada = 0;
        $dec->save();
        
        if(!file_exists($fulldir)){
            move_uploaded_file($filepath,$fulldir);
        }else{
            return response()->json(["message"=>"¡El archivo ya existe!"],400);    
        }
        if($request->categoria == 'Linea de captura'){
            DB::table('documentosrelacionados')->insert([
                'iddoc' => $request->propuestaselec,
                'idlinea' => $dec->id,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
                'idusuario'=>$user->id
            ]);
        }
        return response()->json(["result" => $dec,"message"=>"¡Se ha guardado el archivo correctamente!"],200);
    }

    function aceptardeclaracion(Request $request){
        $decs = Declaraciones::where('id','=',$request->id)->firstOrFail();
        $decs->aceptada = 1;
        $decs->save();
        return response()->json(["message"=>"Declaración Aceptada"]);
    }



}
