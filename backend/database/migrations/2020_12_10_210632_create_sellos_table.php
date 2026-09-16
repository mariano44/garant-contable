<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSellosTable extends Migration
{
    /**
     * CIEC, FIEL y CSD del contribuyente. Los archivos viven en public/Sellos/<RFC>/.
     */
    public function up()
    {
        Schema::create('sellos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('idusuario');
            $table->string('passciec')->nullable();
            $table->string('passfiel')->nullable();
            $table->string('passcsd')->nullable();
            $table->text('fielkey')->nullable();
            $table->text('fielcer')->nullable();
            $table->text('csdkey')->nullable();
            $table->text('csdcer')->nullable();
            $table->timestamps();
            $table->index('idusuario');
        });
    }

    public function down()
    {
        Schema::dropIfExists('sellos');
    }
}
