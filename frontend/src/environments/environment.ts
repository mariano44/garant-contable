// Configuracion de desarrollo. `ng build --prod` reemplaza este archivo por
// environment.prod.ts; el mapeo esta en la seccion fileReplacements de angular.json.
export const environment = {
  production: false,

  // API de Laravel. Con `php artisan serve` el backend queda en el 8000.
  apiUrl: 'http://localhost:8000/api/',

  // Raiz del backend, para servir archivos subidos (logos, sellos, documentos).
  backendUrl: 'http://localhost:8000/',

  // Esta misma aplicacion. Se usa para armar las ligas de los correos.
  appUrl: 'http://localhost:4200/'
};
