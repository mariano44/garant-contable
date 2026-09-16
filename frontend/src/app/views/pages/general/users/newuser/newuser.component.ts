import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../../../../core/JWT/usuarios.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from 'src/app/core/JWT/token-storage.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { ColumnMode,SelectionType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-newuser',
  templateUrl: './newuser.component.html',
  styleUrls: ['./newuser.component.scss']
})
export class NewuserComponent implements OnInit {
  nombres: any;
  apellidos: any;
  correo: any;
  telefono: any;
  rol: any = '';
  roles: any;
  contrasenia: any;
  confirmarcontrasenia: any;
  vemail: any = '';
  vnombres: any = '';
  vapellidos: any = '';
  vpassword: any = '';
  vcpassword: any = '';
  vrol: any = '';
  constructor(private storage: TokenStorageService,private http: HttpClient,private UService: UsuariosService, private router: Router, private route: ActivatedRoute) { 
    
  }

  ngOnInit(): void {
    this.http.get(this.storage.getapi()+'admin/roles').subscribe(data => {
      this.roles = [];
      let datos = data['result'];
      for(let x=0;x<datos.length;x++){
        this.roles.push({
          id: datos[x]['id'],
          rol: datos[x]['nombre']
        });
      }
    },error => {
      if(error['status'] == '401'){
        // this.router.navigate(['/auth/login']);
        this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
          this.storage.saveToken(data['access_token']); 
          this.ngOnInit();
        });
      }
    });
  }

  startToast(type: any,message: any){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    })
    
    Toast.fire({
      icon: type,
      title: message
    })
  }
  
  Guardar(){

    if(this.correo == null || this.correo == '' || this.correo == undefined){
      this.startToast('warning','El correo no debe de estar vacío');
      this.vemail = 'input-wrong';
      return false;
    }else{
      this.vemail = '';
    }

    if(this.nombres == null || this.nombres == '' || this.nombres == undefined){
      this.startToast('warning','El nombre no debe de estar vacío');
      this.vnombres = 'input-wrong';
      return false;
    }else{
      this.vnombres = '';
    }
    if(this.apellidos == null || this.apellidos == '' || this.apellidos == undefined){
      this.startToast('warning','El apellido no debe de estar vacío');
      this.vapellidos = 'input-wrong';
      return false;
    }else{
      this.vapellidos = '';
    }
    if(this.contrasenia == null || this.contrasenia == '' || this.contrasenia == undefined){
      this.startToast('warning','La contraseña no debe de ir vacía');
      this.vpassword = 'input-wrong';
      return false;
    }else{
      this.vpassword = '';
    }

    if(this.confirmarcontrasenia == null || this.confirmarcontrasenia == '' || this.confirmarcontrasenia == undefined){
      this.startToast('warning','Favor de confirmar contraseña');
      this.vcpassword = 'input-wrong';
      return false;
    }else{
      this.vcpassword = '';
    }

    if(this.contrasenia != this.confirmarcontrasenia){
      this.startToast('warning','Las contraseñas no coinciden.');
      this.vpassword = 'input-wrong';
      this.vcpassword = 'input-wrong';
      return false;
    }else{
      this.vpassword = '';
      this.vcpassword = '';
    }

    if(this.rol == null || this.rol == '' || this.rol == undefined){
      this.startToast('warning','Favor de seleccionar un rol');
      this.vrol = 'input-wrong';
      return false;
    }else{
      this.vrol = '';
    }


    let formData:FormData = new FormData();
    formData.append('nombres', this.nombres);
    formData.append('apellidos', this.apellidos);
    formData.append('email', this.correo);
    formData.append('passowrd', this.contrasenia);
    formData.append('cpassword', this.confirmarcontrasenia);
    formData.append('telefono', this.telefono);
    formData.append('rolid', this.rol);
    formData.append('tipo', 'contador');
    this.http.post(this.storage.getapi()+"auth/nuevo",formData).subscribe(data=>{     
      this.startToast('success',data['message']); 
      this.router.navigate(['/general/perfil/'+data['user']]);      
    },error=>{
      if(error['status'] == '401'){
        // this.router.navigate(['/auth/login']);
        this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
          this.storage.saveToken(data['access_token']); 
          this.Guardar();
        });
      }
      let err = JSON.parse(error['error']);
      this.startToast('error',err['email'][0]);
      
    });

  }

}
