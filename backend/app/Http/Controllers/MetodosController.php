<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Metodos;
use App\Models\User;
use Validator;


class MetodosController extends Controller
{
    public function lista(Request $request) {
        $metodos = Metodos::where('idusuario',$request->idusuario)->get();
        return response()->json(['data'=>$metodos]);
    }
}
