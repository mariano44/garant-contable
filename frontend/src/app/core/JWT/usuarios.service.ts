import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../JWT/token-storage.service';
import * as CryptoJS from 'crypto-js'; 

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(public tokenStorage: TokenStorageService,private http: HttpClient) { }

  login(correo,pass): Observable<any> {
    return this.http.post(this.tokenStorage.getapi()+'auth/login', {
      email: correo,
      password: pass
    });
  } 

  registrar(correo,nombres,apellidos,rfc,telefono,movil,regimen,razonsocial): Observable<any> {
    return this.http.post(this.tokenStorage.getapi()+'auth/register', {
      email: correo,
      nombres: nombres,
      apellidos: apellidos,
      rfc: rfc,
      telefono: telefono,
      movil: movil,
      regimen: regimen,
      razonsocial:razonsocial
    });
  } 

  Relogin(correo,pass): Observable<any> {
    return this.http.post(this.tokenStorage.getapi()+'auth/login', {
      email: correo,
      password: CryptoJS.AES.decrypt(pass, "garantcont")
    });
  } 
}
