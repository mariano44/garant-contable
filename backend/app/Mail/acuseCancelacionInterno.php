<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;


class acuseCancelacionInterno extends Mailable
{
    use Queueable, SerializesModels;
    public $id;
    public $nombres;
    public $apellidos;
    public $fecha;
    public $plan;
    public $contador;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($id,$fecha,$nombres,$apellidos,$plan,$contador)
    {
        $this->id = $id;
        $this->fecha = $fecha;
        $this->nombres = $nombres;
        $this->apellidos = $apellidos;
        $this->plan = $plan;
        $this->contador = $contador;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build(){
        return $this->subject('El cliente '.$this->nombres.' '.$this->apellidos.' ha solicitado la cancelación de la suscripción a Garant Contable')->markdown('Email.acuseCancelacionInterno')->with([
            'id' => $this->id,
            'fecha' => $this->fecha,
            'nombres' => $this->nombres,
            'apellidos' => $this->apellidos,
            'plan' => $this->plan,
            'contador' => $this->contador
        ]);        
    }

}