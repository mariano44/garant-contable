import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../../../../core/JWT/usuarios.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from 'src/app/core/JWT/token-storage.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

@Component({
  selector: 'app-newplan',
  templateUrl: './newplan.component.html',
  styleUrls: ['./newplan.component.scss']
})
export class NewplanComponent implements OnInit {

  nombre: any;
  costo: any;
  permisos: any = [];
  vistas: any = [];
  checkedVer: boolean = true;
  // checkedCreacion: boolean = true;
  // checkedEdicion: boolean = true;
  // checkedEliminar: boolean = true;
  saving: boolean = false;
  constructor(private datepipe: DatePipe,private storage: TokenStorageService,private http: HttpClient,private UService: UsuariosService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.http.get(this.storage.getapi()+'admin/planes/getVistas').subscribe(data => {
      this.vistas = [];
      data['result'] = data;
      for(let x=0;x<data['result'].length;x++){
        this.vistas.push({
          id: data['result'][x]['id'],
          vista: data['result'][x]['vista'],
          lista: 1,
          // edicion: 1,
          // creacion: 1,
          // eliminar: 1,
          checkedVer: true
          // checkedCrear: true,
          // checkedEdit:true,
          // checkedDelete: true
        });
        this.permisos.push({
          vista: data['result'][x]['vista'],
          lista: 1,
          // edicion: 1,
          // creacion: 1,
          // eliminar: 1,
          checkedVer: true,
          // checkedCrear: true,
          // checkedEdit:true,
          // checkedDelete: true
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

  checkVer(e){
    if(e.currentTarget.checked){
      for(let i=0;i<this.permisos.length;i++){
        this.permisos[i]['checkedVer'] = true;
      }
    }else{
      for(let i=0;i<this.permisos.length;i++){
        this.permisos[i]['checkedVer'] = false;
      }
    }
  }

  changeCheck(e,i: any,index: any){
    if(e.currentTarget.checked){
      this.permisos[i][index] = true;
    }else{
      this.permisos[i][index] = false;
    }
  }

  Guardar(){
    let perm = [];
    for(let i=0;i<this.permisos.length;i++){
      perm.push({
        vista: this.permisos[i]['vista'],
        activa: (this.permisos[i]['checkedVer'] ? 1 : 0)
      });
    }
    if(this.nombre == undefined || this.nombre == '' || this.nombre == null){
      this.startToast('error','El nombre no debe de ir vacío.'); 
      return false;
    }

    if(this.costo == undefined || this.costo == '' || this.costo == null || (this.costo*1) <= 0){
      this.startToast('error','El costo no debe de ir vacío o ser menor a 0.'); 
      return false;
    }
    let formData:FormData = new FormData();
    formData.append('nombre', this.nombre);
    formData.append('costo', this.costo);
    formData.append('permisos', JSON.stringify(perm));
    this.http.post(this.storage.getapi()+"admin/planes/insertar",formData).subscribe(data=>{     
      this.startToast('success',data['message']); 
      this.router.navigate(['/general/planes/editplan/'+data['planid']]);
    },error=>{
      if(error['status'] == '401'){
        // this.router.navigate(['/auth/login']);
        this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
          this.storage.saveToken(data['access_token']); 
          this.Guardar();
        });
      }
      this.startToast('error',error['error']['message']);
      
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
