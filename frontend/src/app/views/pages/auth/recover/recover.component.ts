import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from 'src/app/core/JWT/token-storage.service';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.scss']
})
export class RecoverComponent implements OnInit {
  password: any;
  cpassword: any;
  correo: any;
  token: any;
  constructor(private storage: TokenStorageService,private http: HttpClient,private router: Router, private route: ActivatedRoute) { 
    
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    this.correo = this.route.snapshot.paramMap.get('email');
  }

  cambiar(e){
    let data = {
      email: this.correo,
      password: this.password,
      password_confirmation: this.cpassword,
      passwordToken: this.token

    }
    this.http.post(this.storage.getapi()+'auth/change-password',data).subscribe(data=>{
      this.startToast('success','Se ha actualizado la contraseña! Ya puedes iniciar sesión.');
      this.router.navigate(['/']);
    },error =>{

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
      timer: 3000,
      timerProgressBar: true,
    })
    
    Toast.fire({
      icon: type,
      title: message
    })
  }

}
