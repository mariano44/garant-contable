<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;


class WelcomeBack extends Mailable
{
    use Queueable, SerializesModels;
    public $nombre;
    public $apellidos;
    public $email;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($email,$nombre,$apellidos)
    {
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
        return $this->subject('¡Es bueno verte de nuevo!')->markdown('Email.welcomeBack')->with([
            'email' => $this->email,
            'nombres' => $this->nombres,
            'apellidos' => $this->apellidos
        ]);        
    }

}