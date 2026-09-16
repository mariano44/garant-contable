<?php

namespace App\Http\Controllers;
require_once base_path('SWSDK.php');
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Ejercicios;
use App\Models\Periodos;
use App\Models\Cfdis;
use SWServices\SatQuery\ServicioConsultaSAT as consultaCfdiSAT;


class EjerciciosController extends Controller
{   
    //
    function insertarEjercicio(Request $request){
        $user = User::where('rfc','=',$request->rfc)->firstOrFail();
        $ejercicios = Ejercicios::where([
                                            ['idusuario','=',$user->id],
                                            ['anio','=',$request->ejercicio]
                                        ])->first();

        if($ejercicios != NULL){
            return response()->json(["message"=>'Este ejercicio ya está registrado'],400);
        }
        // return response()->json(["result"=>$ejercicios]);
        $ejercicio = New Ejercicios();
        $ejercicio->idusuario = $user->id;
        $ejercicio->anio = $request->ejercicio;
        $ejercicio->save();
        return response()->json([
            'message' => 'Se ha registrado el nuevo ejercicio correctamente!',
            'ejercicio'=> $ejercicio->anio
        ], 201);
    }

    function insertarPeriodo(Request $request){
        $user = User::where('rfc','=',$request->rfc)->firstOrFail();
        $periodos = Periodos::where([
                        ['idusuario','=',$user->id],
                        ['ejercicio','=',$request->ejercicio],
                        ['periodo','=',$request->periodo]])
                      ->first();

        if($periodos != NULL){
            return response()->json(["message"=>'Este periodo ya está registrado'],400);
        }
        // return response()->json(["result"=>$ejercicios]);     
        $periodo = New Periodos();
        $periodo->idusuario = $user->id;
        $periodo->ejercicio = $request->ejercicio;
        $periodo->periodo = $request->periodo;
        $periodo->save();
        DB::table('periodoactivo')->insert([
            'idusuario' => $user->id,
            'cliente' => $request->rfc,
            'ejercicio'=>$request->ejercicio,
            'periodo'=>$request->periodo,
            'created_at'=>date('Y-m-d H:i:s'),
            'updated_at'=>date('Y-m-d H:i:s')
        ]);
        return response()->json([
            'message' => 'Se ha registrado el nuevo periodo correctamente!',
            'periodo'=> $periodo->periodo
        ], 201);
    }

    function guardarClasificacion(Request $request){
        // $user = User::where('rfc','=',$request->rfc)->firstOrFail();

        return response()->json([
            'message' => 'Se ha registrado la clasificación!'
        ], 201);
    }

    function insertarEmitidos(Request $request){
        $user = User::where('rfc','=',$request->rfc)->firstOrFail();
        $cfdiemitido = json_decode($request->xmls); 
        $cfdis = Cfdis::where([
            ['uuid','=',$cfdiemitido->uuid],
            ['cliente','=',$request->rfc]
            ])
        ->first();
                        
        if($cfdis != NULL){
            return response()->json(["message"=>'El XML:'.$cfdiemitido->uuid.' ya se encuentra en la plataforma.'],400);
        }
         
        $cfdi = New Cfdis();
        $cfdi->idusuario = $user->id;
        $cfdi->ejercicio = $request->ejercicio;
        $cfdi->periodo = $request->periodo;
        $cfdi->emisor = $request->rfc;
        $cfdi->receptor = $cfdiemitido->receptor;
        $cfdi->uuid = $cfdiemitido->uuid;
        $cfdi->rfc = $cfdiemitido->rfc;
        $cfdi->fecha = date("Y-m-d H:i:s",strtotime(str_replace("/","-",$cfdiemitido->fecha)));
        $cfdi->total = str_replace(",","",$cfdiemitido->total);
        $cfdi->siniva = str_replace(",","",$cfdiemitido->siniva);
        $cfdi->estado = $cfdiemitido->estado;
        $cfdi->tipo = $cfdiemitido->tipo;
        $cfdi->documento = $cfdiemitido->documento;
        $cfdi->file = $cfdiemitido->file;
        $cfdi->cliente = $request->rfc;
        $cfdi->filename = $cfdiemitido->filename;
        $cfdi->save();
        return response()->json([
            'cfdi'=> $cfdi->id
        ], 201);
    }

