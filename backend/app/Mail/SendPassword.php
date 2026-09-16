<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;


class SendPassword extends Mailable
{
    use Queueable, SerializesModels;
    public $password;
    public $nombre;
    public $apellidos;
    public $email;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($password,$email,$nombre,$apellidos)
    {
        $this->password = $password;
        $this->email = $email;
        $this->nombres = $nombre;
        $this->apellidos = $apellidos;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build(){
        return $this->subject('Bienvenido a Garant Contable')->markdown('Email.sendPassword')->with([
            'password' => $this->password,
            'email' => $this->email,
            'nombres' => $this->nombres,
            'apellidos' => $this->apellidos
        ]);        
    }

}