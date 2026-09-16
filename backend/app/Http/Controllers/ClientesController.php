<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Clientes;
use App\Models\User;

class ClientesController extends Controller
{
    function agregar(Request $request){
        
        $user = User::where('rfc','=',$request->rfc)->firstOrFail();
        
        $cliente = New Clientes;
        $cliente->idusuario = $user->id;
        $cliente->razonsocial = $request->razonsocial;
        $cliente->rfc = $request->rfccliente;
        $cliente->correo = $request->correo;
        $cliente->calle = $request->calle;
        $cliente->noext = $request->noext;
        $cliente->noint = $request->noint;
        $cliente->colonia = $request->colonia;
        $cliente->ciudad = $request->ciudad;
        $cliente->cp = $request->cp;
        $cliente->estado = $request->estado;
        $cliente->telefono = $request->telefono;
        $cliente->estatus = 1;
        $cliente->save();
        
        return response()->json([
            'message' => 'Se ha registrado el nuevo cliente: '.$cliente->razonsocial,
            'id' => $cliente->id,
            'idusuario' => $user->id
        ], 201);
    }

    function obtener(Request $request){
        $cliente = Clientes::where('id','=',$request->id)->firstOrFail();
       
        return response()->json([
            'result' => $cliente
        ], 201);
    }

    function editar(Request $request){
        $cliente = Clientes::where('id','=',$request->id)->firstOrFail();
        
        $cliente->idusuario = $request->idusuario;
        $cliente->razonsocial = $request->razonsocial;
        $cliente->rfc = $request->rfccliente;
        $cliente->correo = $request->correo;
        $cliente->calle = $request->calle;
        $cliente->noext = $request->noext;
        $cliente->noint = $request->noint;
        $cliente->colonia = $request->colonia;
        $cliente->ciudad = $request->ciudad;
        $cliente->cp = $request->cp;
        $cliente->estado = $request->estado;
        $cliente->telefono = $request->telefono;
        $cliente->estatus = $request->estatus;
        $cliente->save();
        
        return response()->json([
            'message' => 'Se ha actualizado el cliente: '.$cliente->razonsocial,
            'id' => $cliente->id
        ], 201);
    }

    function deshabilitar(Request $request){
        $cliente = Clientes::where('id','=',$request->id)->firstOrFail();
        $cliente->estatus = 0;
        $cliente->save();
        
        return response()->json([
            'message' => 'Se ha deshabilitado el cliente: '.$cliente->razonsocial,
            'id' => $cliente->id
        ], 201);
    }

    function habilitar(Request $request){
        $cliente = Clientes::where('id','=',$request->id)->firstOrFail();
        $cliente->estatus = 1;
        $cliente->save();

        return response()->json([
            'message' => 'Se ha habilitado el cliente: '.$cliente->razonsocial,
            'id' => $cliente->id
        ], 201);
    }

}
