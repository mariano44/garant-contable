import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../../../core/JWT/usuarios.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from 'src/app/core/JWT/token-storage.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  @BlockUI('contramodal') contramodal: NgBlockUI;
  @BlockUI('perfildiv') perfildiv: NgBlockUI;
  @BlockUI('susModal') susModal: NgBlockUI;
  @BlockUI("block-item") blockUI;
  //MARIANO RECIO
  facturacioncheck:boolean = false;
  nominascheck:boolean = false;
  numeronominas:any;
  numerotimbres:any;
  //
  id: any;
  user: any;
  rOnly: boolean = true;
  isOn: boolean = false;
  isOff: boolean = true;
  razonsocial: any;
  oldrazonsocial: any;
  nombres: any;
  oldnombres: any;
  apellidos: any;
  oldapellidos: any;
  rfc: any;
  oldrfc: any;
  curp: any;
  codigopostalperfil:any;
  oldcodigopostalperfil:any;
  oldcurp: any;
  telefono: any;
  oldtelefono: any;
  regimen: any;
  oldregimen: any;
  registro: any;
  correo: any;
  usuario: any;
  plan: any;
  oldplan: any;
  planid: any;
  oldplanid: any;
  descripcion: any = '';
  olddescripcion: any;
  fotoperfil: any; 
  showEditIcon: boolean = false;
  isUploaded: boolean = false;
  foto: any;
  oldfoto: any;
  tipo: any;
  rol: any;
  oldrol: any;
  rolid: any;
  oldrolid: any;
  hideifcontador: boolean = true;
  hiderolselect: boolean = false;
  EditRol: boolean = false;
  quienve: any;
  planes: any = [];
  roles: any = [];
  showplanname: boolean = true;
  showrolname: boolean = true;
  showplanselect: boolean = false;
  showrolselect: boolean = false;
  showEditplanButton: boolean = false;
  showEditrolButton: boolean = false;
  password: any;
  cpassward: any;
  cover: any;
  motivo: any;
  LowRols: boolean;
  cuadrado: boolean = true;
  oldcuadrado: boolean = true;
  logo: any;
  oldlogo: any;
  logoname: any;
  oldlogoname: any;
  imglogo: any;
  hidelogo: boolean = false;
  oldimglogo: any;
  vinodepaypal: boolean = true;
  timbres: any;
  nominas: any;
  //CLICK BOTONES
  timbresinput: boolean = true;
  nominasinput: boolean = true;
  aceptarFacturacionButtons: any;
  clickTimbres:any;
  aceptarNominasButtons:any;
  clickNominas:any;
  botonClickNominas:any;
  botonClickTimbres:any
  texto:any;
  periodoPrueba:any;
  asignadoa:any;
  rolQuienve:any;
  userform:any = new FormGroup ({
    password: new FormControl("", [Validators.minLength(8), Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')])
  })


  constructor(private modalService: NgbModal,private datepipe: DatePipe,private storage: TokenStorageService,private http: HttpClient,private UService: UsuariosService, private router: Router, private route: ActivatedRoute) { 
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }
debugger;
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id);
 
    
    this.quienve = this.storage.getUser()['tipo'];
    this.rolQuienve = this.storage.getUser()['rolname'];
    
    
    
    this.http.get(this.storage.getapi()+'perfil/'+this.id).subscribe(data => {
     console.log(data);
     
      this.periodoPrueba = data['user']['periodoprueba'];
      
      this.asignadoa = data['user']['asignadoa'];
      this.razonsocial = data['user']['razonsocial'];
      this.oldrazonsocial = data['user']['razonsocial'];
      this.nombres = data['user']['nombres'];
      this.oldnombres = data['user']['nombres'];
      this.apellidos = data['user']['apellidos'];
      this.oldapellidos = data['user']['apellidos'];
      this.rfc = data['user']['rfc'];
      this.oldrfc = data['user']['rfc'];
      this.curp = (data['user']['curp'] == "null" ? '' : data['user']['curp']);
      this.oldcodigopostalperfil = data['user']['codigopostalperfil'] == "null" ? '' : data['user']['codigopostalperfil'];
      this.codigopostalperfil = data['user']['codigopostalperfil'] == "null" ? '' : data['user'] ['codigopostalperfil'];
      this.oldcurp = (data['user']['curp'] == "null" ? '' : data['user']['curp']);
      this.telefono = data['user']['telefono'];
      this.oldtelefono = data['user']['telefono'];
      this.regimen = data['user']['regimen'];
      this.oldregimen = data['user']['regimen'];
      this.correo = data['user']['email'];
      this.usuario = data['user']['email'];
      this.descripcion = (data['user']['descripcion'] == "null" ? '' : data['user']['descripcion']);
      this.olddescripcion = (data['user']['descripcion'] == "null" ? '' : data['user']['descripcion']);
      this.registro = this.datepipe.transform(data['user']['created_at'], 'dd/MM/yyyy HH:mm:ss');     
      this.tipo = data['user']['tipo'];
      this.plan = data['user']['planname'];
      this.oldplan = data['user']['planname'];
      this.planid = data['user']['planid'];
      this.oldplanid = data['user']['planid'];
      this.rol = data['user']['rolname']; //ES EL ROLNAME
      this.oldrol = data['user']['rolname'];
      this.rolid = data['user']['rolid'];
      this.oldrolid = data['user']['rolid'];
      this.timbres = data['user']['timbres'];
      this.nominas = data['user']['nominas'];
      

//VALIDACIONES PARA BOTON CAMBIAR CONTRASENA
console.log(this.rolQuienve);

if(this.quienve === 'cliente') { //El cliente puede cambiar su contra.
  this.LowRols = true;
} 
  
if(this.rolQuienve === 'Director') { //El director puede cambiar la contra de todos.
  this.LowRols = true;
}

if(this.rolQuienve === 'Supervisor' && this.rol != 'Director') {  //Si es supervisor puede cambiar la contra menos al director
    this.LowRols = true;
}

if(this.rolQuienve === 'Contador Platino' || this.rolQuienve === 'Contador Oro'|| this.rolQuienve === 'Contador Plata' ) { //Si es contador, solo a los clientes asignados .
  if(this.id === this.asignadoa) {
    this.LowRols = true;
  }
}       

      if(data['user']['logocuadrado'] == 1){
        this.cuadrado = true;
        this.oldcuadrado = true;
      }else{
        this.cuadrado = false;
        this.oldcuadrado = false;
      }
      if(this.tipo == 'cliente'){
        this.planes = data['planes'];
      }else{
        this.roles = data['roles'];
      }
      if(data['user']['perfil'] == null || data['user']['perfil'] == undefined){
        this.fotoperfil = '../../../../assets/images/fotoperfil.jpg';
        this.cover = 'fondoperfil';
      }else{
        if(data['user']['tipo'] == 'cliente'){
          this.cover = 'fondoperfil';
          this.fotoperfil = this.storage.getappURL()+"/Sellos/"+this.rfc+"/perfil/"+data['user']['perfil'];
          this.oldfoto = this.storage.getappURL()+"/Sellos/"+this.rfc+"/perfil/"+data['user']['perfil'];
        }else{
          this.cover = 'fondointerno';
          this.fotoperfil = this.storage.getappURL()+"/Sellos/"+this.id+"/perfil/"+data['user']['perfil'];
          this.oldfoto = this.storage.getappURL()+"/Sellos/"+this.id+"/perfil/"+data['user']['perfil'];
        }
      }      
      if(this.quienve == 'cliente'){
          this.hideifcontador = false;
          this.showrolname = false;
          this.vinodepaypal = (data['user']['sus_id'] != null ? true : false);          
          this.timbresinput = true;
          this.nominasinput = true;
          if(this.timbres > 0){
            this.facturacioncheck = true;
          }
          if(this.nominas > 0){
            this.nominascheck = true;
          }
      }else{
        if(this.tipo == 'cliente'){
          this.hideifcontador = false;
          this.showrolname = true;          
          if(this.timbres > 0){
            this.facturacioncheck = true;
            this.timbresinput = false;
          }
          if(this.nominas > 0){
            this.nominascheck = true;
            this.nominasinput = false;
          }
        }else{
          this.hiderolselect = true;
          this.showplanname = false;
         
         
        }
      }
      
      if(data['user']['logo'] != null && data['user']['perfil'] != undefined){
        this.hidelogo = true;
        this.imglogo = this.storage.getappURL()+"Sellos/"+this.rfc+"/perfil/"+data['user']['logo'];
        this.oldimglogo = this.storage.getappURL()+"Sellos/"+this.rfc+"/perfil/"+data['user']['logo'];
        this.logoname = data['user']['logo'];
        this.oldlogoname = data['user']['logo'];
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

  
  Editar(){
    this.rOnly = !this.rOnly;
    this.isOn = !this.isOn;
  }

  CancelarP(){
    this.nombres = this.oldnombres;
    this.apellidos = this.oldapellidos;
    this.razonsocial = this.oldrazonsocial;
    this.rfc = this.oldrfc;
    this.curp = this.oldcurp;
    this.codigopostalperfil = this.oldcodigopostalperfil;
    this.telefono = this.oldtelefono;
    this.regimen = this.oldregimen;
    this.descripcion = this.olddescripcion;
    this.planid = this.oldplanid;
    this.rolid = this.oldrolid;
    this.plan = this.oldplan;
    this.rol = this.oldrol;
    this.rOnly = !this.rOnly;
    this.isOn = !this.isOn;
    this.cuadrado = this.oldcuadrado;
    this.logoname = this.oldlogoname;
    this.imglogo = this.oldimglogo;
    document.getElementById("fileUploadInputExampleFC").setAttribute('value',null);
  }

  GuardarP(){
    if(this.tipo == 'cliente'){
      if(this.codigopostalperfil == null || this.codigopostalperfil == "" || this.codigopostalperfil == undefined) {
        this.startToast('warning','Favor de ingresar Codigo Postal');
        return false;
      }
      if(this.nombres == null || this.nombres == "" || this.nombres == undefined) {
        this.startToast('warning','Favor de ingresar el Nombre');
        return false;
      }
      if(this.apellidos == null || this.apellidos == "" || this.apellidos == undefined) {
        this.startToast('warning','Favor de ingresar los Apellidos');
        return false;
      }
      if(this.regimen == null || this.regimen == "" || this.regimen == undefined) {
        this.startToast('warning','Favor de ingresar el Regimen Fiscal');
        return false;
      }
      if(this.rfc == null || this.rfc == "" || this.rfc == undefined) {
        this.startToast('warning','Favor de ingresar el RFC');
        return false;
      }


    this.perfildiv.start('Guardando...');
    
      let formData:FormData = new FormData();
      formData.append('razonsocial', this.razonsocial);
      formData.append('logoname', this.logoname);
      formData.append('logo', this.logo);
      formData.append('id', this.id);
      formData.append('nombres', this.nombres);
      formData.append('apellidos', this.apellidos);
      formData.append('rfc', this.rfc);
      formData.append('curp', this.curp);
      formData.append('codigopostalperfil', this.codigopostalperfil);
      formData.append('regimen', this.regimen);
      formData.append('telefono', this.telefono);
      formData.append('descripcion', this.descripcion);
      formData.append('logocuadrado', (this.cuadrado ? "1" : "0"));

      this.http.post(this.storage.getapi()+'perfil/update',formData).subscribe(data => {
        if(this.storage.getUser()['id'] == this.id){
          this.storage.saveUser = data['user'];
        }
        this.isOn = !this.isOn;
        this.rOnly = !this.rOnly;
        this.startToast('success','Se ha actualizado el perfil correctamente!');
        this.perfildiv.stop();
      },error =>{
        if(error['status'] == '401'){
          // this.router.navigate(['/auth/login']);
          this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
            this.storage.saveToken(data['access_token']); 
            this.GuardarP();
          });
        }
        this.perfildiv.stop();
      });
    }else{
      let data = {
        id: this.id,
        nombres: this.nombres,
        apellidos: this.apellidos,
        telefono: this.telefono
      }

      this.http.post(this.storage.getapi()+'perfil/updatecontador',data).subscribe(data => {
        this.storage.saveUser = data['user'];
        this.isOn = !this.isOn;
        this.rOnly = !this.rOnly;
        this.startToast('success','Se ha actualizado el perfil correctamente!');
        this.perfildiv.stop();
      },error =>{
        if(error['status'] == '401'){
          // this.router.navigate(['/auth/login']);
          this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
            this.storage.saveToken(data['access_token']); 
            this.GuardarP();
          });
        }
        this.perfildiv.stop();
      });
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

  showEditPic(){
    this.showEditIcon = true;
  }

  hideEditPic(){
    this.showEditIcon = false;
  }
    // Funciones para cambiar plan en usuario
  showEditPlan(){
    if(this.storage.getUser()['tipo'] == 'contador'){
      this.showEditplanButton = true;
    }
  }

  hideEditPlan(){
    if(this.storage.getUser()['tipo'] == 'contador'){
      this.showEditplanButton = false;
    }
  }

  ActivarSelectPlan(){
    if(this.storage.getUser()['tipo'] == 'contador'){
      this.showplanselect = true;
      this.showplanname = false;
    }
  }

  CambiarPlan(){
    if(this.planid == this.oldplanid){      
      this.showplanselect = false;
      this.showplanname = true;
      return false;
    }
    let formData:FormData = new FormData();
    formData.append('idusuario', this.id);
    formData.append('planid', this.planid);
    this.http.post(this.storage.getapi()+"perfil/actualizarplan",formData).subscribe(data=>{     
      this.startToast('success',data['message']); 
      this.plan = data['plan'];
      this.oldplan = data['plan']
      this.oldplanid = this.planid;
      this.showplanselect = false;
      this.showplanname = true;
    },error=>{
      if(error['status'] == '401'){
        // this.router.navigate(['/auth/login']);
        this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
          this.storage.saveToken(data['access_token']); 
          this.CambiarPlan();
        });
      }
      this.startToast('error',error['error']['message']);      
    });
  }

  CancelCambiarPlan(){
    if(this.storage.getUser()['tipo'] == 'contador'){
      this.showplanselect = false;
      this.planid = this.oldplanid;
      this.showplanname = true;
    }
  }

  // Funciones para cambiar rol en perfil de contador

  showEditRol(){
    if(this.storage.getUser()['tipo'] == 'contador'){
      if(this.storage.getUser()['rolid'] <= 15){
        this.showEditrolButton = true;
      }
    }
  }


  hideEditRol(){
    if(this.storage.getUser()['tipo'] == 'contador'){
      this.showEditrolButton = false;
    }
  }

  ActivarSelectRol(){
    if(this.storage.getUser()['tipo'] == 'contador'){
      this.showrolselect = true;
      this.showrolname = false;
    }
  }

  CambiarRol(){
    if(this.rolid == this.oldrolid){      
      this.showrolselect = false;
      this.showrolname = true;
      return false;
    }
    let formData:FormData = new FormData();
    formData.append('idusuario', this.id);
    formData.append('rolid', this.rolid);
    this.http.post(this.storage.getapi()+"perfil/actualizarrol",formData).subscribe(data=>{     
      this.startToast('success',data['message']); 
      this.rol = data['rol'];
      this.oldrol = data['rol'];
      this.oldrolid = this.rolid;
      this.showrolselect = false;
      this.showrolname = true;
    },error=>{
      if(error['status'] == '401'){
        // this.router.navigate(['/auth/login']);
        this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
          this.storage.saveToken(data['access_token']); 
          this.CambiarRol();
        });
      }
      this.startToast('error',error['error']['message']);      
    });
  }

  CancelCambiarRol(){
    if(this.storage.getUser()['tipo'] == 'contador'){
      this.showrolselect = false;
      this.rolid = this.oldrolid;
      this.showrolname = true;
    }
  }

  openFileBrowser(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.querySelector("#fileUploadInputExample") as HTMLElement;
    element.click()
  }

  handleFileInput(event: any) {
    if (event.target.files.length) {
      
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); 
      this.foto = event.target.files[0];
      reader.onload = (_event) => { 
        let img = new Image();
        img.src = reader.result as string;
        this.fotoperfil = reader.result as string;
        
      }      
    }
    if(document.getElementById("fileUploadInputExample")['files'].length != undefined){
      if(document.getElementById("fileUploadInputExample")['files'].length){
        this.isUploaded = true;
      }
    }
  }
  checkdimension(e){
    if(e.currentTarget.src != this.storage.getappURL()+'/assets/images/fotoperfil.jpg'){
      /*if(e.currentTarget.width != 100 || e.currentTarget.height != 100){
        if(this.oldfoto == ''){
          this.fotoperfil = '../../../../assets/images/fotoperfil.jpg';
          this.foto = '';
          this.startToast('error','La resolución de la imagen de perfil debe de ser de 100 x 100 pixeles!');
          return false;
        }else{
          this.startToast('error','La resolución de la imagen de perfil debe de ser de 100 x 100 pixeles!');
          this.fotoperfil = this.oldfoto;
          this.foto = '';
          return false;
        }
      }else{*/
        
      //}
    }
  }

  GuardarFotoPerfil(){
    let formData:FormData = new FormData();
    formData.append('idusuario', this.id);
    formData.append('logo', this.foto);
    formData.append('tipo', this.tipo);
    if(this.tipo == 'cliente'){
      formData.append('rfc', this.rfc);
    }

  

    this.http.post(this.storage.getapi()+"perfil/fotoperfil",formData).subscribe(data=>{     
      this.startToast('success',data['message']); 
      this.isUploaded = false;
      if(this.tipo == 'cliente'){
        this.fotoperfil = this.storage.getappURL()+'/Sellos/'+this.rfc+'/perfil'+data['path'];
      }else{
        this.fotoperfil = this.storage.getappURL()+'/Sellos/'+this.id+'/perfil'+data['path'];
      }
      
    },error=>{
      if(error['status'] == '401'){
        // this.router.navigate(['/auth/login']);
        this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
          this.storage.saveToken(data['access_token']); 
          this.GuardarFotoPerfil();
        });
      }
      this.startToast('error',error['error']['message']);
      
    });
  }

  CancelarFotoPerfil(){
    this.fotoperfil = this.storage.getappURL()+'/assets/images/fotoperfil.jpg';
    this.isUploaded = false;
  }

  CambiarContrasenia(content) {
    this.modalService.open(content, {centered: true}).result.then((result) => {
      console.log("Modal closed" + result);
    }).catch((res) => {});
  }

  Cambiar(){
    this.contramodal.start('Cambiando Contraseña...');
    let formData:FormData = new FormData();
    formData.append('id', this.id);
    formData.append('password', this.password);
    formData.append('password_confirmation', this.cpassward);
    this.http.post(this.storage.getapi()+"perfil/cambiarcontra",formData).subscribe(data=>{     
      this.startToast('success','Se ha cambiado la contraseña correctamente!'); 
      this.contramodal.stop();
      this.modalService.dismissAll();
    },error=>{
      if(error['status'] == '401'){
        // this.router.navigate(['/auth/login']);
        this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
          this.storage.saveToken(data['access_token']); 
          this.Cambiar();
        });
      }
      this.startToast('error',error['error']['message']);    
      this.contramodal.stop();  
    });
  }

  CancelarSuscripcion(content){
    const Alrt = Swal.mixin({
      showConfirmButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:'Si',      
      cancelButtonText: 'No'      
    })
    
    Alrt.fire({
      icon: 'warning',
      title: 'Estás por cancelar tu suscripción a Garant Contable. Todos los servicios serán suspendidos hasta el último periodo contratado. ¿Deseas continuar?'
    }).then((result)=>{
      if(result.isConfirmed){
        this.modalService.open(content, {centered: true}).result.then((result) => {
          console.log("Modal closed" + result);
        }).catch((res) => {});
      }
      if(result.isDismissed){

      }
    });
  }


  CancelarSus(){
    this.susModal.start('Cancelando Suscripción...');
    let formData:FormData = new FormData();
    formData.append('id', this.id);
    formData.append('motivo', this.motivo);
    this.http.post(this.storage.getapi()+"perfil/cancelarsuscripcion",formData).subscribe(data=>{     
      this.startToast('success','¡Se ha cancelado tu suscripción correctamente!'); 
      this.motivo = '';
      this.susModal.stop();
      this.modalService.dismissAll();
    },error=>{
      if(error['status'] == '401'){
        // this.router.navigate(['/auth/login']);
        this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
          this.storage.saveToken(data['access_token']); 
          this.CancelarSus();
        });
      }
      this.startToast('error',error['error']['message']);    
      this.susModal.stop();  
    });
  }

  openFileBrowserFC(event: any) {
    if(this.rOnly){
      return;
    }
    event.preventDefault();
    let element: HTMLElement = document.querySelector("#fileUploadInputExampleFC") as HTMLElement;
    element.click()
  }

  handleFileInputFC(event: any) {
    if (event.target.files.length) {
      let element: HTMLElement = document.querySelector("#fileUploadInputExampleFC + .input-group .file-upload-info") as HTMLElement;
      let fileName = event.target.files[0].name;
      this.logoname = event.target.files[0].name;
      this.logo = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); 
      this.logo = event.target.files[0];
      reader.onload = (_event) => { 
        let img = new Image();
        img.src = reader.result as string;
        this.imglogo = reader.result as string;
        
      }  
    }
    
  }

  checkdimensionFC(e){
    if(e.currentTarget.width > 400 || e.currentTarget.height > 400){
      if(this.oldlogo != ''){
        this.logoname = this.oldlogoname; 
        this.logo = '';
        this.startToast('error','La resolución del logo no debe de ser a 400px!');
        return false;
      }
    }
  }
  
 //ACEPTAR FACTURACION PARA QUE APAREZCA//
 habilitarFacturacion(e){
  this.aceptarFacturacionButtons = true;
  console.log(e.currentTarget.checked);
  

  if(this.quienve != 'cliente'){
    this.timbresinput = false;
  }else{
      this.timbresinput = true;
    
  }
 
if(e.currentTarget.checked === true) { //SI EL CHECKED ES TRUE SALE ESTA CONFIRMACION
  const Alrt = Swal.mixin({
    showConfirmButton: true,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText:'Si',      
    cancelButtonText: 'No'      
  })
  
  Alrt.fire({
    icon: 'warning',
    title: "Estás activando el módulo de facturación ¿Deseas continuar?"
  }).then((result)=>{
    if(result.isConfirmed){    
      this.blockUI.start('Activando Facturacion...');
      this.facturacioncheck = true;
    }
    if(result.isDismissed){
      this.facturacioncheck = false;
      this.timbresinput = true;
      this.blockUI.stop();
      return;
    }
  });
} else { //SI EL CHECKED ES FALSE SALE ESTA CONFIRMACION
  const Alrt = Swal.mixin({
    showConfirmButton: true,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText:'Si',      
    cancelButtonText: 'No'      
  })
  Alrt.fire({
    icon: 'warning',
    title: "Estás desactivando el módulo de facturación ¿Deseas continuar?"
  }).then((result)=>{
    if(result.isConfirmed){    
      this.blockUI.start('Desactivando Facturacion...');
      this.facturacioncheck = false;
      this.timbresinput = true;
    }
    if(result.isDismissed){
      this.facturacioncheck = true;
      this.timbresinput = false;
      this.blockUI.stop();
      return;
    }
  });
 
}
  


}
  aceptarBotonFacturacion(){
    this.aceptarFacturacionButtons = false;
  }

  cancelarBotonFacturacion(){
    this.aceptarFacturacionButtons = false;
  }
