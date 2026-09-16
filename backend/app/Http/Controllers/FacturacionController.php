<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Facturacion;
use App\Models\Clientes;
use App\Models\Productos;
use App\Models\User;
use App\Models\Sellos;
use CodeDredd\Soap\Facades\Soap;
use ZipArchive;
// Timbrado CFDI 3.3: sellado local con el CSD y envio al PAC por SOAP.
class FacturacionController extends Controller
{
    function checkTimbres(Request $request){
        $user = User::where('rfc','=',$request->rfc)->firstOrFail();
        if($user->timbres < 1 || $user->timbres == null){
            return response()->json(["msg"=> 'notiene']);
        }else{
            return response()->json(["msg"=> 'puedefacturar']);
        }
    }
    function listas(Request $request){
        $user = User::where('rfc','=',$request->rfc)->firstOrFail();
        $facturas = Facturacion::where('idusuario','=',$user->id)->get();
        $clientes = Clientes::where([
            ['idusuario','=',$user->id],
            ['estatus','=',1]
        ])->get();
        $productos = Productos::where([
            ['idusuario','=',$user->id],
            ['estatus','=',1]
        ])->get();
        return response()->json(["facturas"=> $facturas,"clientes"=>$clientes,"productos"=>$productos]);
    }

    function timbrar(Request $request){
        $user = User::where('rfc','=',$request->rfc)->firstOrFail();
        $cliente = Clientes::where('id','=',$request->idcliente)->first();
        $cfdi = new Facturacion();
        $masschemas="";
        // $cfdi->idusuario = $user->id;
        // $cfdi->idcliente = $request->idcliente;
        // $cfdi->tipo = $request->tipo;
        // $cfdi->formadepago = $request->formadepago;
        // $cfdi->metododepago = $request->metododepago;
        // $cfdi->usocfdi = $request->usocfdi;
        // $cfdi->moneda = $request->moneda;
        // $cfdi->tipocambio = $request->tipocambio;
        // $cfdi->fechaemision = date('Y-m-d',strtotime($request->fechaemision));
        // $cfdi->cp = $request->cp;
        // $cfdi->subtotal = $request->subtotal;
        // $cfdi->importeiva = json_encode($request->impiva);
        // $cfdi->tasaiva = json_encode($request->tasaiva);
        // $cfdi->importeret = $request->impret;
        // $cfdi->tasaret = $request->tasaret;
        // $cfdi->importeisr = $request->impisr;
        // $cfdi->tasaisr = $request->tasaisr;
        // $cfdi->total = $request->total;
        // $cfdi->descuento = $request->descuento;
        // $cfdi->prueba = $request->prueba;
        // $cfdi->foliointerno = $request->foliointerno;

        // $cfdi->save();
        $conceptos = '';    
        // $idfact = $cfdi->id;
        
        for($x=0;$x<count($request->conceptos);$x++){
        $conceptos.='
            <cfdi:Concepto ClaveProdServ="'.$request->conceptos[$x]['claveproducto'].'" ClaveUnidad="'.$request->conceptos[$x]['claveunidad'].'" Cantidad="'.$request->conceptos[$x]['cantidad'].'" Unidad="NO APLICA" Descripcion="'.html_entity_decode($request->conceptos[$x]['concepto']).'" ValorUnitario="'.$request->conceptos[$x]['valorunitario'].'" Importe="'.$request->conceptos[$x]['importe'].'" '.($request->conceptos[$x]['descuento'] != 0 ? 'Descuento="'.$request->conceptos[$x]['descuento'].'"' : '').'>';
            $conceptos.='
                <cfdi:Impuestos>
                    <cfdi:Traslados>
                        <cfdi:Traslado Base="'.$request->conceptos[$x]['importe'].'" Impuesto="002" TipoFactor="Tasa" TasaOCuota="'.number_format(($request->conceptos[$x]['tasaiva']/100),6,'.','').'" Importe="'.$request->conceptos[$x]['impiva'].'"/>
                    </cfdi:Traslados>
                </cfdi:Impuestos>
            </cfdi:Concepto>';
            
            // DB::table('facturacionconceptos')->insert([
            //     'idcfdi'=>$idfact,
            //     'idproducto'=>$request->conceptos[$x]['idproducto'],
            //     'cantidad'=>$request->conceptos[$x]['cantidad'],
            //     'valorunitario'=>$request->conceptos[$x]['valorunitario'],
            //     'claveproducto'=>$request->conceptos[$x]['claveproducto'],
            //     'claveunidad'=>$request->conceptos[$x]['claveunidad'],
            //     'importeiva'=>$request->conceptos[$x]['impuesto'],
            //     'tasaiva'=>$request->conceptos[$x]['tasaiva'],
            //     'importe'=>$request->conceptos[$x]['impiva'],
            //     'tasaret'=>$request->conceptos[$x]['tasaret'],
            //     'importeret'=>$request->conceptos[$x]['impret'],
            //     'tasaisr'=>$request->conceptos[$x]['tasaisr'],
            //     'importeisr'=>$request->conceptos[$x]['impisr'],
            //     'created_at'=>date('Y-m-d H:i:s'),
            //     'updated_at'=>date('Y-m-d H:i:s')
            // ]);
        }
        $importetotalivas = 0;
        $traslados = '<cfdi:Traslados>';
        for($i=0;$i<count($request->tasaiva);$i++){
            $importetotalivas += $request->importeiva[$i]['total'];
            $traslados .= '<cfdi:Traslado Impuesto="002" TipoFactor="Tasa" TasaOCuota="'.number_format(($request->tasaiva[$i]['tasa']/100),6,'.','').'" Importe="'.number_format($request->importeiva[$i]['total'],2,'.','').'"/>';
        }
        $traslados .= '</cfdi:Traslados>';
        $impuestos = '
        <cfdi:Impuestos TotalImpuestosTrasladados="'.number_format($importetotalivas,2,'.','').'">
            '.$traslados.'
        </cfdi:Impuestos>';
         $fecha = date('Y-m-d',strtotime($request->fechaemision))."T".date('H:i:s');
         $xml='<?xml version="1.0" encoding="UTF-8"?>
         <cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sat.gob.mx/cfd/3 http://www.sat.gob.mx/sitio_internet/cfd/3/cfdv33.xsd" '.$masschemas.' '.
                'Version="3.3" '.
                'Serie="A" 
                 Folio="00000001" '.
                ($request->foliointerno != '' ?
                'Folio="'.$request->foliointerno.'" ' : '').' '.
                'Fecha="'.$fecha.'" '.
                'SubTotal="'.number_format($request->subtotal,2,'.','').'" '.
                'Moneda="'.$request->moneda.'" '.
                'Total="'.number_format($request->total,2,'.','').'" '.
                'TipoDeComprobante="'.$request->tipo.'" '.
                'FormaPago="'.$request->formadepago.'" '.
                'MetodoPago="'.$request->metododepago.'" '.
                'TipoCambio="1" '.
                ($request->descuento != 0 ? 'Descuento="'.number_format($request->descuento,2,'.','').'"' : '' ).' '.
                'LugarExpedicion="'.$request->cp.'">
            <cfdi:Emisor Rfc="'.$user->rfc.'" Nombre="'.html_entity_decode($user->razonsocial).'" RegimenFiscal="'.$user->regimen.'"></cfdi:Emisor>
            <cfdi:Receptor Rfc="'.$cliente->rfc.'" Nombre="'.strtoupper(html_entity_decode(str_replace("&", "amp;", $cliente->razonsocial))).'" UsoCFDI="'.$request->usocfdi.'"></cfdi:Receptor>
            <cfdi:Conceptos>'.$conceptos.'
            </cfdi:Conceptos>'.$impuestos.'
        </cfdi:Comprobante>';

        $sellos = Sellos::where('idusuario',"=",$user->id)->first();
        $llave = $sellos->csdkey;
        $cert = $sellos->csdcer;
        $passpriv = $sellos->passcsd;
        $rutakey = "openssl pkcs8 -inform DER -in ".$llave." -out ".$llave.".pem -passin pass:".$passpriv;
        exec($rutakey,$output,$return);
        
        $rutacer = "openssl x509 -inform DER -outform PEM -in ".$cert." -pubkey > ".$cert.".pem";
        exec($rutacer,$output,$return_val);
        $llavepem = $sellos->csdkey.".pem";
        $cerpem = $sellos->csdcer.".pem";
        
        $serieCertificado = explode("=",shell_exec("openssl x509 -in ".$cerpem." -serial -noout 2>&1"));
        $nocertificado = '';
        for($in=0;$in<strlen(trim($serieCertificado[1]));$in+=2){
            $t = substr($serieCertificado[1],$in,2)." ";
            $nocertificado .= substr($t,1,1);
        }
        // var_dump(openssl_x509_parse(file_get_contents($cerpem)));
        $passpriv = $sellos->passcsd;
        $der_data = file_get_contents($sellos->csdcer);
        
        $der2pem = $this->der2pem($der_data,'CERTIFICATE');
        $private = openssl_pkey_get_private(file_get_contents($llavepem),$passpriv);

        $paso =  openssl_x509_parse(openssl_x509_read(file_get_contents($cerpem)));
        
        $certificado = str_replace(array('\n', '\r'), '', base64_encode($der_data));
        $xdoc = new \DomDocument();

        $xdoc->loadXML($this->replace_specials_characters(mb_convert_encoding(($xml), 'ISO-8859-1', 'UTF-8'))) or die("XML invalido");

        $XSL = new \DOMDocument();
        $cadenaxlts = public_path('utilerias/XSLT32/cadenaoriginal_3_3.xslt');
        // $cadenaxlts = 'C:\Users\DELL\garant\public\utilerias\XSLT32\cadenaoriginal_3_3.xslt';
        $XSL->load($cadenaxlts);
        $c = $xdoc->getElementsByTagNameNS('http://www.sat.gob.mx/cfd/3', 'Comprobante')->item(0); 
        $c->setAttribute('NoCertificado', $nocertificado);
        $proc = new \XSLTProcessor;
        $proc->importStyleSheet($XSL);
        $cadena_original = $proc->transformToXML($xdoc);
        $cadena_original = $cadena_original;
        if($private!=""){   
            
            openssl_sign($cadena_original, $sig, $private, OPENSSL_ALGO_SHA256);            
            $sello = base64_encode($sig);
            $sello=$sello;
            $certificado=$certificado;
            $serialNumber=$nocertificado;
            $c->setAttribute('Certificado', $certificado);
            $c->setAttribute('Sello', $sello);
            $xml2=$xdoc->saveXML();
            $xml2 = substr($xml2,0,-1);
            
            $xmlfile =public_path()."/Sellos/".$request->rfc."/".$user->id."/".$request->tipo."_".$cliente->rfc.'.xml';
            file_put_contents($xmlfile,$xml2);
            $xmlname = $request->tipo."_".$cliente->rfc.'.xml';
            $zip = new \ZipArchive();
            $zipname = $request->tipo."_".$cliente->rfc.'.zip';
            $zip->open(public_path()."/Sellos/".$request->rfc."/".$user->id."/".$zipname, ZIPARCHIVE::CREATE | ZIPARCHIVE::OVERWRITE);
            $zip->addFile($xmlfile,$xmlname);
            $zip->close();
            ob_clean();
            $XMLZIP = file_get_contents(public_path()."/Sellos/".$request->rfc."/".$user->id."/".$request->tipo."_".$cliente->rfc.".zip");
            $XMLZIP = base64_encode($XMLZIP);
            
            if($user->periodoprueba === 1){
                $userPAC = config('app.pusuario');
                $passPAC = config('app.ppassword');
                $idequipo = config('app.pidequipo');
                $urltimbrado = config('app.pwsdl');
            }else{
                $userPAC = config('app.tusuario');
                $passPAC = config('app.tpassword');
                $idequipo = config('app.tidequipo');
                $urltimbrado = config('app.twsdl');
            }
            $param = array(
                'Usuario'=>$userPAC,
                'Password'=>$passPAC,
                'archivoXMLZip'=>$XMLZIP,
                'Serie'=>'',
                'IdEquipo'=>$idequipo
            );
            
            try {
                
                $client = new \nusoap_client($urltimbrado,true);
                $client->soap_defencoding = 'UTF-8';
                
                // $file = tempnam("tmp", "zip");
                // file_put_contents($file,base64_decode($rst['return']));
                // $zip = zip_open($file);
            
                // if ($zip){
                //     while ($zip_entry = zip_read($zip)){
                //         if (zip_entry_open($zip, $zip_entry)){                  
                //             $contents = zip_entry_read($zip_entry,10000);                 
                //             zip_entry_close($zip_entry);
                //         }     
                //     }
                //     zip_close($zip);
                // }            

                // unlink($file);
                // var_dump($contents);exit;
                // return response()->json(["msg"=>$req->body()]);
            
            }catch(Exception $e) {
                echo 'Excepción capturada: ',  $e->getMessage(), "\n";
            }
            $rst = $client->call("getCFDI", $param);

            if ($client->getError()) {
                return response()->json([
                    "error" => "El PAC rechazo el timbrado.",
                    "detalle" => $client->getError()
                ], 502);
            }

            return response()->json([
                "message" => "CFDI timbrado correctamente.",
                "acuse" => $rst,
                "xml" => $xml2
            ], 201);
        }    

        return response()->json(["xml"=>$xml]);
    }

