import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../../../../core/JWT/usuarios.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from 'src/app/core/JWT/token-storage.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-newrol',
  templateUrl: './newrol.component.html',
  styleUrls: ['./newrol.component.scss']
})
export class NewRolComponent implements OnInit {
  @BlockUI("block-item") blockUI;
  nombre: any;
  descripcion: any;
  permisos: any = [];
  vistas: any = [];
  checkedVer: boolean = true;
  checkedCreacion: boolean = true;
  checkedEdicion: boolean = true;
  checkedEliminar: boolean = true;
  saving: boolean = false;
  constructor(private datepipe: DatePipe,private storage: TokenStorageService,private http: HttpClient,private UService: UsuariosService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.http.get(this.storage.getapi()+'admin/roles/getVistas').subscribe(data => {
      this.vistas = [];
      data['result'] = data;
      for(let x=0;x<data['result'].length;x++){
        this.vistas.push({
          id: data['result'][x]['id'],
          vista: data['result'][x]['vista'],
          lista: 1,
          edicion: 1,
          creacion: 1,
          eliminar: 1,
          checkedVer: true,
          checkedCrear: true,
          checkedEdit:true,
          checkedDelete: true
        });
        this.permisos.push({
          vista: data['result'][x]['vista'],
          lista: 1,
          edicion: 1,
          creacion: 1,
          eliminar: 1,
          checkedVer: true,
          checkedCrear: true,
          checkedEdit:true,
          checkedDelete: true
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

  checkCreacion(e){
    if(e.currentTarget.checked){
      for(let i=0;i<this.permisos.length;i++){
        this.permisos[i]['checkedCrear'] = true;
      }
    }else{
      for(let i=0;i<this.permisos.length;i++){
        this.permisos[i]['checkedCrear'] = false;
      }
    }
  }

  checkEdicion(e){
    if(e.currentTarget.checked){
      for(let i=0;i<this.permisos.length;i++){
        this.permisos[i]['checkedEdit'] = true;
      }
    }else{
      for(let i=0;i<this.permisos.length;i++){
        this.permisos[i]['checkedEdit'] = false;
      }
    }
  }

  checkEliminar(e){
    if(e.currentTarget.checked){
      for(let i=0;i<this.permisos.length;i++){
        this.permisos[i]['checkedDelete'] = true;
      }
    }else{
      for(let i=0;i<this.permisos.length;i++){
        this.permisos[i]['checkedDelete'] = false;
      }
    }
  }

  checkVista(i: any,e){
    if(e.currentTarget.checked){
      this.permisos[i]['checkedVer'] = true;
      this.permisos[i]['checkedCrear'] = true;
      this.permisos[i]['checkedEdit'] = true;
      this.permisos[i]['checkedDelete'] = true;
    }else{
      this.permisos[i]['checkedVer'] = false;
      this.permisos[i]['checkedCrear'] = false;
      this.permisos[i]['checkedEdit'] = false;
      this.permisos[i]['checkedDelete'] = false;
    }
  }

  Guardar(){
    this.blockUI.start('Guardando cambios...');
    let perm = [];
    for(let i=0;i<this.permisos.length;i++){
      perm.push({
        vista: this.permisos[i]['vista'],
        lista: (this.permisos[i]['checkedVer'] ? 1 : 0),
        creacion: (this.permisos[i]['checkedCrear'] ? 1 : 0),
        edicion: (this.permisos[i]['checkedEdit'] ? 1 : 0),
        eliminar: (this.permisos[i]['checkedDelete'] ? 1 : 0),
      });
    }
    let formData:FormData = new FormData();
    formData.append('nombre', this.nombre);
    formData.append('descripcion', this.descripcion);
    formData.append('permisos', JSON.stringify(perm));
    this.http.post(this.storage.getapi()+"admin/roles/insertar",formData).subscribe(data=>{     
      this.startToast('success',data['message']); 
      this.blockUI.stop();
      this.router.navigate(['/general/roles/editrol/'+data['rolid']]);
    },error=>{
      if(error['status'] == '401'){
        // this.router.navigate(['/auth/login']);
        this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
          this.storage.saveToken(data['access_token']); 
          this.Guardar();
        });
      }
      this.startToast('error',error['error']['message']);
      this.blockUI.stop();
      
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
