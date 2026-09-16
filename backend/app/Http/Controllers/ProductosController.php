<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Productos;
use App\Models\User;

class ProductosController extends Controller
{
    function agregar(Request $request){
        $user = User::where('rfc','=',$request->rfc)->firstOrFail();
        
        $prod = New Productos;
        $prod->idusuario = $user->id;
        $prod->descripcion = $request->descripcion;
        $prod->nombreinterno = $request->nombreinterno;
        $prod->precio = $request->precio;
        $prod->claveproducto = $request->claveproducto;
        $prod->unidad = $request->unidad;
        $prod->cuentapredial = $request->cuentapredial;
        $prod->claveinterna = $request->claveinterna;
        $prod->noidentificacion = $request->noidentificacion;
        $prod->iva = $request->iva;
        $prod->ivaret = $request->ivaret;
        $prod->isr = $request->isr;
        $prod->ieps = $request->ieps;
        $prod->estatus = 1;
        $prod->save();
        
        return response()->json([
            'message' => 'Se ha registrado el nuevo producto: '.$request->descripcion,
            'id' => $prod->id
        ], 201);
    }

    function obtener(Request $request){
        $prod = Productos::where('id','=',$request->id)->firstOrFail();
       
        return response()->json([
            'result' => $prod
        ], 201);
    }

    function editar(Request $request){
        $prod = Productos::where('id','=',$request->id)->firstOrFail();
        
        $prod->idusuario = $request->idusuario;
        $prod->descripcion = $request->descripcion;
        $prod->nombreinterno = $request->nombreinterno;
        $prod->precio = $request->precio;
        $prod->claveproducto = $request->claveproducto;
        $prod->unidad = $request->unidad;
        $prod->cuentapredial = $request->cuentapredial;
        $prod->claveinterna = $request->claveinterna;
        $prod->noidentificacion = $request->noidentificacion;
        $prod->iva = $request->iva;
        $prod->ivaret = $request->ivaret;
        $prod->isr = $request->isr;
        $prod->ieps = $request->ieps;
        $prod->estatus = $request->estatus;
        $prod->save();
        
        return response()->json([
            'message' => 'Se ha actualizado el producto: '.$prod->descripcion,
            'id' => $prod->id
        ], 201);
    }

    function deshabilitar(Request $request){
        $prod = Productos::where('id','=',$request->id)->firstOrFail();
        $prod->estatus = 0;
        $prod->save();
        
        return response()->json([
            'message' => 'Se ha deshabilitado el producto: '.$prod->descripcion,
            'id' => $prod->id
        ], 201);
    }

    function habilitar(Request $request){
        $prod = Productos::where('id','=',$request->id)->firstOrFail();
        $prod->estatus = 1;
        $prod->save();
        
        return response()->json([
            'message' => 'Se ha habilitado el producto: '.$prod->descripcion,
            'id' => $prod->id
        ], 201);
    }
}
