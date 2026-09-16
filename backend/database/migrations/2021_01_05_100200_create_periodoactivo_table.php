<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePeriodoactivoTable extends Migration
{
    /**
     * Ultimo periodo abierto por contribuyente. Es el que abre la app al entrar.
     */
    public function up()
    {
        Schema::create('periodoactivo', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('idusuario');
            $table->string('cliente', 15);
            $table->string('ejercicio', 4);
            $table->string('periodo', 2);
            $table->timestamps();
            $table->index('cliente');
        });
    }

    public function down()
    {
        Schema::dropIfExists('periodoactivo');
    }
}
