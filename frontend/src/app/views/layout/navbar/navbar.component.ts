import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../core/JWT/token-storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { UsuariosService } from '../../../core/JWT/usuarios.service';
import * as CryptoJS from 'crypto-js'; 

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user: any;  
  fotoperfil: any;
  selectedSearchPersonId: any;
  oldselectedSearchPersonId: any;
  clientes: any = [];
  showListado: boolean = true;
  nombre: any;
  mensaje: any;
  mensaje2: any;
  activo: boolean = false;
  constructor(
    @Inject(DOCUMENT) private document: Document, 
      private http: HttpClient,
      private renderer: Renderer2,
      private router: Router,
      private UService: UsuariosService,
      private storage: TokenStorageService
    ) {
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
      // this.http.post(this.storage.getapi()+'auth/refresh',{user:this.storage.getUser()['email'],password: CryptoJS.AES.decrypt(this.storage.getHash(), "garantcont") }).subscribe(data =>{        
      //   this.storage.saveToken(data['access_token']); 
      // },error=>{

      // });
    }

  ngOnInit(): void {
    this.user = this.storage.getUser();
    if(this.user['perfil'] != null && this.user['perfil'] != undefined){
      if(this.user['tipo'] == 'cliente'){
        this.fotoperfil = this.storage.getappURL()+'/Sellos/'+this.user['rfc']+'/perfil/'+this.user['perfil'];
      }else{
        this.fotoperfil = this.storage.getappURL()+'/Sellos/'+this.user['id']+'/perfil/'+this.user['perfil'];
      }      
    }else{
      this.fotoperfil = '../../../../assets/images/fotoperfil.jpg';
    }
    
    if(this.user['tipo'] != 'cliente'){
      if(this.storage.getUltimoCliente() != undefined){
        this.selectedSearchPersonId = this.storage.getUltimoCliente();
        this.oldselectedSearchPersonId = this.storage.getUltimoCliente();
        let url: any;
          if(this.user['rolid'] == 8 || this.user['rolid'] == 15){
            url = 'cliente/1/'+this.user['rolid'];
          }else{
            url = 'listadoasignado/'+this.user['id']+'/cliente/1';
          }
          this.http.get(this.storage.getapi()+'auth/users/'+url).subscribe(data =>{
            this.clientes = [];      
            for(let x=0;x<data['result'].length;x++){
              this.clientes.push({
                name: data['result'][x]['rfc']+' - '+(data['result'][x]['regimen'] == 'Persona Moral' ? data['result'][x]['razonsocial'] : data['result'][x]['nombres']+" "+data['result'][x]['apellidos']),
                rfc: data['result'][x]['rfc']
              });
            }
          },error=>{
            if(error['status'] == '401'){
              // this.router.navigate(['/auth/login']);
              this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
                this.storage.saveToken(data['access_token']); 
                this.ngOnInit();
              });
            }
          });
      }else{
        this.http.get(this.storage.getapi()+'admin/users/getlast/'+this.user['id']).subscribe(data =>{
          if(data['last'] != ''){
            this.storage.saveUltimoCliente(data['last']);
            this.selectedSearchPersonId = data['last'];
            this.oldselectedSearchPersonId = data['last'];
            let url: any;
            if(this.user['rolid'] == 8 || this.user['rolid'] == 15){
              url = 'cliente/1/'+this.user['rolid'];
            }else{
              url = 'listadoasignado/'+this.user['id']+'/cliente/1';
            }
            this.http.get(this.storage.getapi()+'auth/users/'+url).subscribe(data =>{
              this.clientes = [];      
              for(let x=0;x<data['result'].length;x++){
                this.clientes.push({
                  name: data['result'][x]['rfc']+' - '+(data['result'][x]['regimen'] == 'Persona Moral' ? data['result'][x]['razonsocial'] : data['result'][x]['nombres']+" "+data['result'][x]['apellidos']),
                  rfc: data['result'][x]['rfc']
                });
              }            
            },error=>{
              if(error['status'] == '401'){
                // this.router.navigate(['/auth/login']);
                this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
                  this.storage.saveToken(data['access_token']); 
                  this.ngOnInit();
                });
              }
            });
          }else{
            let url: any;
            if(this.user['rolid'] == 8 || this.user['rolid'] == 15){
              url = 'cliente/1/'+this.user['rolid'];
            }else{
              url = 'listadoasignado/'+this.user['id']+'/cliente/1';
            }
            this.http.get(this.storage.getapi()+'auth/users/'+url).subscribe(data =>{
              this.clientes = [];      
              for(let x=0;x<data['result'].length;x++){
                this.clientes.push({
                  name: data['result'][x]['rfc']+' - '+(data['result'][x]['regimen'] == 'Persona Moral' ? data['result'][x]['razonsocial'] : data['result'][x]['nombres']+" "+data['result'][x]['apellidos']),
                  rfc: data['result'][x]['rfc']
                });
              }            
            },error=>{
              if(error['status'] == '401'){
                // this.router.navigate(['/auth/login']);
                this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
                  this.storage.saveToken(data['access_token']); 
                  this.ngOnInit();
                });
              }
            });
          }
        },error=>{
          if(error['status'] == '401'){
            // this.router.navigate(['/auth/login']);
            this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
              this.storage.saveToken(data['access_token']); 
              this.ngOnInit();
            });
          }
        });
      }
    }else{
      this.showListado = false;
      if(this.storage.getUltimoCliente() == undefined){
        this.storage.saveUltimoCliente(this.user['rfc']);
      }
      if(this.user['razonsocial'] != undefined){
        this.nombre = this.user['razonsocial'];
      }else{
        this.nombre = this.user['nombres']+" "+this.user['apellidos'];
      }
      if(this.user['status'] == 0){
        this.activo = true;
        this.mensaje = 'Tu suscripción tiene limitado el servicio, contacta con el administrador de Garant Contable.';
        this.mensaje2 = 'mailto:pagos@garantcontable.com?subject=Solicito de su ayuda para reestablecer mi servicio';
      }
    }

  }

  /**
   * Sidebar toggle on hamburger button click
   */
  toggleSidebar(e) {
    e.preventDefault();
    this.document.body.classList.toggle('sidebar-open');
  }

  /**
   * Logout
   */
  onLogout(e) {
    e.preventDefault();
    this.storage.signOut();
    
    this.router.navigate(['/auth/login']);    
  }

  changeRFC(){
    const Alrt = Swal.mixin({
      showConfirmButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:'Si',      
      cancelButtonText: 'No'      
    })
    
    Alrt.fire({
      icon: 'warning',
      title: '¿Deseas cambiar de cliente?'
    }).then((result)=>{
      if(result.isConfirmed){   
        let formData:FormData = new FormData();
        formData.append('idusuario', this.user['id']);
        formData.append('cliente', this.selectedSearchPersonId);
        this.http.post(this.storage.getapi()+'admin/setLast',formData).subscribe(data=>{
          this.storage.saveUltimoCliente(this.selectedSearchPersonId);
          location.reload();
        },error=>{
          if(error['status'] == '401'){
            // this.router.navigate(['/auth/login']);
            this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
              this.storage.saveToken(data['access_token']); 
              let formData:FormData = new FormData();
              formData.append('idusuario', this.user['id']);
              formData.append('cliente', this.selectedSearchPersonId);
              this.http.post(this.storage.getapi()+'admin/setLast',formData).subscribe(data=>{
                this.storage.saveUltimoCliente(this.selectedSearchPersonId);
                location.reload();
              });
            });
          }
        });
          
      }
      if(result.isDismissed){        
        return;
      }
    });
  }

}