    function insertarRecibidos(Request $request){
        $user = User::where('rfc','=',$request->rfc)->firstOrFail();
        $cfdiemitido = json_decode($request->xmls); 
        $cfdis = Cfdis::where([
            ['uuid','=',$cfdiemitido->uuid],
            ['cliente','=',$request->rfc]
            ])
        ->first();
        
        if($cfdis != NULL){
            return response()->json(["message"=>'El XML:'.$cfdiemitido->uuid.' ya se encuentra en la plataforma.'],400);
        }
        // return response()->json(["result"=>$ejercicios]);  
        
        $cfdi = New Cfdis();
        $cfdi->idusuario = $user->id;
        $cfdi->ejercicio = $request->ejercicio;
        $cfdi->periodo = $request->periodo;
        $cfdi->emisor = $cfdiemitido->emisor;
        $cfdi->receptor = $request->rfc;
        $cfdi->uuid = $cfdiemitido->uuid;
        $cfdi->rfc = $cfdiemitido->rfc;
        $cfdi->fecha = date("Y-m-d H:i:s",strtotime(str_replace("/","-",$cfdiemitido->fecha)));
        $cfdi->total = str_replace(",","",$cfdiemitido->total);
        $cfdi->siniva = str_replace(",","",$cfdiemitido->siniva);
        $cfdi->estado = $cfdiemitido->estado;
        $cfdi->tipo = $cfdiemitido->tipo;
        $cfdi->documento = $cfdiemitido->documento;
        $cfdi->file = $cfdiemitido->file;
        $cfdi->cliente = $request->rfc;
        $cfdi->filename = $cfdiemitido->filename;
        $cfdi->save();
        return response()->json([
            'cfdi'=> $cfdi->id
        ], 201);
    }

    function inesrtarNomina(Request $request){
        $user = User::where('rfc','=',$request->rfc)->firstOrFail();
        $cfdiemitido = json_decode($request->xmls); 
        $cfdis = Cfdis::where([
            ['uuid','=',$cfdiemitido->uuid],
            ['cliente','=',$request->rfc]
            ])
        ->first();

        if($cfdis != NULL){
            return response()->json(["message"=>'El XML:'.$cfdiemitido->uuid.' ya se encuentra en la plataforma.'],400);
        }   
         
        $cfdi = New Cfdis();
        $cfdi->idusuario = $user->id;
        $cfdi->ejercicio = $request->ejercicio;
        $cfdi->periodo = $request->periodo;
        $cfdi->emisor = $request->rfc;
        $cfdi->receptor = $cfdiemitido->receptor;
        $cfdi->uuid = $cfdiemitido->uuid;
        $cfdi->rfc = $cfdiemitido->rfc;
        $cfdi->fecha = date("Y-m-d H:i:s",strtotime(str_replace("/","-",$cfdiemitido->fecha)));
        $cfdi->total = str_replace(",","",$cfdiemitido->total);
        $cfdi->estado = $cfdiemitido->estado;
        $cfdi->tipo = $cfdiemitido->tipo;
        $cfdi->documento = $cfdiemitido->documento;
        $cfdi->file = $cfdiemitido->file;
        $cfdi->rubros = 'Sueldos y salarios';
        $cfdi->cliente = $request->rfc;
        $cfdi->filename = $cfdiemitido->filename;
        $cfdi->save();
        return response()->json([
            'cfdi'=> $cfdi->id
        ], 201);
    }

    function getCFDIs(Request $request){        
        $user = User::where('rfc','=',$request->cliente)->firstOrFail();        
        
        $cfdis = DB::table('cfdis')->where([
            ['idusuario','=',$user->id],
            ['ejercicio','=',$request->ejercicio],
            ['periodo','=',$request->periodo],
            ])
        ->get();
        $result = array();
        foreach($cfdis as $cfdi){
            array_push($result,$cfdi);            
        }
        
        return response()->json([
            'result'=> $result
        ], 201);
    }

    function getGraficaRubros(Request $request){        
        $user = User::where('rfc','=',$request->cliente)->firstOrFail();        
        
        $cfdis = DB::table('cfdis')
                ->select(DB::raw('ROUND(sum(total),2) as cuantas, ROUND(sum(siniva),2) as cuantasdos, rubros'))
                ->where([ ['idusuario', '=', $user->id],
                          ['ejercicio','=',$request->ejercicio],
                          ['periodo','=',$request->periodo],
                          ['estado','=','Vigente'],
                          ['rubros','<>',NULL]
                        ])
                ->groupBy('rubros')
                ->orderByRaw('cuantas DESC')
                ->get();
        $result = array();
        foreach($cfdis as $cfdi){
            array_push($result,$cfdi);            
        }
        
        return response()->json([
            'result'=> $result
        ], 201);
    }

