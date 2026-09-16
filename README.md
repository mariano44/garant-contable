# Garant Contable

Plataforma web de contabilidad y facturación electrónica para despachos contables
mexicanos. Un despacho da de alta a sus clientes, carga los CFDI de cada periodo
fiscal, los clasifica por rubro contable, verifica su vigencia contra el SAT y
emite facturas timbradas.

Construido para un despacho real y operado en producción. Este repositorio es una
versión de portafolio: mismo código, con los datos y credenciales del cliente
retirados y sustituidos por un juego de datos de demostración.

---

## Qué resuelve

Un contador que lleva varias empresas recibe cada mes cientos de archivos XML del
SAT y tiene que decir, de cada uno, a qué cuenta contable pertenece. El trabajo es
repetitivo, se hace en hojas de cálculo y se equivoca fácil.

La plataforma lo convierte en un flujo con estado:

1. **Carga** — se suben los XML del periodo; el sistema los parsea y deduplica por UUID.
2. **Verificación** — cada CFDI se consulta contra el web service del SAT para saber
   si sigue vigente o fue cancelado después de emitirse.
3. **Clasificación** — los comprobantes sin rubro aparecen en una bandeja de
   pendientes; se clasifican y ya no vuelven a pedirse.
4. **Reportes** — de ahí salen los acumulados por rubro, el histórico mensual y el
   comparativo de ingresos contra egresos.
5. **Facturación** — emisión de CFDI 3.3: se arma el XML, se sella localmente con el
   CSD del contribuyente y se envía al PAC por SOAP para su timbrado.

---

## Arquitectura

```
┌─────────────────────────┐        ┌──────────────────────────┐
│  frontend/  Angular 11  │  JWT   │  backend/  Laravel 8     │
│  SPA, 98 componentes    │◄──────►│  API REST, ~90 rutas     │
│  NobleUI + Bootstrap 4  │  JSON  │  Eloquent + query builder│
└─────────────────────────┘        └───────────┬──────────────┘
                                               │
                        ┌──────────────────────┼──────────────────────┐
                        ▼                      ▼                      ▼
                  ┌───────────┐        ┌──────────────┐       ┌──────────────┐
                  │  MySQL 8  │        │  SAT (SOAP)  │       │  PAC (SOAP)  │
                  │ 25 tablas │        │  vigencia    │       │  timbrado    │
                  └───────────┘        └──────────────┘       └──────────────┘
```

**Autenticación** — JWT, con un solo `users` para los dos tipos de usuario:
el contribuyente (`tipo = cliente`, tiene RFC y plan contratado) y el personal del
despacho (`tipo = contador`, tiene rol y clientes asignados). El token trae ya
resueltos los permisos, y el menú lateral se arma con ellos.

**Permisos** — dos tablas paralelas por diseño. El personal interno tiene permiso
granular por vista (`rols_permisos`: listar, crear, editar, eliminar); el cliente
solo tiene activa o inactiva por vista (`planes_permisos`), porque lo que compra es
un plan, no un rol.

**Sellado del CFDI** — el XML se construye, se transforma con el XSLT oficial del SAT
para obtener la cadena original, y se firma con la llave privada del CSD vía OpenSSL.
El timbrado propiamente dicho lo hace el PAC; el sellado es local.

---

## Cómo correrlo

### Requisitos

| Pieza    | Versión         | Nota                                              |
|----------|-----------------|---------------------------------------------------|
| PHP      | 8.0 – 8.2       | con `soap`, `zip`, `xsl`, `openssl`, `gd`, `bcmath` |
| Composer | 2.x             |                                                   |
| MySQL    | 5.7 u 8.x       | el código usa `DATE_FORMAT` y `CAST`, no es portable a SQLite |
| Node.js  | 14.x – 21.x     | En Node ≥ 17 hay que exportar `NODE_OPTIONS=--openssl-legacy-provider` |

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
# ajusta DB_DATABASE / DB_USERNAME / DB_PASSWORD en .env
php artisan migrate --seed
php artisan serve
```

Queda en `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
# En Node 17 o mayor, webpack 4 necesita esto:
export NODE_OPTIONS=--openssl-legacy-provider   # PowerShell: $env:NODE_OPTIONS="--openssl-legacy-provider"
npm start
```

Queda en `http://localhost:4200`.

