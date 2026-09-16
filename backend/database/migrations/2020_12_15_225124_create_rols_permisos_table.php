<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRolsPermisosTable extends Migration
{
    /**
     * Permiso por rol y por vista. El sidebar lee estas cuatro banderas.
     */
    public function up()
    {
        Schema::create('rols_permisos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('idrol');
            $table->string('vista');
            $table->tinyInteger('lista')->default(0);
            $table->tinyInteger('edicion')->default(0);
            $table->tinyInteger('creacion')->default(0);
            $table->tinyInteger('eliminar')->default(0);
            $table->timestamps();
            $table->index(['idrol', 'vista']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('rols_permisos');
    }
}
