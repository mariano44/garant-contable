import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from '../../../../core/JWT/token-storage.service';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

@Component({
  selector: 'app-cambiarcontrasenia',
  templateUrl: './cambiarcontrasenia.component.html',
  styleUrls: ['./cambiarcontrasenia.component.scss']
})
export class CambiarcontraseniaComponent implements OnInit {
  showSpinner: any = false;
  clicked: any = false;
  correo: any;
  password: any;
  returnUrl: any;
  alerttype: any;
  errormessage: any;
  closed: boolean = false;
  blockbutton: boolean = false;
  constructor(private storage: TokenStorageService,private http: HttpClient,private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    
  }

  cambiar(e) {
    e.preventDefault();    
    let data = {
      email: this.correo
    }
    this.blockbutton = true;
    this.http.post(this.storage.getapi()+'auth/reset-password-request',data).subscribe(data => {
      this.startToast('success',data['message']);
    },error => {
      this.startToast('error',error.error['message']);
      this.blockbutton = false;
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

}
