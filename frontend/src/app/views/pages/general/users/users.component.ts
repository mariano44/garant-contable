import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../../../core/JWT/usuarios.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from 'src/app/core/JWT/token-storage.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { ColumnMode,SelectionType } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @BlockUI('asignarcontador') asignarcontador: NgBlockUI;
  defaultNavActiveId = 1;
  user: any;
  id: any;
  users: any;
  filtered: any;
  tipo: any = 'cliente';
  status: any = 1;
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  selected: any = [];
  columns: any = [{ name: 'ID' }, { name: 'Correo electrónico' }, { name: 'Nombres' }, { name: 'Apellidos' }, { name: 'Rol' }, { name: 'Alta' }, {name: 'Acciones'}];
  buscarcliente: any = '';
  buscarcontador: any = '';
  @ViewChild(DatatableComponent, {static: false}) table: DatatableComponent;
  hideDeleteButton = true;
  showUserList = true;
  index: any = 0;
  asignadoa: any;
  UsuariosDisponibles: any = [];
  mostrarBoton: any = "usuario";
  LowRols: boolean = true;
  constructor(private modalService: NgbModal,private datepipe: DatePipe,private storage: TokenStorageService,private http: HttpClient,private UService: UsuariosService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.user = this.storage.getUser();    
    let type = '';
    if(this.user['rolid'] == 8 || this.user['rolid'] == 15){
      type="ALL";
    }else{
      if(this.user['rolid'] == 16){
        type="Platino";
      }else if(this.user['rolid'] == 17){
        type='Oro';
      }else{
        type='Plata';
      }
    }
    this.http.get(this.storage.getapi()+'auth/users/'+type+'/'+this.status+'/'+this.user['rolid']).subscribe(data => {
      this.users = [];
      console.log(data);
      
      for(let x=0;x<data['result'].length;x++){
        this.users.push({
          id: data['result'][x]['id'],
          correo: data['result'][x]['email'],
          nombres: data['result'][x]['nombres'],
          apellidos: data['result'][x]['apellidos'],
          rol: data['result'][x]['rol'],
          plan: data['result'][x]['plan'],
          rfc: data['result'][x]['rfc'],
          tipo: data['result'][x]['tipo'],
          razonsocial: data['result'][x]['razonsocial'],
          fechaalta: this.datepipe.transform(data['result'][x]['created_at'], 'dd/MM/yyyy HH:mm:ss'),
          hidedeletebutton: (data['result'][x]['id'] == 8 ? true : false),
          asignadoa: data['result'][x]['asignadoa']
        });
      }
      this.filtered = [];
      for(let x=0;x<data['result'].length;x++){
        this.filtered.push({
          id: data['result'][x]['id'],
          correo: data['result'][x]['email'],
          nombres: data['result'][x]['nombres'],
          apellidos: data['result'][x]['apellidos'],
          rol: data['result'][x]['rol'],
          plan: data['result'][x]['plan'],
          rfc: data['result'][x]['rfc'],
          tipo: data['result'][x]['tipo'],
          razonsocial: data['result'][x]['razonsocial'],
          fechaalta: this.datepipe.transform(data['result'][x]['created_at'], 'dd/MM/yyyy HH:mm:ss'),
          asignadoa: data['result'][x]['asignadoa']
        });
      }
      
      if(this.user['rolid'] != 8 && this.user['rolid'] != 15){
        this.showUserList = false;
        this.defaultNavActiveId = 2;
        this.LowRols = false;
        this.FilterBy('cliente');
      }else{
        this.FilterBy('contador');
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

  cambiarpassword(id: any){

  }

  editar(id: any){

  }

  eliminar(id: any){

  }

  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);
  }

  onActivate(event) {
    console.log('Activate Event', event);
  }

  FilterBy(value: any){
    
    if(value == 'contador'){
      this.defaultNavActiveId = 1;
    }
    const temp = this.filtered.filter(function (d) {
      if(value != 'contador' && value != 'cliente'){
        if(d.rol != null){
          return d.rol.indexOf(value) !== -1 || !value;
        }        
      }else{
        return d.tipo.toLowerCase().indexOf(value) !== -1 || !value;
      }
      
    });

    // update the rows
    this.users = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  SearchByContador(e){
    let value: any = e.currentTarget.value;
       
    const temp = this.filtered.filter(function (d) {
      if(d.tipo.toLowerCase().indexOf('contador') !== -1){ 
        if(d.nombres.toLowerCase().indexOf(value) !== -1){ 
          return true
        }else if(d.apellidos.toLowerCase().indexOf(value) !== -1){
          return true
        }
      }      
    });

    // update the rows
    this.users = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  SearchByCliente(e){
    let value: any = e.currentTarget.value;
    const temp = this.filtered.filter(function (d) {
      if(d.tipo.toLowerCase().indexOf('cliente') !== -1){ 
        if(d.nombres.toLowerCase().indexOf(value) !== -1){ 
          return true
        }else if(d.apellidos.toLowerCase().indexOf(value) !== -1){
          return true
        }else if(d.razonsocial.toLowerCase().indexOf(value) !== -1){
          return true
        }else if(d.rfc.toLowerCase().indexOf(value) !== -1){
          return true
        }
      }      
    });

    // update the rows
    this.users = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  AsignarUsuario(content,indx) {
    this.index = indx;
    if(this.users[this.index].asignadoa != undefined){
      this.asignadoa = this.users[indx].asignadoa;
    }else{
      this.asignadoa = undefined;
    }
    this.http.get(this.storage.getapi()+'admin/porplan/'+this.users[indx]['plan']).subscribe(data=>{
      this.UsuariosDisponibles = [];
      for(let x=0;x<data['result'].length;x++){
        this.UsuariosDisponibles.push({
          id: data['result'][x]['id'],
          label: data['result'][x]['nombres']+' '+data['result'][x]['apellidos']
        })
      }
      this.modalService.open(content, {centered: true}).result.then((result) => {
        console.log("Modal closed" + result);
      }).catch((res) => {});
    },error=>{
      if(error['status'] == '401'){
        // this.router.navigate(['/auth/login']);
        // return false;
        this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
          this.storage.saveToken(data['access_token']); 
          this.AsignarUsuario(content,indx);
        });
      }
    });
    
  }

  Asignar(index: any){
    let formData:FormData = new FormData();
    formData.append('clienteid', this.users[index].id);
    formData.append('asignadoa',this.asignadoa);
    if(this.asignadoa == '' || this.asignadoa == null || this.asignadoa == undefined){
      this.startToast('warning','Favor de seleccionar un contador.'); 
      return;
    }
    this.asignarcontador.start('Asignando contador...'); // Start blocking
    this.http.post(this.storage.getapi()+"admin/asignar",formData).subscribe(data=>{  
      this.startToast('success',data['message']); 
      this.modalService.dismissAll();    
      this.asignarcontador.stop(); 
    },error=>{
      if(error['status'] == '401'){
        // this.router.navigate(['/auth/login']);
        // return false;
        this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
          this.storage.saveToken(data['access_token']); 
          this.Asignar(index);
        });
      }
      let err = JSON.parse(error['error']);
      this.startToast('error',err);
    });
  }

  pestanaClientes(){
    this.mostrarBoton = "cliente"
    
  }
  pestanaUsuarios(){
    this.mostrarBoton = "usuario"
    
  }

}