    function der2pem($der_data, $type) {
        $pem = chunk_split(base64_encode($der_data), 64, "\n");
        $pem = "-----BEGIN ".$type."-----\n".$pem."-----END ".$type."-----\n";
        return $pem;
    }

    function replace_specials_characters($s) {
        $s = preg_replace(utf8_decode("/á|à|â|ã|ª/"),"a",$s);
        $s = preg_replace(utf8_decode("/Á|À|Â|Ã/"),"A",$s);
        $s = preg_replace(utf8_decode("/é|è|ê/"),"e",$s);
        $s = preg_replace(utf8_decode("/É|È|Ê/"),"E",$s);
        $s = preg_replace(utf8_decode("/í|ì|î/"),"i",$s);
        $s = preg_replace(utf8_decode("/Í|Ì|Î/"),"I",$s);
        $s = preg_replace(utf8_decode("/ó|ò|ô|õ|º/"),"o",$s);
        $s = preg_replace(utf8_decode("/Ó|Ò|Ô|Õ/"),"O",$s);
        $s = preg_replace(utf8_decode("/ú|ù|û/"),"u",$s);
        $s = preg_replace(utf8_decode("/Ú|Ù|Û/"),"U",$s);
        $s = str_replace(utf8_decode("ñ"),"n",$s);
        $s = str_replace(utf8_decode("Ñ"),"N",$s);      
        return $s;
    }

    function convierte($dec) {
        $hex=bcdechex($dec);
        $ser="";
        for ($i=1; $i<strlen($hex); $i=$i+2) {
            $ser.=substr($hex,$i,1);
        }
        return $ser;
    }

    function bcdechex($dec) {
        $last = bcmod($dec, 16);
        $remain = bcdiv(bcsub($dec, $last), 16);
        if($remain == 0) {
            return dechex($last);
        } else {
            return bcdechex($remain).dechex($last);
        }
    }
}
