<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDeclaracionesTable extends Migration
{
    /**
     * Propuesta de declaracion o linea de captura. 'aceptada' la firma el cliente.
     */
    public function up()
    {
        Schema::create('declaraciones', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('idusuario');
            $table->string('nombre');
            $table->string('categoria')->nullable();
            $table->tinyInteger('aceptada')->default(0);
            $table->timestamps();
            $table->index('idusuario');
        });
    }

    public function down()
    {
        Schema::dropIfExists('declaraciones');
    }
}
