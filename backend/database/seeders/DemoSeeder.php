<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * Datos de demostracion. Todo es inventado: ningun RFC, UUID ni importe
 * corresponde a un contribuyente real.
 *
 * Deja la plataforma en un estado donde se puede entrar y ver algo:
 * un ejercicio fiscal abierto con CFDIs ya cargados, parte clasificados
 * y parte pendientes, que es justamente lo que dibujan las graficas.
 */
class DemoSeeder extends Seeder
{
    /** Las diez pantallas que el sidebar sabe pintar. */
    const VISTAS = [
        'Dashboard', 'Reportes', 'Documentos', 'Facturación', 'Nómina',
        'Subir CFDIs', 'Clasificar Rubros', 'Usuarios', 'Roles', 'Planes',
    ];

    /** Vistas que un cliente ve en su plan (las internas quedan fuera). */
    const VISTAS_CLIENTE = [
        'Dashboard', 'Reportes', 'Documentos', 'Facturación', 'Nómina',
    ];

    const RFC_DEMO = 'DEMO010101AAA';

    public function run()
    {
        $ahora = now();

        // ---- Catalogo de pantallas -------------------------------------
        foreach (self::VISTAS as $vista) {
            DB::table('vistas')->insert([
                'vista' => $vista,
                // 'Todos' = contratable por cualquier plan. Las de
                // administracion solo las ve el personal interno.
                'vistopor' => in_array($vista, self::VISTAS_CLIENTE) ? 'Todos' : 'Interno',
                'created_at' => $ahora,
                'updated_at' => $ahora,
            ]);
        }

        // ---- Rubros contables ------------------------------------------
        $rubros = [
            ['Ventas', 'Ingreso'],
            ['Servicios profesionales', 'Ingreso'],
            ['Sueldos y salarios', 'Egreso'],
            ['Arrendamiento', 'Egreso'],
            ['Papeleria y utiles de oficina', 'Egreso'],
            ['Combustibles y lubricantes', 'Egreso'],
            ['Viaticos y gastos de viaje', 'Egreso'],
            ['Telefonia e internet', 'Egreso'],
            ['Energia electrica', 'Egreso'],
            ['Mantenimiento y reparaciones', 'Egreso'],
            ['Honorarios contables', 'Egreso'],
            ['Publicidad y propaganda', 'Egreso'],
            ['Seguros y fianzas', 'Egreso'],
            ['Equipo de computo', 'Inversion'],
            ['No deducible', 'Otros'],
        ];
        foreach ($rubros as list($nombre, $tipo)) {
            DB::table('rubros')->insert([
                'nombre' => $nombre,
                'tipo' => $tipo,
                'created_at' => $ahora,
                'updated_at' => $ahora,
            ]);
        }

        // ---- Roles internos --------------------------------------------
        $rolAdmin = DB::table('rols')->insertGetId([
            'nombre' => 'Direccion',
            'descripcion' => 'Acceso total, incluida la administracion de roles y planes.',
            'created_at' => $ahora, 'updated_at' => $ahora,
        ]);
        $rolContador = DB::table('rols')->insertGetId([
            'nombre' => 'Contador',
            'descripcion' => 'Opera la contabilidad de los clientes que tiene asignados.',
            'created_at' => $ahora, 'updated_at' => $ahora,
        ]);

        // Direccion: todo en todas las vistas.
        foreach (self::VISTAS as $vista) {
            DB::table('rols_permisos')->insert([
                'idrol' => $rolAdmin, 'vista' => $vista,
                'lista' => 1, 'edicion' => 1, 'creacion' => 1, 'eliminar' => 1,
                'created_at' => $ahora, 'updated_at' => $ahora,
            ]);
        }

        // Contador: opera, pero no administra ni borra.
        foreach (self::VISTAS as $vista) {
            $administrativa = in_array($vista, ['Usuarios', 'Roles', 'Planes']);
            DB::table('rols_permisos')->insert([
                'idrol' => $rolContador, 'vista' => $vista,
                'lista' => $administrativa ? 0 : 1,
                'edicion' => $administrativa ? 0 : 1,
                'creacion' => $administrativa ? 0 : 1,
                'eliminar' => 0,
                'created_at' => $ahora, 'updated_at' => $ahora,
            ]);
        }

        // ---- Planes contratables ---------------------------------------
        $planBasico = DB::table('planes')->insertGetId([
            'nombre' => 'Basico', 'costo' => 499.00,
            'created_at' => $ahora, 'updated_at' => $ahora,
        ]);
        $planIntegral = DB::table('planes')->insertGetId([
            'nombre' => 'Integral', 'costo' => 1299.00,
            'created_at' => $ahora, 'updated_at' => $ahora,
        ]);

        // Basico: consulta y documentos, sin facturar ni nomina.
        foreach (self::VISTAS_CLIENTE as $vista) {
            DB::table('planes_permisos')->insert([
                'idplan' => $planBasico, 'vista' => $vista,
                'activa' => in_array($vista, ['Facturación', 'Nómina']) ? 0 : 1,
                'created_at' => $ahora, 'updated_at' => $ahora,
            ]);
        }
        // Integral: todo lo que un cliente puede ver.
        foreach (self::VISTAS_CLIENTE as $vista) {
            DB::table('planes_permisos')->insert([
                'idplan' => $planIntegral, 'vista' => $vista, 'activa' => 1,
                'created_at' => $ahora, 'updated_at' => $ahora,
            ]);
        }

        DB::table('relacionrolplanes')->insert([
            'rolid' => $rolContador, 'planid' => $planIntegral,
            'created_at' => $ahora, 'updated_at' => $ahora,
        ]);

        // ---- Usuarios ---------------------------------------------------
        $idDireccion = DB::table('users')->insertGetId([
            'email' => 'direccion@demo.local',
            'password' => Hash::make('demo1234'),
            'nombres' => 'Ana', 'apellidos' => 'Direccion',
            'telefono' => '6690000001',
            'tipo' => 'contador', 'rolid' => $rolAdmin,
            'activo' => 1, 'status' => 1,
            'created_at' => $ahora, 'updated_at' => $ahora,
        ]);

        $idContador = DB::table('users')->insertGetId([
            'email' => 'contador@demo.local',
            'password' => Hash::make('demo1234'),
            'nombres' => 'Luis', 'apellidos' => 'Contador',
            'telefono' => '6690000002', 'movil' => '6690000002',
            'tipo' => 'contador', 'rolid' => $rolContador,
            'activo' => 1, 'status' => 1,
            'created_at' => $ahora, 'updated_at' => $ahora,
        ]);

        $idCliente = DB::table('users')->insertGetId([
            'email' => 'cliente@demo.local',
            'password' => Hash::make('demo1234'),
            'nombres' => 'Maria', 'apellidos' => 'Contribuyente',
            'rfc' => self::RFC_DEMO,
            'razonsocial' => 'EMPRESA DEMOSTRACION SA DE CV',
            'regimen' => '601', 'regimenfiscal' => '601',
            'telefono' => '6690000003', 'movil' => '6690000003',
            'tipo' => 'cliente', 'planid' => $planIntegral,
            'asignadoa' => $idContador,
            'activo' => 1, 'status' => 1,
            'timbres' => 50, 'periodoprueba' => 1,
            'created_at' => $ahora, 'updated_at' => $ahora,
        ]);

        DB::table('last')->insert([
            'idusuario' => $idContador, 'cliente' => self::RFC_DEMO,
            'created_at' => $ahora, 'updated_at' => $ahora,
        ]);
        DB::table('last')->insert([
            'idusuario' => $idDireccion, 'cliente' => self::RFC_DEMO,
            'created_at' => $ahora, 'updated_at' => $ahora,
        ]);

        // ---- Ejercicio fiscal abierto ----------------------------------
        $ejercicio = date('Y');
        $mesActual = date('m');

        DB::table('ejercicios')->insert([
            'idusuario' => $idCliente, 'anio' => $ejercicio,
            'created_at' => $ahora, 'updated_at' => $ahora,
        ]);

        // Un periodo por cada mes ya transcurrido.
        for ($m = 1; $m <= (int) $mesActual; $m++) {
            DB::table('periodos')->insert([
                'idusuario' => $idCliente, 'ejercicio' => $ejercicio,
                'periodo' => str_pad($m, 2, '0', STR_PAD_LEFT),
                'created_at' => $ahora, 'updated_at' => $ahora,
            ]);
        }

        DB::table('periodoactivo')->insert([
            'idusuario' => $idCliente, 'cliente' => self::RFC_DEMO,
            'ejercicio' => $ejercicio, 'periodo' => $mesActual,
            'created_at' => $ahora, 'updated_at' => $ahora,
        ]);

        $this->sembrarCfdis($idCliente, $ejercicio, (int) $mesActual, $ahora);

        // ---- Receptores y conceptos para facturar ----------------------
        $receptores = [
            ['COMERCIALIZADORA DEL NORTE SA DE CV', 'CNO050505AB1', 'Culiacan', '80000'],
            ['SERVICIOS LOGISTICOS DEL PACIFICO', 'SLP120315XY2', 'Mazatlan', '82000'],
            ['DISTRIBUIDORA REGIONAL SA DE CV', 'DRE080820QW3', 'Los Mochis', '81200'],
        ];
        foreach ($receptores as list($razon, $rfc, $ciudad, $cp)) {
            DB::table('clientes')->insert([
                'idusuario' => $idCliente, 'razonsocial' => $razon, 'rfc' => $rfc,
                'correo' => 'pagos@' . strtolower(substr($rfc, 0, 3)) . '.demo',
                'calle' => 'Av. Principal', 'noext' => (string) rand(100, 999),
                'colonia' => 'Centro', 'ciudad' => $ciudad, 'cp' => $cp,
                'estado' => 'Sinaloa', 'telefono' => '66900' . rand(10000, 99999),
                'estatus' => 1, 'created_at' => $ahora, 'updated_at' => $ahora,
            ]);
        }

        $conceptos = [
            ['Consultoria en tecnologias de la informacion', 'CONSULT', 12000.00, '81111500', 'E48'],
            ['Desarrollo de software a la medida', 'DESARROLLO', 35000.00, '81112000', 'E48'],
            ['Mantenimiento de equipo de computo', 'MANTTO', 2500.00, '81112300', 'E48'],
            ['Licencia de uso de software anual', 'LICENCIA', 18000.00, '43230000', 'E48'],
        ];
        foreach ($conceptos as list($desc, $interno, $precio, $clave, $unidad)) {
            DB::table('productos')->insert([
                'idusuario' => $idCliente, 'descripcion' => $desc,
                'nombreinterno' => $interno, 'precio' => $precio,
                'claveproducto' => $clave, 'unidad' => $unidad,
                'iva' => 16, 'ivaret' => 0, 'isr' => 0, 'ieps' => 0,
                'estatus' => 1, 'created_at' => $ahora, 'updated_at' => $ahora,
            ]);
        }

        // ---- Documentos y declaraciones --------------------------------
        DB::table('documentos')->insert([
            'idusuario' => $idCliente, 'nombre' => 'estado-cuenta-enero.pdf',
            'categoria' => 'Estado de cuenta',
            'ejercicio' => $ejercicio, 'periodo' => '01',
            'created_at' => $ahora, 'updated_at' => $ahora,
        ]);
        DB::table('documentos')->insert([
            'idusuario' => $idCliente, 'nombre' => 'constancia-situacion-fiscal.pdf',
            'categoria' => 'Constancia',
            'created_at' => $ahora, 'updated_at' => $ahora,
        ]);
        DB::table('declaraciones')->insert([
            'idusuario' => $idCliente, 'nombre' => 'propuesta-declaracion-enero.pdf',
            'categoria' => 'Propuesta', 'aceptada' => 1,
            'created_at' => $ahora, 'updated_at' => $ahora,
        ]);

        $this->command->info('Usuarios demo (contrasena demo1234):');
        $this->command->info('  direccion@demo.local  - acceso total');
        $this->command->info('  contador@demo.local   - opera, no administra');
        $this->command->info('  cliente@demo.local    - contribuyente ' . self::RFC_DEMO);
    }

