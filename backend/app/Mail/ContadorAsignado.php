<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;


class ContadorAsignado extends Mailable
{
    use Queueable, SerializesModels;
    public $nombre;
    public $apellidos;
    public $email;
    public $telefono;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($email,$nombre,$apellidos,$telefono){
        $this->email = $email;
        $this->nombres = $nombre;
        $this->apellidos = $apellidos;
        $this->telefono = $telefono;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build(){
        return $this->subject('Hola soy tu nuevo contador de Garant Contable')->markdown('Email.ContadorAsignado')->with([
            'email' => $this->email,
            'nombres' => $this->nombres,
            'apellidos' => $this->apellidos,
            'telefono' => $this->telefono
        ]);        
    }

}