//CAMBIAR DE VALOR TIMBRES
  clickTimbresFunction() {
   this.clickTimbres = true;
  }
  aceptarBotonTimbres(){
    this.clickTimbres = false;
    let data = {
      timbres: this.timbres,
      idusuario:this.id
    }
    this.http.post(this.storage.getapi()+"perfil/acttimbres",data).subscribe(data=>{
      this.startToast('info',"Haz actualizado el numero de Timbres");
    }) 

  
}
  cancelarBotonTimbres() {
    this.clickTimbres = false;
  }




//ACEPTAR NOMINAS PARA QUE APAREZCA//
  habilitarCampoNomina(e){
    this.aceptarNominasButtons = true
    if(this.quienve != 'cliente'){
       this.nominasinput = false;  
      }else{
        this.nominasinput = true;
      }
    
    
    if(e.currentTarget.checked === true) { //SI EL CHECKED ES TRUE SALE ESTA CONFIRMACION
      const Alrt = Swal.mixin({
        showConfirmButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:'Si',      
        cancelButtonText: 'No'      
      })
      
      Alrt.fire({
        icon: 'warning',
        title: "Estás activando el módulo de nominas ¿Deseas continuar?"
      }).then((result)=>{
        if(result.isConfirmed){    
          this.blockUI.start('Activando Nominas...');
          this.nominascheck = true;
        }
        if(result.isDismissed){
          this.nominascheck = false;
          this.nominasinput = true;
          this.blockUI.stop();
          return;
        }
      });
    } else { //SI EL CHECKED ES FALSE SALE ESTA CONFIRMACION
      const Alrt = Swal.mixin({
        showConfirmButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:'Si',      
        cancelButtonText: 'No'      
      })
      Alrt.fire({
        icon: 'warning',
        title: "Estás desactivando el módulo de nóminas ¿Deseas continuar?"
      }).then((result)=>{
        if(result.isConfirmed){    
          this.blockUI.start('Desactivando Nominas...');
          this.nominascheck = false;
          this.nominasinput = true;
        }
        if(result.isDismissed){
          this.nominascheck = true;
          this.nominasinput = false;
          this.blockUI.stop();
          return;
        }
      });
  }
}

  aceptarBotonNominas(){
    this.aceptarNominasButtons = false;
  }

  cancelarBotonNominas(){
    this.aceptarNominasButtons = false;
  }
