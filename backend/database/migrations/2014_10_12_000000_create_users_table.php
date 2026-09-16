<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Una sola tabla para los dos tipos de usuario, distinguidos por 'tipo':
     *  - 'cliente'  : el contribuyente, con RFC y un plan contratado.
     *  - 'contador' : personal interno, con un rol y clientes asignados.
     *
     * Por eso casi todo va nullable: las columnas fiscales solo las llena el
     * cliente, y las de suscripcion solo existen si entro por PayPal.
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('email', 100)->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();

            // Identidad
            $table->string('nombres')->nullable();
            $table->string('apellidos')->nullable();
            $table->string('telefono', 30)->nullable();
            $table->string('movil', 30)->nullable();
            $table->text('descripcion')->nullable();
            $table->string('logo')->nullable();
            $table->string('logocuadrado')->nullable();

            // Datos fiscales (solo tipo 'cliente')
            $table->string('rfc', 15)->nullable()->unique();
            $table->string('curp', 20)->nullable();
            $table->string('razonsocial')->nullable();
            $table->string('regimen', 10)->nullable();
            $table->string('regimenfiscal', 10)->nullable();

            // Rol / plan
            $table->string('tipo', 20)->default('cliente');
            $table->unsignedBigInteger('rolid')->nullable();
            $table->unsignedBigInteger('planid')->nullable();
            $table->unsignedBigInteger('asignadoa')->nullable();
            $table->tinyInteger('activo')->default(1);
            $table->tinyInteger('status')->default(1);

            // Facturacion
            $table->integer('timbres')->default(0);
            $table->tinyInteger('periodoprueba')->default(0);

            // Suscripcion PayPal
            $table->string('payer_id')->nullable();
            $table->string('sus_id')->nullable();
            $table->dateTime('fecha_sus')->nullable();
            $table->text('motivo')->nullable();
            $table->dateTime('fechacancel')->nullable();

            $table->timestamps();

            $table->index('tipo');
            $table->index('asignadoa');
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
}