    function getHistorico(Request $request){        
        $user = User::where('rfc','=',$request->cliente)->firstOrFail();        
        $meses = array('01','02','03','04','05','06','07','08','09','10','11','12');
        $result = array();
        for($x=0;$x<count($meses);$x++){
            $result[$meses[$x]] = array();
            $cfdis = DB::table('cfdis')->where([
                ['idusuario','=',$user->id],
                ['ejercicio','=',$request->ejercicio],
                ['periodo','=',$meses[$x]]
                ])
            ->get();
            
            if($cfdis->count()>0){
                $neto = 0;
                $egresos = 0;
                $ingresos = 0;
                $netoT = 0;
                $egresosT = 0;
                $ingresosT = 0;
                foreach($cfdis as $cfdi){
                    if($cfdi->emisor == $request->cliente && $cfdi->tipo != 'Nómina'){
                        $ingresos+=$cfdi->siniva;
                        $ingresosT+=$cfdi->total;
                    }
                    if($cfdi->tipo == 'Nómina'){
                        $egresos+=$cfdi->total;
                    }
                    if($cfdi->receptor == $request->cliente){
                        $egresos+=$cfdi->siniva;
                        $egresosT+=$cfdi->total;
                    }
                }
                $neto = $ingresos - $egresos;
                $netoT = $ingresosT - $egresosT;
                $result[$meses[$x]]['neto'] = number_format($neto,2,'.','')*1;
                $result[$meses[$x]]['ingresos'] = number_format($ingresos,2,'.','')*1;
                $result[$meses[$x]]['egresos'] = number_format(($egresos*-1),2,'.','')*1;
                $result[$meses[$x]]['netoT'] = number_format($netoT,2,'.','')*1;
                $result[$meses[$x]]['ingresosT'] = number_format($ingresosT,2,'.','')*1;
                $result[$meses[$x]]['egresosT'] = number_format(($egresosT*-1),2,'.','')*1;
            }else{
                $result[$meses[$x]]['neto'] = 0;
                $result[$meses[$x]]['ingresos'] = 0;
                $result[$meses[$x]]['egresos'] = 0;
                $result[$meses[$x]]['netoT'] = 0;
                $result[$meses[$x]]['ingresosT'] = 0;
                $result[$meses[$x]]['egresosT'] = 0;
            }            
        }        

        return response()->json([
            'result'=> $result
        ], 201);
    }

    function getHistoricoMensual(Request $request){        
        $user = User::where('rfc','=',$request->cliente)->firstOrFail();
        $dias = array();
        if($request->periodo == str_pad(date('m'),2,'0',STR_PAD_LEFT)){
            for($x=0;$x<intval(date('d'));$x++){
                array_push($dias,str_pad(($x+1),2,'0',STR_PAD_LEFT));
            }
        }else{
            for($x=0;$x<intval(date('t',strtotime($request->ejercicio."-".$request->periodo."-01")));$x++){
                array_push($dias,str_pad(($x+1),2,'0',STR_PAD_LEFT));
            }
        }
        
        $result = array();
        for($x=0;$x<count($dias);$x++){
            $result[$dias[$x]] = array();
            $cfdis = DB::table('cfdis')
                ->where([
                  ['idusuario','=',$user->id],
                  ['ejercicio','=',$request->ejercicio],
                  ['periodo','=',$request->periodo]
                ])
                ->whereRaw("DATE_FORMAT(fecha, '%Y-%m-%d') = '".$request->ejercicio."-".$request->periodo."-".$dias[$x]."'")
            ->get();
            
            if($cfdis->count()>0){
                $neto = 0;
                $egresos = 0;
                $ingresos = 0;
                $netoT = 0;
                $egresosT = 0;
                $ingresosT = 0;
                foreach($cfdis as $cfdi){
                    if($cfdi->emisor == $request->cliente && $cfdi->tipo != 'Nómina'){
                        $ingresos+=$cfdi->siniva;
                        $ingresosT+=$cfdi->total;
                    }
                    if($cfdi->tipo == 'Nómina'){
                        $egresos+=$cfdi->total;
                    }
                    if($cfdi->receptor == $request->cliente){
                        $egresos+=$cfdi->siniva;
                        $egresosT+=$cfdi->total;
                    }
                }
                $neto = $ingresos - $egresos;
                $netoT = $ingresosT - $egresosT;
                $result[$dias[$x]]['neto'] = number_format($neto,2,'.','')*1;
                $result[$dias[$x]]['ingresos'] = number_format($ingresos,2,'.','')*1;
                $result[$dias[$x]]['egresos'] = number_format(($egresos*-1),2,'.','')*1;
                $result[$dias[$x]]['netoT'] = number_format($netoT,2,'.','')*1;
                $result[$dias[$x]]['ingresosT'] = number_format($ingresosT,2,'.','')*1;
                $result[$dias[$x]]['egresosT'] = number_format(($egresosT*-1),2,'.','')*1;
            }else{
                $result[$dias[$x]]['neto'] = 0;
                $result[$dias[$x]]['ingresos'] = 0;
                $result[$dias[$x]]['egresos'] = 0;
                $result[$dias[$x]]['netoT'] = 0;
                $result[$dias[$x]]['ingresosT'] = 0;
                $result[$dias[$x]]['egresosT'] = 0;
            }
        }
        return response()->json([
            'result'=> $result
        ], 201);
    }

