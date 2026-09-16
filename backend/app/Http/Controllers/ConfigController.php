<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Rubros;
use App\Models\User;
use Validator;

class ConfigController extends Controller
{
    function obtenerRubros(){     
        return response()->json(["result"=> Rubros::all()]);
    }

    function obtenerEjercicios(Request $request){    
        $user = User::where('rfc','=',$request->idusuario)->firstOrFail();
        $ejercicios = DB::table('ejercicios')
                      ->where('idusuario','=',$user->id)
                      ->get();
        $ultimoejercicio = DB::table('periodoactivo')
                            ->where('idusuario','=',$user->id)
                            ->get();
        return response()->json(["result"=>$ejercicios,"activo"=>$ultimoejercicio]);
    }

    function obtenerPeriodos(Request $request){
        $user = User::where('rfc','=',$request->idusuario)->firstOrFail();
        $query = "CAST(periodo AS UNSIGNED)";
        $periodos = DB::table('periodos')
                    ->where([
                        ['idusuario','=',$user->id],
                        ['ejercicio','=',$request->ejercicio]])
                    ->orderByRaw($query)
                    ->get();
        return response()->json(["result"=>$periodos]);
    }

    function descargararchivo(Request $request){
        $filetopath=public_path(). "/Sellos/".$request->rfc."/".$request->filename;
        if(file_exists($filetopath)){
            return response()->download($filetopath, $request->filename,$headers);
        }
        
        file_put_contents($filetopath,$request->archivo);        
        $headers = array(
            'Content-Type' => 'application/octet-stream',
        );
        if(file_exists($filetopath)){
            return response()->download($filetopath, $request->filename,$headers);
        }
    }
}
