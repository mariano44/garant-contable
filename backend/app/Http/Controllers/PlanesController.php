<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Planes;
use Validator;

class PlanesController extends Controller
{
    function obtener(){
        return response()->json(['result' => Planes::all()]);
    }

    function getVistas(){
        $vistas = DB::table('vistas')->where('vistopor','like', 'Todos%')->get();
        return response()->json($vistas);
    }

    function insertar(Request $request){
        
        $messages = [
            "nombre.required" => "Se requiere Nombre para el Plan."
        ];
        
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|String'
        ],$messages);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }
        $plan = new Planes;
        $plan->nombre = $request->nombre;
        $plan->costo = $request->costo;
        $plan->save();

        DB::table('planes_permisos')->where("idplan","=",$plan->id)->delete();
        $dcded = json_decode($request->permisos);
        for($x=0;$x<count($dcded);$x++){            
            DB::table('planes_permisos')->insert([
                "idplan" => $plan->id,
                "vista" => $dcded[$x]->vista,
                "activa" => $dcded[$x]->activa
            ]);
        }
        return response()->json([
            'message' => 'Se ha agregado el nuevo Plan: '.$request->nombre,
            'planid' => $plan->id
        ], 201);
            
    }

    function getplan(Request $request){
        $planes = Planes::findOrFail($request->id);
        $permisos = DB::table('planes_permisos')->where("idplan","=",$planes->id)->get();
        $data = ['data'=>$planes,'permisos'=>$permisos];
        return response()->json($data, 201);
    }

    function update(Request $request){
        $planes = Planes::findOrFail($request->id);
        $messages = [
            "nombre.required" => "Se requiere Nombre para el Plan."      
        ];
        
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|String',
        ],$messages);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $planes->nombre = $request->nombre;
        $planes->costo = $request->costo;
        $planes->save();

        DB::table('planes_permisos')->where("idplan","=",$planes->id)->delete();
        $dcded = json_decode($request->permisos);
        for($x=0;$x<count($dcded);$x++){
            
            DB::table('planes_permisos')->insert([
                "idplan" => $planes->id,
                "vista" => $dcded[$x]->vista,
                "activa" => $dcded[$x]->activa
            ]);
        }
        return response()->json([
            'message' => 'Se ha actualizado el Plan: '.$request->nombre,
            'planid' => $planes->id
        ], 201);
    }
}
