<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductosTable extends Migration
{
    /**
     * Conceptos facturables con su clave del SAT e impuestos.
     */
    public function up()
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('idusuario');
            $table->string('descripcion');
            $table->string('nombreinterno')->nullable();
            $table->decimal('precio', 15, 2)->default(0);
            $table->string('claveproducto', 20)->nullable();
            $table->string('unidad', 20)->nullable();
            $table->string('cuentapredial')->nullable();
            $table->string('claveinterna')->nullable();
            $table->string('noidentificacion')->nullable();
            $table->decimal('iva', 8, 4)->default(0);
            $table->decimal('ivaret', 8, 4)->default(0);
            $table->decimal('isr', 8, 4)->default(0);
            $table->decimal('ieps', 8, 4)->default(0);
            $table->tinyInteger('estatus')->default(1);
            $table->timestamps();
            $table->index('idusuario');
        });
    }

    public function down()
    {
        Schema::dropIfExists('productos');
    }
}
