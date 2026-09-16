@component('mail::message')
# ¡Que bueno es tenerte de vuelta!

Estimado {{ $nombres }} {{ $apellidos }}. 
Estamos muy contentos de ver que estás de vuelta con nosotros.

En caso de no recordar tu contraseña, utiliza el apartado para recuperarla en la página de inicio de sesión.

¡Puedes iniciar sesión dando click aquí abajo!

@component('mail::button', ['url' => 'https://app.garantcontable.com'])
Inicia Sesión
@endcomponent

¡Gracias por depositar tu confianza en nosotros y esperamos cumplir todas tus expectativas!

@endcomponent