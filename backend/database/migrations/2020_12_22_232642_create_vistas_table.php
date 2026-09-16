<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVistasTable extends Migration
{
    /**
     * Catalogo de pantallas. 'vistopor' filtra cuales puede contratar un plan.
     */
    public function up()
    {
        Schema::create('vistas', function (Blueprint $table) {
            $table->id();
            $table->string('vista');
            $table->string('vistopor')->default('Todos');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('vistas');
    }
}
