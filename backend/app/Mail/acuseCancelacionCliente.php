<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;


class acuseCancelacionCliente extends Mailable
{
    use Queueable, SerializesModels;
    public $fecha;
    public $nombre;
    public $apellidos;
    public $plan;
    public $id;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($fecha,$nombre,$apellidos,$plan,$id)
    {
        $this->nombres = $nombre;
        $this->apellidos = $apellidos;
        $this->fecha = $fecha;
        $this->plan = $plan;
        $this->id = $id;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build(){
        return $this->subject('Ha sido procesada una solicitud de cancelación de la suscripción con Garant Contable')->markdown('Email.acuseCancelacionCliente')->with([
            'nombres' => $this->nombres,
            'apellidos' => $this->apellidos,
            'fecha' => $this->fecha,
            'plan' => $this->plan,
            'id' => $this->id
        ]);        
    }

}