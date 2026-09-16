<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLastTable extends Migration
{
    /**
     * Ultimo contribuyente que abrio cada usuario interno.
     */
    public function up()
    {
        Schema::create('last', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('idusuario');
            $table->string('cliente', 15);
            $table->timestamps();
            $table->index('idusuario');
        });
    }

    public function down()
    {
        Schema::dropIfExists('last');
    }
}
