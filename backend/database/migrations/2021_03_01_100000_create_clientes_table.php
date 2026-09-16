<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClientesTable extends Migration
{
    /**
     * Receptores a los que el contribuyente factura.
     */
    public function up()
    {
        Schema::create('clientes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('idusuario');
            $table->string('razonsocial');
            $table->string('rfc', 15);
            $table->string('correo')->nullable();
            $table->string('calle')->nullable();
            $table->string('noext', 20)->nullable();
            $table->string('noint', 20)->nullable();
            $table->string('colonia')->nullable();
            $table->string('ciudad')->nullable();
            $table->string('cp', 10)->nullable();
            $table->string('estado')->nullable();
            $table->string('telefono', 30)->nullable();
            $table->tinyInteger('estatus')->default(1);
            $table->timestamps();
            $table->index('idusuario');
        });
    }

    public function down()
    {
        Schema::dropIfExists('clientes');
    }
}
