import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const PERMISOS_KEY = 'auth-permisos';
const LAST_CLIENTE = 'auth-cliente';
const HASHED = 'pass';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  signOut() {
    sessionStorage.clear();
  }

  public saveToken(token: string) {
    
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public saveHash(hashed: string) {
    
    sessionStorage.removeItem(HASHED);
    sessionStorage.setItem(HASHED, hashed);
  }

  public getHash(): string {
    return sessionStorage.getItem(HASHED);
  }

  public saveUser(user) {
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser() {
    return JSON.parse(sessionStorage.getItem(USER_KEY));
  }

  public savePermisos(permisos) {
    sessionStorage.removeItem(PERMISOS_KEY);
    sessionStorage.setItem(PERMISOS_KEY, JSON.stringify(permisos));
  }

  public getPermisos() {
    return JSON.parse(sessionStorage.getItem(PERMISOS_KEY));
  }

  public getUltimoCliente() {
    return JSON.parse(sessionStorage.getItem(LAST_CLIENTE));
  }

  public saveUltimoCliente(cliente) {
    sessionStorage.removeItem(LAST_CLIENTE);
    sessionStorage.setItem(LAST_CLIENTE, JSON.stringify(cliente));
  }

  /** URL de esta misma aplicacion Angular. */
  public geturl(){
    return environment.appUrl;
  }

  /** Raiz del API de Laravel, con /api/ incluido. */
  public getapi(){
    return environment.apiUrl;
  }

  /** Raiz del backend, para archivos servidos desde public/. */
  public getappURL(){
    return environment.backendUrl;
  }

}