Dos sustituciones respecto del proyecto original, para que compile en un Node
actual sin tocar el codigo de la aplicacion:

- `node-sass@4` por `sass` (Dart Sass). El primero compila un binario nativo
  amarrado a Node 14, que salio de soporte en 2023.
- `postcss` fijado en `8.4.31` con un `override`. Las versiones 8.2.x declaran
  sus exports con la forma `"./": "./"`, que Node 21 ya no resuelve, y
  `css-loader` truena al pedir `postcss/package.json`.

### Usuarios de demostración

El seeder deja tres cuentas, todas con contraseña `demo1234`:

| Correo                  | Perfil                                            |
|-------------------------|---------------------------------------------------|
| `direccion@demo.local`  | Personal interno, acceso total                    |
| `contador@demo.local`   | Personal interno, opera pero no administra        |
| `cliente@demo.local`    | Contribuyente demo, RFC `DEMO010101AAA`           |

Viene con un ejercicio fiscal abierto y CFDI de todo el año ya cargados. Los del
mes en curso quedan **sin clasificar** a propósito, para que la bandeja de
pendientes tenga con qué trabajar.

---

## Qué funciona sin credenciales externas

El proyecto se integra con tres servicios de terceros. Sin contratarlos, la app
corre igual y solo esas rutas quedan inertes:

| Módulo                    | Sin credenciales                                      |
|---------------------------|-------------------------------------------------------|
| Consulta de vigencia (SAT)| Funciona: el web service del SAT es público           |
| Timbrado (PAC)            | Arma y sella el XML, pero el PAC rechaza el envío     |
| Suscripciones (PayPal)    | La pantalla de planes se ve; el webhook no confirma   |
| Correo                    | Con `MAIL_MAILER=log` se escriben en el log           |

---

## Limitaciones conocidas

Se dejan anotadas en vez de disimuladas.

- **El esquema fue reconstruido.** Las migraciones originales cubrían 5 de 25 tablas;
  el resto se creó a mano en producción. Las migraciones de este repositorio se
  reconstruyeron leyendo cada consulta de los controladores, así que los tipos son
  razonables pero no necesariamente idénticos a los de la base original.
- **Sin pruebas automatizadas.** El proyecto se construyó contra un plazo de cliente
  y nunca tuvo suite. Es la primera deuda que pagaría.
- **Los controladores acceden a la base directamente.** No hay capa de servicios ni
  relaciones de Eloquent: los modelos son cascarones y todo va por query builder.
  Funciona, pero la lógica de negocio vive en los controladores.
- **`timbrar()` no persiste la factura.** La escritura a `facturacions` estaba
  comentada en el código original y se dejó igual; se documenta en vez de adivinar
  cuál era la intención.
- **CFDI 3.3**, retirado por el SAT en 2023 en favor de 4.0. Migrar el generador de
  XML sería el siguiente trabajo real sobre este código.

---

## Qué se retiró de la versión pública

Por seguridad, respecto del código que corrió en producción:

- El `.env` con la contraseña de la base, el `JWT_SECRET`, las credenciales del PAC
  y las de PayPal.
- Las credenciales del PAC y la clave del CRM que estaban escritas directamente en
  los controladores; ahora se leen de variables de entorno.
- El directorio `public/Sellos/`, que contenía los certificados CSD y FIEL —llaves
  privadas reales— de los contribuyentes del despacho.
- Las rutas absolutas del servidor de producción, sustituidas por `base_path()` y
  `public_path()`.

---

## Estructura

```
backend/
  app/Http/Controllers/     17 controladores, uno por área del dominio
  app/Models/               modelos Eloquent
  database/migrations/      esquema completo, 25 tablas
  database/seeders/         DemoSeeder: catálogos y datos de demostración
  public/utilerias/XSLT32/  XSLT oficial del SAT para la cadena original
  routes/api.php            ~90 rutas agrupadas por prefijo
  SWServices/               cliente SOAP de consulta al SAT

frontend/
  src/app/core/JWT/         interceptor, almacenamiento de sesión, servicios
  src/app/core/guard/       guard de rutas
  src/app/views/layout/     navbar, sidebar armado desde los permisos
  src/app/views/pages/
    auth/                   login, registro, recuperación de contraseña
    general/                el producto: CFDI, clasificación, facturación,
                            documentos, usuarios, roles, planes
    dashboard/              gráficas del periodo
```
