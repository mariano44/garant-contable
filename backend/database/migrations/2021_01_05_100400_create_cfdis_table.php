<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCfdisTable extends Migration
{
    /**
     * CFDI cargado desde XML. 'rubros' nulo = pendiente de clasificar.
     */
    public function up()
    {
        Schema::create('cfdis', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('idusuario');
            $table->string('ejercicio', 4);
            $table->string('periodo', 2);
            $table->string('emisor', 15);
            $table->string('receptor', 15);
            $table->string('uuid', 36);
            $table->string('rfc', 15)->nullable();
            $table->dateTime('fecha');
            $table->decimal('total', 15, 2)->default(0);
            $table->decimal('siniva', 15, 2)->default(0);
            $table->string('estado')->nullable();
            $table->string('tipo')->nullable();
            $table->string('documento')->nullable();
            $table->longText('file')->nullable();
            $table->string('cliente', 15);
            $table->string('filename')->nullable();
            $table->string('rubros')->nullable();
            $table->timestamps();
            $table->index(['idusuario', 'ejercicio', 'periodo']);
            $table->index(['cliente', 'uuid']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('cfdis');
    }
}
