<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMetodosTable extends Migration
{
    /**
     * Metodos de pago del cliente. El modelo Metodos resuelve a 'metodos', no a 'metodosdepago'.
     */
    public function up()
    {
        Schema::create('metodos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('idusuario');
            $table->string('nombre');
            $table->string('numero');
            $table->string('mes', 2);
            $table->string('anio', 4);
            $table->string('cvv');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('metodos');
    }
}
