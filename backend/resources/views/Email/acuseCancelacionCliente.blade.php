@component('mail::message')

Estimado {{ $nombres }} {{ $apellidos }}. <br>

Informamos que hemos recibido la solicitud de cancelación de la suscripción que tiene con Garant Contable, si usted no ha realizado esta solicitud, por favor reenvíe este correo a informes@garantcontable.com, mencionando que desconoce la causa de esta notificación. De lo contrario si usted ha solicitado cancelar la suscripción con Garant Contable, queremos decirle que lamentamos esta decisión, a continuación proporcionamos el folio de cancelación para que lo conserve.<br>

ACUSE DE RECIBO DE SOLICITUD DE CANCELACIÓN DE LA SUSCRIPCIÓN <br>
Fecha de la solicitud: {{$fecha}} <br>
PLAN: {{$plan}} <br>
Id CLIENTE: {{$id}} <br>

Es importante mencionar que a partir de la fecha no se realizarán más cargos por concepto del servicio que tenía con Garant Contable, sin embargo es importante hacer de su conocimiento que en caso de que exista un saldo pendiente le haremos llegar un estado de cuenta para que conozca el detalle de los cargos realizados y el saldo pendiente. Si usted se encontraba al corriente en sus pagos al momento de solicitar su cancelación haga caso omiso a lo comentado previamente. <br>

Con respecto a toda la información que nos proporcionó se mantendrá bloqueada y resguardada por un periodo no mayor a 1 año, para que en caso de que usted quiera retomar el servicio con Garant Contable lo pueda hacer y así retomar lo más pronto posible el curso normal de sus declaraciones de impuestos y otras gestiones que pudimos haber realizado por usted, tome en cuenta que la seriedad y seguridad de la información es uno de los valores principales de Garant Contable, así como el establecimiento de nuestras normativas de seguridad de la información establecidas de acuerdo a lo que indicado por diversas disposiciones de la legislación mexicana. <br>

Si desea conocer más sobre estas disposiciones puede consultar el documento de términos y condiciones del servicio y nuestro aviso de privacidad. <br>

Respetuosamente,<br>

Equipo de Atención a Clientes | Garant Contable
Contaweb Empresarial SA de CV


@endcomponent