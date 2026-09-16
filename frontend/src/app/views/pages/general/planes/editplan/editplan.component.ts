import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../../../../core/JWT/usuarios.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from 'src/app/core/JWT/token-storage.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

@Component({
  selector: 'app-editplan',
  templateUrl: './editplan.component.html',
  styleUrls: ['./editplan.component.scss']
})
export class EditplanComponent implements OnInit {

  title = 'VER PLAN';
  id: any;
  nombre: any;
  oldnombre: any;
  costo: any;
  oldcosto: any;
  permisos: any = [];
  oldpermisos: any = [];
  checkedVer: boolean = true;
  saving: boolean = false;
  Editing: boolean = true;
  constructor(private datepipe: DatePipe,private storage: TokenStorageService,private http: HttpClient,private UService: UsuariosService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.http.get(this.storage.getapi()+'admin/planes/editar/'+this.id).subscribe(data => {   
      this.nombre = data['data']['nombre'];
      this.oldnombre = data['data']['nombre'];
      this.costo = data['data']['costo'];
      this.oldcosto = data['data']['costo'];
      for(let x=0;x<data['permisos'].length;x++){
        this.permisos.push({
          vista: data['permisos'][x]['vista'],
          lista: data['permisos'][x]['activa'],
          checkedVer: (data['permisos'][x]['activa'] == 1 ? true : false)
        });
        this.oldpermisos.push({
          vista: data['permisos'][x]['vista'],
          lista: data['permisos'][x]['activa'],
          checkedVer: (data['permisos'][x]['activa'] == 1 ? true : false)
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

  Guardar(){
    let perm = [];
    for(let i=0;i<this.permisos.length;i++){
      perm.push({
        vista: this.permisos[i]['vista'],
        activa: (this.permisos[i]['checkedVer'] ? 1 : 0)
      });
    }
    let formData:FormData = new FormData();
    formData.append('id', this.id);
    formData.append('nombre', this.nombre);
    formData.append('costo', this.costo);
    formData.append('permisos', JSON.stringify(perm));
    this.http.post(this.storage.getapi()+"admin/planes/editar",formData).subscribe(data=>{     
      this.startToast('success',data['message']); 
      this.Editing = true;
      this.title = 'VER PLAN';
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

  Cancelar(){
    this.nombre = this.oldnombre;
    this.costo = this.oldcosto;
    this.permisos = this.oldpermisos;
    this.Editing = true;
    this.title = 'VER PLAN';
  }

  editarPlan(){
    this.Editing = false;
    this.title = 'EDITANDO PLAN';
  }

  changeCheck(e,i: any,index: any){
    if(e.currentTarget.checked){
      this.permisos[i][index] = true;
    }else{
      this.permisos[i][index] = false;
    }
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
