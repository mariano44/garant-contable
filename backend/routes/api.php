<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SellosController;
use App\Http\Controllers\MetodosController;
use App\Http\Controllers\PasswordResetRequestController;
use App\Http\Controllers\ChangePasswordController;
use App\Http\Controllers\RolController;
use App\Http\Controllers\PlanesController;
use App\Http\Controllers\ConfigController;
use App\Http\Controllers\EjerciciosController;
use App\Http\Controllers\DocumentosController;
use App\Http\Controllers\PagosController;
use App\Http\Controllers\FacturacionController;
use App\Http\Controllers\ClientesController;
use App\Http\Controllers\ProductosController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::get('/checkToken', [AuthController::class, 'isValidToken']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/nuevo', [AuthController::class, 'nuevo']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/user-profile', [AuthController::class, 'userProfile']);
    Route::get('/users/{tipo}/{estado}/{rolid}', [AuthController::class, 'listado']);
    Route::get('/users/listadoasignado/{userid}/{tipo}/{estado}', [AuthController::class, 'listadoAsignado']);
    Route::post('/reset-password-request', [PasswordResetRequestController::class, 'sendPasswordResetEmail']);
    Route::post('/change-password', [ChangePasswordController::class, 'passwordResetProcess']);
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'perfil'
], function ($router) {
    Route::get("/{id}", [ProfileController::class, 'profile']);
    Route::post("/update", [ProfileController::class, 'update']);
    Route::post("/updatecontador", [ProfileController::class, 'updatecontador']);
    Route::post("/actualizarplan", [ProfileController::class, 'actualizarplan']);
    Route::post("/actualizarrol", [ProfileController::class, 'actualizarrol']);
    Route::post("/insertarlogo", [ProfileController::class, 'insertarlogo']);
    Route::post("/fotoperfil", [ProfileController::class, 'insertarfotoperfil']);
    Route::post('/cambiarcontra', [ProfileController::class, 'cambiarcontrasenia']);    
    Route::get("/obt/{idusuario}", [SellosController::class, 'obtener']);
    Route::post("/insert/ciec", [SellosController::class, 'insertarciec']);
    Route::post("/insert/fiel", [SellosController::class, 'insertarfiel']);
    Route::post("/insert/csd", [SellosController::class, 'insertarcsd']);
    Route::post('/descargararchivo', [SellosController::class, 'descargararchivo']);
    Route::post('/cancelarsuscripcion', [ProfileController::class, 'cancelarsuscripcion']);
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'perfil'
], function ($router) {
    Route::get("/metodos/{idusuario}", [MetodosController::class, 'lista']);
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'admin'
], function ($router) {
    Route::get("/roles", [RolController::class, 'lista']);
    Route::get("/roles/getVistas", [RolController::class, 'getVistas']);
    Route::post("/roles/insertar", [RolController::class, 'insertar']);
    Route::get("/roles/editar/{id}", [RolController::class, 'getrol']);
    Route::post("/roles/editar", [RolController::class, 'update']);
    Route::get('/porplan/{plan}', [AuthController::class, 'usuariosporplan']);
    Route::post("/asignar", [AuthController::class, 'asignar']);
    Route::get('/users/getlast/{idusuario}', [AuthController::class, 'last']);  
    Route::post('/setLast', [AuthController::class, 'insertlast']);
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'admin'
], function ($router) {
    Route::get("/planes", [PlanesController::class, 'obtener']);
    Route::get("/planes/getVistas", [PlanesController::class, 'getVistas']);
    Route::post("/planes/insertar", [PlanesController::class, 'insertar']);
    Route::get("/planes/editar/{id}", [PlanesController::class, 'getplan']);
    Route::post("/planes/editar", [PlanesController::class, 'update']);
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'config'
], function ($router) {
    Route::get("/getRubros", [ConfigController::class, 'obtenerRubros']);
    Route::get("/getEjercicios/{idusuario}", [ConfigController::class, 'obtenerEjercicios']);
    Route::get("/getPeriodos/{idusuario}/{ejercicio}", [ConfigController::class, 'obtenerPeriodos']);
    Route::post("/insertEjercicio", [EjerciciosController::class, 'insertarEjercicio']);
    Route::post("/insertPeriodo", [EjerciciosController::class, 'insertarPeriodo']);
    Route::post("/insertXMLEmitidos", [EjerciciosController::class, 'insertarEmitidos']);
    Route::post("/insertXMLRecibidos", [EjerciciosController::class, 'insertarRecibidos']);
    Route::post("/insertXMLNomina", [EjerciciosController::class, 'inesrtarNomina']);
    Route::post("/guardarClasificacion",[EjerciciosController::class, 'guardarClasificacion']);
    Route::get("/getCFDIs/{cliente}/{ejercicio}/{periodo}",[EjerciciosController::class, 'getCFDIs']);
    Route::get("/getEjercicioAbierto/{cliente}",[EjerciciosController::class, 'getEjercicioAbierto']);
    Route::get("/getPendientes/{cliente}/{ejercicio}/{periodo}",[EjerciciosController::class, 'getPendientes']);
    Route::get("/getHistorico/{cliente}/{ejercicio}",[EjerciciosController::class, 'getHistorico']);
    Route::get("/getHistoricoMensual/{cliente}/{ejercicio}/{periodo}",[EjerciciosController::class, 'getHistoricoMensual']);
    Route::get("/getGraficaRubros/{cliente}/{ejercicio}/{periodo}",[EjerciciosController::class, 'getGraficaRubros']);
    Route::get("/getGraficaRubrosPorEjercicio/{cliente}/{ejercicio}",[EjerciciosController::class, 'getGraficaRubrosPorEjercicio']);
    Route::post("/guardarRubros",[EjerciciosController::class, 'guardarRubros']);
    Route::post("/actRubros",[EjerciciosController::class, 'actRubros']);
    Route::post("/revisarCFDI",[EjerciciosController::class, 'consultaCFDI']);
    Route::post("/descargararchivo",[ConfigController::class, 'descargararchivo']);
    Route::get("/getLogo/{rfc}",[ProfileController::class, 'getLogo']);
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'docs'
], function ($router) {
    Route::get("/lista/{rfc}", [DocumentosController::class, 'lista']);
    Route::get("/obtsellos/{rfc}", [DocumentosController::class, 'obtsellos']);
    Route::post("/nuevo",[DocumentosController::class, 'nuevo']);
    Route::post('/descargararchivo', [DocumentosController::class, 'descargararchivo']);
    Route::post('/eliminararchivo', [DocumentosController::class, 'eliminararchivo']);
    Route::post("/declaracion",[DocumentosController::class, 'nuevadeclaracion']);
    Route::post("/aceptardeclaracion",[DocumentosController::class, 'aceptardeclaracion']);
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'pagos'
], function ($router) {
    Route::post("/subscripcion", [PagosController::class, 'CreacionSubscripcion']);
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'fact'
], function ($router) {
    Route::get("/consultaTimbres/{rfc}", [FacturacionController::class, 'checkTimbres']);
    Route::get("/listas/{rfc}", [FacturacionController::class, 'listas']);
    Route::post("/addc/{rfc}",[ClientesController::class, 'agregar']);
    Route::get("/obtenerc/{id}",[ClientesController::class, 'obtener']);
    Route::post("/editarc/{id}",[ClientesController::class, 'editar']);
    Route::post("/deshabilitarc/{id}",[ClientesController::class, 'deshabilitar']);
    Route::post("/habilitarc/{id}",[ClientesController::class, 'habilitar']);
    Route::post("/addp/{rfc}",[ProductosController::class, 'agregar']);    
    Route::get("/obtenerp/{id}",[ProductosController::class, 'obtener']);
    Route::post("/editarp/{id}",[ProductosController::class, 'editar']);
    Route::post("/deshabilitarp/{id}",[ProductosController::class, 'deshabilitar']);
    Route::post("/habilitarp/{id}",[ProductosController::class, 'habilitar']);
    Route::post("/timbrar",[FacturacionController::class,'timbrar']);
});
