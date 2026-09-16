<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFacturacionsTable extends Migration
{
    /**
     * Factura emitida. El nombre plural lo impone el modelo Facturacion de Eloquent.
     */
    public function up()
    {
        Schema::create('facturacions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('idusuario');
            $table->unsignedBigInteger('idcliente');
            $table->string('tipo', 5)->nullable();
            $table->string('formadepago', 5)->nullable();
            $table->string('metododepago', 5)->nullable();
            $table->string('usocfdi', 5)->nullable();
            $table->string('moneda', 5)->default('MXN');
            $table->decimal('tipocambio', 15, 6)->default(1);
            $table->date('fechaemision')->nullable();
            $table->string('cp', 10)->nullable();
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->text('importeiva')->nullable();
            $table->text('tasaiva')->nullable();
            $table->decimal('importeret', 15, 2)->default(0);
            $table->decimal('tasaret', 8, 4)->default(0);
            $table->decimal('importeisr', 15, 2)->default(0);
            $table->decimal('tasaisr', 8, 4)->default(0);
            $table->decimal('total', 15, 2)->default(0);
            $table->decimal('descuento', 15, 2)->default(0);
            $table->tinyInteger('prueba')->default(0);
            $table->string('foliointerno')->nullable();
            $table->string('uuid', 36)->nullable();
            $table->timestamps();
            $table->index('idusuario');
        });
    }

    public function down()
    {
        Schema::dropIfExists('facturacions');
    }
}
