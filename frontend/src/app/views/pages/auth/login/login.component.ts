import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../../../core/JWT/usuarios.service';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { TokenStorageService } from 'src/app/core/JWT/token-storage.service';
import * as CryptoJS from 'crypto-js'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  showSpinner: any = false;
  clicked: any = false;
  text: any = 'Ingresar';
  passwordType: any = 'password';
  correo: any;
  password: any;
  returnUrl: any;
  alerttype: any;
  errormessage: any;
  closed: boolean = false;
  hide: boolean = true;
  constructor(private storage: TokenStorageService, private UService: UsuariosService,private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onLoggedin(e) {
    e.preventDefault();    
    this.clicked = true;
    this.text = 'Ingresando...';
    this.UService.login(this.correo,this.password).subscribe(data => {
      this.storage.saveHash(CryptoJS.AES.encrypt(this.password, "garantcont"));
      this.storage.saveUser(data['user']);
      this.storage.saveUltimoCliente(data['last']);
      this.storage.saveToken(data['access_token']); 
      this.router.navigate([this.returnUrl]);      
      this.startToast('success','Bienvenido! '+data['user']['nombres']+' '+data['user']['apellidos']);
      
    },error => {
      this.storage.signOut();
      this.clicked = false;
      this.text = 'Ingresar';
      if(error['status'] == 422){
        if(error['error']['email'] != undefined){
          this.startToast('warning',error['error']['email'][0]);
        }else{
          this.startToast('warning',error['error']['password'][0]);
        }
        
        // this.alerttype = 'fill-danger';
        // this.errormessage = error['error']['email'][0];
      }
      if(error['status'] == 401){
        this.startToast('warning',error['error']['error']);
        // this.alerttype = 'fill-danger';
        // this.errormessage = error['error']['error'];
      }
      if(error['status'] == 400){
        this.startToast('warning',error['error']['message']);
        // this.alerttype = 'fill-danger';
        // this.errormessage = error['error']['error'];
      }
    });
  }

  EnterSubmit(e){
    if(this.correo == '' || this.correo == undefined){
      
      return false;
    }

    if(this.password == '' || this.password == undefined){
      
      return false;
    }

    this.onLoggedin(e);
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

  hideShowPassword() {
		this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
		this.hide = this.hide === true ? false : true;
	}
}
