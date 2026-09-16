<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Rol;
use Validator;
use ZipArchive;

class RolController extends Controller
{
    function lista(){      
        return response()->json(["result"=> Rol::all()]);
    }

    function getVistas(){
        $vistas = DB::table('vistas')->get();
        return response()->json($vistas);
    }

    function insertar(Request $request){
        
        $messages = [
            "nombre.required" => "Se requiere Nombre para el Rol."      
        ];
        
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|String',
        ],$messages);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }
        $roles = new Rol;
        $roles->nombre = $request->nombre;
        $roles->descripcion = $request->descripcion;
        $roles->save();

        DB::table('rols_permisos')->where("idrol","=",$roles->id)->delete();
        $dcded = json_decode($request->permisos);
        for($x=0;$x<count($dcded);$x++){
            
            DB::table('rols_permisos')->insert([
                "idrol" => $roles->id,
                "vista" => $dcded[$x]->vista,
                "lista" => $dcded[$x]->lista,
                "edicion" => $dcded[$x]->edicion,
                "creacion" => $dcded[$x]->creacion,
                "eliminar" => $dcded[$x]->eliminar
            ]);
        }
        return response()->json([
            'message' => 'Se ha agregado el nuevo Rol: '.$request->nombre,
            'rolid' => $roles->id
        ], 201);
            
    }

    function getrol(Request $request){
        $roles = Rol::findOrFail($request->id);
        $permisos = DB::table('rols_permisos')->where("idrol","=",$roles->id)->get();
        $data = ['data'=>$roles,'permisos'=>$permisos];
        return response()->json($data, 201);
    }

    function update(Request $request){
        $roles = Rol::findOrFail($request->id);
        $messages = [
            "nombre.required" => "Se requiere Nombre para el Rol."      
        ];
        
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|String',
        ],$messages);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $roles->nombre = $request->nombre;
        $roles->descripcion = $request->descripcion;
        $roles->save();

        DB::table('rols_permisos')->where("idrol","=",$roles->id)->delete();
        $dcded = json_decode($request->permisos);
        for($x=0;$x<count($dcded);$x++){
            
            DB::table('rols_permisos')->insert([
                "idrol" => $roles->id,
                "vista" => $dcded[$x]->vista,
                "lista" => $dcded[$x]->lista,
                "edicion" => $dcded[$x]->edicion,
                "creacion" => $dcded[$x]->creacion,
                "eliminar" => $dcded[$x]->eliminar
            ]);
        }
        return response()->json([
            'message' => 'Se ha actualizado el Rol: '.$request->nombre,
            'rolid' => $roles->id
        ], 201);
    }
}
