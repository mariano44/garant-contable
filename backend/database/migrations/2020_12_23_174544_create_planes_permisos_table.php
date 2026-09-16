<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePlanesPermisosTable extends Migration
{
    /**
     * Permiso por plan contratado. El cliente solo tiene activa/inactiva, no CRUD.
     */
    public function up()
    {
        Schema::create('planes_permisos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('idplan');
            $table->string('vista');
            $table->tinyInteger('activa')->default(0);
            $table->timestamps();
            $table->index(['idplan', 'vista']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('planes_permisos');
    }
}
