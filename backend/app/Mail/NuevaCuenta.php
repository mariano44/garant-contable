<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;


class NuevaCuenta extends Mailable
{
    use Queueable, SerializesModels;
    public $nombre;
    public $apellidos;
    public $email;
    public $plan;
    public $id;
    public $fecha;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($email,$nombre,$apellidos,$plan,$id,$fecha)
    {
        $this->email = $email;
        $this->nombres = $nombre;
        $this->apellidos = $apellidos;
        $this->plan = $plan;
        $this->id = $id;
        $this->fecha = $fecha;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build(){
        return $this->subject('Felicidades Garant Contable ha captado un nuevo cliente')->markdown('Email.NuevaCuenta')->with([
            'email' => $this->email,
            'nombres' => $this->nombres,
            'apellidos' => $this->apellidos,
            'plan'=> $this->plan,
            'id'=>$this->id,
            'fecha'=>$this->fecha
        ]);        
    }

}