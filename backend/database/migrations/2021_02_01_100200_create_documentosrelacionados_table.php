<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDocumentosrelacionadosTable extends Migration
{
    /**
     * Une una linea de captura con la propuesta de declaracion que la origino.
     */
    public function up()
    {
        Schema::create('documentosrelacionados', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('idusuario');
            $table->unsignedBigInteger('iddoc');
            $table->unsignedBigInteger('idlinea');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('documentosrelacionados');
    }
}