//AGREGAR NOMINAS AL CLIENTE
clickNominasFunction() {
  this.clickNominas = true;
  
 }
 aceptarBotonNominasInput(){
   this.clickNominas = false;
   let data = {
    nominas: this.nominas,
    idusuario:this.id
  }
  this.http.post(this.storage.getapi()+"perfil/actnominas",data).subscribe(data=>{
    this.startToast('info',"Haz actualizado el numero de Nominas");
  }) 

 }
 cancelarBotonNominasInput() {
   this.clickNominas = false;
 }


 quitarModoPruebas(){
   let data = {
     idusuario: this.id
   }
 

  const Alrt = Swal.mixin({
    showConfirmButton: true,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText:'Si',      
    cancelButtonText: 'No'      
  })
  
  Alrt.fire({
    icon: 'warning',
    title: " Estas por desactivar el modo de prueba del servicio de facturación electrónica ¿Deseas continuar?"
  }).then((result)=>{
    if(result.isConfirmed){    
      this.blockUI.start('Quitando Modo de pruebas...');
      this.http.post(this.storage.getapi()+"perfil/quitarPP",data).subscribe(data=>{
        this.startToast('info',"Haz quitado el modo de pruebas");
      });
    }
    if(result.isDismissed){
     
      this.blockUI.stop();
      return;
    }
  });


 }
 

}