    /**
     * CFDIs de todo el ejercicio. Los del mes en curso se dejan sin rubro
     * a proposito, para que la pantalla de Clasificar tenga trabajo real.
     */
    private function sembrarCfdis($idCliente, $ejercicio, $mesActual, $ahora)
    {
        $proveedores = [
            ['ARRENDAMIENTOS DEL VALLE SA', 'AVA990101QQ1', 'Arrendamiento', 25000.00],
            ['PAPELERIA Y OFICINA SA DE CV', 'POF021212RR2', 'Papeleria y utiles de oficina', 3400.00],
            ['GASOLINERA LA CURVA SA', 'GLC050707SS3', 'Combustibles y lubricantes', 8900.00],
            ['TELECOM NACIONAL SA', 'TNA880303TT4', 'Telefonia e internet', 4200.00],
            ['SUMINISTRO ELECTRICO SA', 'SEL910606UU5', 'Energia electrica', 6700.00],
            ['SEGUROS DEL PACIFICO SA', 'SPA000909VV6', 'Seguros y fianzas', 11500.00],
        ];
        $receptores = [
            ['COMERCIALIZADORA DEL NORTE SA DE CV', 'CNO050505AB1'],
            ['SERVICIOS LOGISTICOS DEL PACIFICO', 'SLP120315XY2'],
            ['DISTRIBUIDORA REGIONAL SA DE CV', 'DRE080820QW3'],
        ];

        $filas = [];
        $n = 0;

        for ($m = 1; $m <= $mesActual; $m++) {
            $periodo = str_pad($m, 2, '0', STR_PAD_LEFT);
            $esMesAbierto = ($m === $mesActual);

            // Ingresos: lo que el contribuyente emitio.
            foreach ($receptores as $i => list($razon, $rfcReceptor)) {
                $subtotal = round(30000 + (($m * 3700 + $i * 5100) % 45000), 2);
                $filas[] = [
                    'idusuario' => $idCliente,
                    'ejercicio' => $ejercicio, 'periodo' => $periodo,
                    'emisor' => self::RFC_DEMO, 'receptor' => $rfcReceptor,
                    'uuid' => $this->uuidDemo(++$n),
                    'rfc' => $rfcReceptor,
                    'fecha' => sprintf('%s-%s-%02d 10:%02d:00', $ejercicio, $periodo, 3 + $i * 7, $n % 60),
                    'total' => round($subtotal * 1.16, 2),
                    'siniva' => $subtotal,
                    'estado' => 'Vigente', 'tipo' => 'Ingreso',
                    'documento' => 'Factura', 'file' => null,
                    'cliente' => self::RFC_DEMO,
                    'filename' => 'ingreso_' . $periodo . '_' . ($i + 1) . '.xml',
                    // Los ingresos si van clasificados desde el arranque.
                    'rubros' => $i === 1 ? 'Servicios profesionales' : 'Ventas',
                    'created_at' => $ahora, 'updated_at' => $ahora,
                ];
            }

            // Egresos: lo que le facturaron.
            foreach ($proveedores as $i => list($razon, $rfcEmisor, $rubro, $base)) {
                $subtotal = round($base * (0.85 + (($m + $i) % 5) * 0.07), 2);
                $filas[] = [
                    'idusuario' => $idCliente,
                    'ejercicio' => $ejercicio, 'periodo' => $periodo,
                    'emisor' => $rfcEmisor, 'receptor' => self::RFC_DEMO,
                    'uuid' => $this->uuidDemo(++$n),
                    'rfc' => $rfcEmisor,
                    'fecha' => sprintf('%s-%s-%02d 16:%02d:00', $ejercicio, $periodo, 2 + $i * 4, $n % 60),
                    'total' => round($subtotal * 1.16, 2),
                    'siniva' => $subtotal,
                    'estado' => 'Vigente', 'tipo' => 'Egreso',
                    'documento' => 'Factura', 'file' => null,
                    'cliente' => self::RFC_DEMO,
                    'filename' => 'egreso_' . $periodo . '_' . ($i + 1) . '.xml',
                    // El mes en curso queda pendiente de clasificar.
                    'rubros' => $esMesAbierto ? null : $rubro,
                    'created_at' => $ahora, 'updated_at' => $ahora,
                ];
            }

            // Nomina del mes.
            $nomina = round(48000 + ($m * 1200), 2);
            $filas[] = [
                'idusuario' => $idCliente,
                'ejercicio' => $ejercicio, 'periodo' => $periodo,
                'emisor' => self::RFC_DEMO, 'receptor' => self::RFC_DEMO,
                'uuid' => $this->uuidDemo(++$n),
                'rfc' => self::RFC_DEMO,
                'fecha' => sprintf('%s-%s-28 09:00:00', $ejercicio, $periodo),
                'total' => $nomina, 'siniva' => $nomina,
                'estado' => 'Vigente', 'tipo' => 'Nómina',
                'documento' => 'Nomina', 'file' => null,
                'cliente' => self::RFC_DEMO,
                'filename' => 'nomina_' . $periodo . '.xml',
                'rubros' => 'Sueldos y salarios',
                'created_at' => $ahora, 'updated_at' => $ahora,
            ];
        }

        foreach (array_chunk($filas, 100) as $lote) {
            DB::table('cfdis')->insert($lote);
        }

        $this->command->info('CFDIs de demostracion insertados: ' . count($filas));
    }

    /** UUID con formato valido pero obviamente falso. */
    private function uuidDemo($n)
    {
        $hex = str_pad(dechex($n), 12, '0', STR_PAD_LEFT);
        return sprintf('DEM00000-0000-4000-8000-%s', $hex);
    }
}
