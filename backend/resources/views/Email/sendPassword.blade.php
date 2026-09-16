@component('mail::message')
# ¡Bienvenido a Garant Contable!

Estimado {{ $nombres }} {{ $apellidos }}. 
Te damos la bienvenida a nuestra aplicación.

Tu usuario y contraseña son: 

Correo: {{ $email }} <br>
Contraseña: {{ $password }}

¡Puedes iniciar sesión dando click aquí abajo!

@component('mail::button', ['url' => 'https://app.garantcontable.com/'])
Inicia Sesión
@endcomponent

@endcomponent