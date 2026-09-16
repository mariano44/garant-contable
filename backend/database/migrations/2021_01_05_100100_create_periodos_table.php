<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePeriodosTable extends Migration
{
    /**
     * Periodo mensual dentro de un ejercicio. 'periodo' va como '01'..'12'.
     */
    public function up()
    {
        Schema::create('periodos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('idusuario');
            $table->string('ejercicio', 4);
            $table->string('periodo', 2);
            $table->timestamps();
            $table->index(['idusuario', 'ejercicio']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('periodos');
    }
}
