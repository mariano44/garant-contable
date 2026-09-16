@component('mail::message')
# Reset Password

Cambie su contraseña.

@component('mail::button', ['url' => 'https://app.garantcontable.com/recover/'.$token.'/'.$email])
Cambiar Contraseña
@endcomponent

Gracias,<br>
Garant Contable
@endcomponent