<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDocumentosTable extends Migration
{
    /**
     * Archivos que sube el contribuyente (estados de cuenta, constancias).
     */
    public function up()
    {
        Schema::create('documentos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('idusuario');
            $table->string('nombre');
            $table->string('categoria')->nullable();
            $table->string('ejercicio', 4)->nullable();
            $table->string('periodo', 2)->nullable();
            $table->timestamps();
            $table->index('idusuario');
        });
    }

    public function down()
    {
        Schema::dropIfExists('documentos');
    }
}
