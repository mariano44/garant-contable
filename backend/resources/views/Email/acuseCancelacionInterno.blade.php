@component('mail::message')
# Notificación de solicitud de cancelación de suscripción de cliente con los siguientes datos:<br>

Id Cliente: {{$id}}<br>
Nombre de la cuenta: {{$nombres}} {{$apellidos}}<br>
Fecha de la solicitud: {{$fecha}}<br>
Plan: {{$plan}}<br>
Contador asignado: {{$contador}}<br>


Acciones:<br>

1. Revisar si el cliente se encontraba al corriente de sus pagos, y en el caso de el cliente tener un adeudo, enviar un estado de cuenta con las indicaciones de pago.<br>
2. Revisar la encuesta de salida.<br>
3. Implementar las acciones de mejora continua para mejorar los procesos de trabajo en caso de que la salida sea por causa de mal servicio.<br>
4. Reponer una cuenta al contador que se quedó sin cliente, para nivelar su carga de trabajo.<br>
5. Incluir al cliente en los públicos de clientes por recuperar en facebook.<br>

@endcomponent