<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRelacionrolplanesTable extends Migration
{
    /**
     * Mapea un rol interno al plan cuyos clientes atiende.
     */
    public function up()
    {
        Schema::create('relacionrolplanes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('rolid');
            $table->unsignedBigInteger('planid');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('relacionrolplanes');
    }
}
