import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../../../core/JWT/usuarios.service';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';


@Component({
  selector: 'app-newcliente',
  templateUrl: './newcliente.component.html',
  styleUrls: ['./newcliente.component.scss']
})
export class NewclienteComponent implements OnInit {
  correo: any;
  nombres: any;
  apellidos: any;
  telefono: any;
  movil: any;
  razonsocial: any;
  rfc: any;
  terminos: boolean = false;
  password: any;
  cpassword:any;
  returnUrl: any;
  regimen: any = 'No se mi régimen fiscal';
  vnombres: any = '';
  vapellidos: any = '';
  vemail: any = '';
  vrfc: any = '';
  vrazonsocial: any = '';
  vterminos: any = '';
  constructor(private UService: UsuariosService,private router: Router,private route: ActivatedRoute) { }

  ngOnInit(): void {
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onRegister(e) {
    e.preventDefault();    
    if(this.nombres == undefined){
      this.startToast('warning','Favor de ingresar un nombre.');
      this.vnombres = 'input-wrong';
      return false;
    }else{
      this.vnombres = '';
    }
    if(this.apellidos == undefined){
      this.startToast('warning','Favor de ingresar un nombre.');
      this.vapellidos = 'input-wrong';
      return false;
    }else{
      this.vapellidos = '';
    }
    if(this.rfc == undefined){
      this.startToast('warning','Favor de ingresar el rfc.');
      this.vrfc = 'input-wrong';
      return false;
    }else{
      this.vrfc = '';
    }
    if(this.correo == undefined){
      this.startToast('warning','Favor de ingresar el correo.');
      this.vemail = 'input-wrong';
      return false;
    }else{
      this.vemail = '';
    }
    if(this.regimen == 'Persona Moral' && this.razonsocial == undefined){
      this.startToast('warning','Si tu régimen es de persona moral, favor de ingresar una razón social.');
      this.vrazonsocial = 'input-wrong';
      return false;
    }else{
      this.vrazonsocial = '';
    }
    if(!this.terminos){
      this.startToast('warning','¡Favor de aceptar nuestro aviso de privacidad y nuestros términos y condiciones!');
      this.vterminos = 'input-wrong';
      return false;
    }else{
      this.vterminos = '';
    }
    // if(this.cpassword == undefined){
    //   this.startToast('warning','Favor de confirmar contraseña!');
    //   return false;
    // }

    // if(this.password != this.cpassword){
    //   this.startToast('warning','Las contraseñas no son iguales!');
    //   return false;
    // }
    this.UService.registrar(this.correo,this.nombres,this.apellidos,this.rfc,this.telefono,this.movil,this.regimen,this.razonsocial).subscribe(data => {
      this.router.navigate(['/general/users']);
      this.startToast('success',data['message']);
      // localStorage.setItem('isLoggedin', 'true');    
    },error => {
      localStorage.setItem('isLoggedin', 'false');  
      if(JSON.parse(error['error'])['email'] != undefined){
        this.startToast('warning',JSON.parse(error['error'])['email'][0]);
      }else{
        this.startToast('warning',JSON.parse(error['error'])['password'][0]);
      }
    });
  }

  RevisarPass(){
    if(this.password != this.cpassword){
      this.startToast('warning','Las contraseñas no son iguales!');
    }
  }

  startToast(type: any,message: any){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
    })
    
    Toast.fire({
      icon: type,
      title: message
    })
  }

  checkTerminos(e){
    if(e.currentTarget.checked){
      this.terminos = true;      
    }else{      
      this.terminos = false;
    }
  }

}
