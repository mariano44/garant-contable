import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../../../../core/JWT/usuarios.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from 'src/app/core/JWT/token-storage.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-roledit',
  templateUrl: './roledit.component.html',
  styleUrls: ['./roledit.component.scss']
})
export class RoleditComponent implements OnInit {
  @BlockUI("block-item") blockUI;
  title = 'VER ROL';
  id: any;
  nombre: any;
  oldnombre: any;
  descripcion: any;
  olddescripcion: any;
  permisos: any = [];
  oldpermisos: any = [];
  vistas: any = [];
  checkedVer: boolean = true;
  checkedCreacion: boolean = true;
  checkedEdicion: boolean = true;
  checkedEliminar: boolean = true;
  saving: boolean = false;
  Editing: boolean = true;
  isin: boolean = false;
  vistamissing: any = [];;
  constructor(private datepipe: DatePipe,private storage: TokenStorageService,private http: HttpClient,private UService: UsuariosService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.http.get(this.storage.getapi()+'admin/roles/getVistas').subscribe(data => {
      this.vistas = [];
      data['result'] = data;
      for(let x=0;x<data['result'].length;x++){
        this.vistas.push({
          vista: data['result'][x]['vista'],
          lista: 0,
          edicion: 0,
          creacion: 0,
          eliminar: 0,
          checkedVer: false,
          checkedCrear: false,
          checkedEdit: false,
          checkedDelete: false
        });
      }
      this.http.get(this.storage.getapi()+'admin/roles/editar/'+this.id).subscribe(data => {   
        this.nombre = data['data']['nombre'];
        this.oldnombre = data['data']['nombre'];
        this.descripcion = data['data']['descripcion'];
        this.olddescripcion = data['data']['descripcion'];
        for(let y=0;y<this.vistas.length;y++){
          for(let x=0;x<data['permisos'].length;x++){   
            if(this.vistas[y]['vista'] == data['permisos'][x]['vista']){
              this.vistas[y]['lista'] = data['permisos'][x]['lista'];
              this.vistas[y]['edicion'] = data['permisos'][x]['creacion'];
              this.vistas[y]['creacion'] = data['permisos'][x]['edicion'];
              this.vistas[y]['eliminar'] = data['permisos'][x]['eliminar'];
              this.vistas[y]['checkedVer'] = (data['permisos'][x]['lista'] == 1 ? true : false);
              this.vistas[y]['checkedCrear'] = (data['permisos'][x]['creacion'] == 1 ? true : false);
              this.vistas[y]['checkedEdit'] = (data['permisos'][x]['edicion'] == 1 ? true : false);
              this.vistas[y]['checkedDelete'] = (data['permisos'][x]['eliminar'] == 1 ? true : false);
            }
          }
        }
        this.permisos = this.vistas;
        this.oldpermisos = this.vistas;
      },error => {
        if(error['status'] == '401'){
          // this.router.navigate(['/auth/login']);
          this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
            this.storage.saveToken(data['access_token']); 
            this.ngOnInit();
          });
        }
      });
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
    formData.append('id', this.id);
    formData.append('nombre', this.nombre);
    formData.append('descripcion', this.descripcion);
    formData.append('permisos', JSON.stringify(perm));
    this.http.post(this.storage.getapi()+"admin/roles/editar",formData).subscribe(data=>{     
      this.startToast('success',data['message']); 
      this.Editing = true;
      this.title = 'VER ROL';
      this.blockUI.stop();
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

  Cancelar(){
    this.nombre = this.oldnombre;
    this.descripcion = this.olddescripcion;
    this.permisos = this.oldpermisos;
    this.Editing = true;
    this.title = 'VER ROL';
  }

  editarRol(){
    this.Editing = false;
    this.title = 'EDITANDO ROL';
  }

  changeCheck(e,i: any,index: any){
    if(e.currentTarget.checked){
      this.permisos[i][index] = true;
    }else{
      this.permisos[i][index] = false;
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

}