    function getEjercicioAbierto(Request $request){
        $getPeriodoActivo = DB::table('periodoactivo')->where('cliente','=',$request->cliente)->get(); 
        $result = '';
        foreach($getPeriodoActivo as $periodo){
            $result = $periodo;
        }
        return response()->json([
            'result'=> $result
        ], 201);
        
    }

    function getPendientes(Request $request){        
        $cfdis = DB::table('cfdis')
                ->where([ 
                          ['receptor','=',$request->cliente],
                          ['ejercicio','=',$request->ejercicio],
                          ['periodo','=',$request->periodo],
                          ['estado','=','Vigente']
                        ])
                ->whereNull('rubros')
                ->get(); 
        
        $result = array();
        foreach($cfdis as $cfdi){
            array_push($result,$cfdi);
            header('Content-Type: text/plain');
            $soapURL = "https://consultaqr.facturaelectronica.sat.gob.mx/ConsultaCFDIService.svc?wsdl";

            $re = $cfdi->rfc;
            $rr = $cfdi->receptor;
            $tt = $cfdi->total;
            $uuid = $cfdi->uuid;
            $consultaCfdi = consultaCfdiSAT::ServicioConsultaSAT($soapURL,$re,$rr,$tt,$uuid);             
            $result[count($result)-1]->nuevoestado = $consultaCfdi;

        }
        
        $clasificados = DB::table('cfdis')
                ->where([ 
                          ['cliente','=',$request->cliente],
                          ['ejercicio','=',$request->ejercicio],
                          ['periodo','=',$request->periodo]                          
                        ])
                ->whereNotNull('rubros')
                ->get(); 
        
        $resultc = array();
        foreach($clasificados as $clasificado){
            array_push($resultc,$clasificado);
            header('Content-Type: text/plain');
            $soapURL = "https://consultaqr.facturaelectronica.sat.gob.mx/ConsultaCFDIService.svc?wsdl";
            if($clasificado->emisor == $request->cliente){
                $re = $clasificado->emisor;
                $rr = $clasificado->rfc;
            }else{
                $re = $clasificado->rfc;
                $rr = $clasificado->receptor;
            }
            if($clasificado->tipo == 'Pago'){
                $tt = 0;
            }else{
                $tt = $clasificado->total;
            }
            
            $uuid = $clasificado->uuid;
            $consultaCfdi = consultaCfdiSAT::ServicioConsultaSAT($soapURL,$re,$rr,$tt,$uuid);
            
            $resultc[count($resultc)-1]->nuevoestado = $consultaCfdi;
        }

        return response()->json([
            'result'=> $result,
            'resultc'=> $resultc
        ], 201);
        
    }

    function guardarRubros(Request $request){
        $pendientes = json_decode($request->rubros);
        for($x=0;$x<count($pendientes);$x++){
            $affected = DB::table('cfdis')
              ->where('id', $pendientes[$x]->id)
              ->update(['rubros' => $pendientes[$x]->rubro]);
        }
        
        return response()->json([
            'affected'=> 'guardadas'
        ], 201);
    }

    function consultaCFDI(Request $request){
        header('Content-Type: text/plain');
        $soapURL = "https://consultaqr.facturaelectronica.sat.gob.mx/ConsultaCFDIService.svc?wsdl";
        $re = $request->re;
        $rr = $request->rr;
        $tt = $request->tt;
        $uuid = $request->uuid;
        $consultaCfdi = consultaCfdiSAT::ServicioConsultaSAT($soapURL,$re,$rr,$tt,$uuid);
        return response()->json([
            'message'=> $consultaCfdi
        ], 201);
        
    }

    function actRubros(Request $request){       
         
        $clasificados = json_decode($request->rubros);
        
        for($x=0;$x<count($clasificados);$x++){
            $affected = DB::table('cfdis')
              ->where('id', $clasificados[$x]->id)
              ->update(['rubros' => $clasificados[$x]->rubro]);
        }
        
        return response()->json([
            'affected'=> 'guardadas'
        ], 201);
    }

    // 01 / 03 /2021

    function getGraficaRubrosPorEjercicio(Request $request){        
        $user = User::where('rfc','=',$request->cliente)->firstOrFail();        
        
        $cfdis = DB::table('cfdis')
                ->select(DB::raw('ROUND(sum(total),2) as cuantas, ROUND(sum(siniva),2) as cuantasdos, rubros'))
                ->where([ ['idusuario', '=', $user->id],
                          ['ejercicio','=',$request->ejercicio],
                          ['estado','=','Vigente'],
                          ['rubros','<>',NULL]
                        ])
                ->groupBy('rubros')
                ->orderByRaw('cuantas DESC')
                ->get();
        $result = array();
        foreach($cfdis as $cfdi){
            array_push($result,$cfdi);            
        }
        
        return response()->json([
            'result'=> $result
        ], 201);
    }


}
