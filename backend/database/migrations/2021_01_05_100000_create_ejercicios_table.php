<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEjerciciosTable extends Migration
{
    /**
     * Un ejercicio fiscal (anio) abierto por contribuyente.
     */
    public function up()
    {
        Schema::create('ejercicios', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('idusuario');
            $table->string('anio', 4);
            $table->timestamps();
            $table->index(['idusuario', 'anio']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('ejercicios');
    }
}
