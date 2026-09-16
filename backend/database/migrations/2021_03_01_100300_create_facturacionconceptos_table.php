<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFacturacionconceptosTable extends Migration
{
    /**
     * Renglones de una factura emitida.
     */
    public function up()
    {
        Schema::create('facturacionconceptos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('idcfdi');
            $table->unsignedBigInteger('idproducto')->nullable();
            $table->decimal('cantidad', 15, 4)->default(1);
            $table->decimal('valorunitario', 15, 2)->default(0);
            $table->string('claveproducto', 20)->nullable();
            $table->string('claveunidad', 20)->nullable();
            $table->decimal('importe', 15, 2)->default(0);
            $table->decimal('importeiva', 15, 2)->default(0);
            $table->decimal('tasaiva', 8, 4)->default(0);
            $table->decimal('importeret', 15, 2)->default(0);
            $table->decimal('tasaret', 8, 4)->default(0);
            $table->decimal('importeisr', 15, 2)->default(0);
            $table->decimal('tasaisr', 8, 4)->default(0);
            $table->timestamps();
            $table->index('idcfdi');
        });
    }

    public function down()
    {
        Schema::dropIfExists('facturacionconceptos');
    }
}
