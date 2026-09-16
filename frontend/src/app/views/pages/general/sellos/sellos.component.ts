import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute,RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import { TokenStorageService } from '../../../../core/JWT/token-storage.service';
import { UsuariosService } from '../../../../core/JWT/usuarios.service';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { saveAs } from 'file-saver';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-sellos',
  templateUrl: './sellos.component.html',
  styleUrls: ['./sellos.component.scss']
})
export class SellosComponent implements OnInit {
  @BlockUI("block-item") blockUI;
  id: any;
  iduser: any;
  user: any;
  nombres: any;
  oldnombres: any;
  apellidos: any;
  registro: any;
  correo: any;
  usuario: any;
  plan: any;
  passciec: any;
  passfiel: any;
  passcsd: any;
  fielkey: any;
  fielcer: any;
  csdkey: any;
  csdcer: any;
  rOnly: boolean = true;
  rOnlyF: boolean = true;
  rOnlyCSD: boolean = true;
  editciec: boolean = true;
  editfiel: boolean = true;
  editcsd: boolean = true;
  saveciec: boolean = false;
  savefiel: boolean = false;
  savecsd: boolean = false;
  rfc: any;
  isDownloadbleFK: boolean = false;
  isDownloadbleFC: boolean = false;
  isDownloadbleCK: boolean = false;
  isDownloadbleCC: boolean = false;
  tieneRFC: any = false;
  tieneRFC2: any = true;
  fotoperfil: any = '../../../../../assets/images/fotoperfil.jpg';
  cover: any;  
  constructor(private datepipe: DatePipe,private storage: TokenStorageService,private http: HttpClient,private UService: UsuariosService, private router: Router, private route: ActivatedRoute) { 
  
  }

  ngOnInit(): void {
    
    this.iduser = this.route.snapshot.paramMap.get('id');
    // let myBlockUI = blockUI.instances.get('myBlockUI');
    this.http.get(this.storage.getapi()+'perfil/'+this.iduser).subscribe(data => {
      this.nombres = data['user']['nombres'];
      this.apellidos = data['user']['apellidos'];
      this.correo = data['user']['email'];
      this.usuario = data['user']['email'];
      this.rfc = data['user']['rfc'];
      if(data['user']['rfc'] == null){        
        this.blockUI.start('Antes de guardar los sellos, debe de capturar su RFC en la pestaña de "Generales".'); // Start blocking
        this.tieneRFC = true;
        this.editciec = false;
        this.editfiel = false;
        this.editcsd = false;
      }
      this.registro = this.datepipe.transform(data['user']['created_at'], 'dd/MM/yyyy HH:mm:ss');
      this.plan = data['user']['planname'];
      
      if(data['user']['tipo'] == 'cliente'){
        this.cover = 'fondoperfil';
        if(data['user']['perfil'] != null){
            this.fotoperfil = this.storage.getappURL()+"/Sellos/"+this.rfc+"/perfil/"+data['user']['perfil'];
        }else{
          this.fotoperfil = '../../../../assets/images/fotoperfil.jpg';
          this.cover = 'fondoperfil';
        }        
      }else{
        this.cover = 'fondointerno';
        if(data['user']['perfil'] != null){
            this.fotoperfil = this.storage.getappURL()+"/Sellos/"+this.id+"/perfil/"+data['user']['perfil'];
        }else{
          this.fotoperfil = '../../../../assets/images/fotoperfil.jpg';
          this.cover = 'fondoperfil';
        }  
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

    this.http.get(this.storage.getapi()+'perfil/obt/'+this.iduser).subscribe(data => {
      this.id = data['id'];
      this.passciec = data['passciec'];
      this.passfiel = data['passfiel'];
      this.passcsd = data['passcsd'];
      this.fielkey = data['fielkey'];
      if(data['fielkey'] != null){
        this.isDownloadbleFK = !this.isDownloadbleFK;
      }
      this.fielcer = data['fielcer'];
      if(data['fielcer'] != null){
        this.isDownloadbleFC = !this.isDownloadbleFC;
      }
      this.csdkey = data['csdkey'];
      if(data['csdkey'] != null){
        this.isDownloadbleCK = !this.isDownloadbleCK;
      }
      this.csdcer = data['csdcer'];
      if(data['csdcer'] != null){
        this.isDownloadbleCC = !this.isDownloadbleCC;
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
  editarciec(){
    this.editciec = !this.editciec;
    this.saveciec = !this.saveciec;
    this.rOnly = !this.rOnly;
  }
  GuardarC(){
    let formData:FormData = new FormData();
    formData.append('idusuario', this.iduser);
    formData.append('passciec', this.passciec);

    this.http.post(this.storage.getapi()+"perfil/insert/ciec",formData).subscribe(data=>{
      
      this.editciec = !this.editciec;
      this.saveciec = !this.saveciec;
      this.rOnly = !this.rOnly;

    },error=>{
      if(error['status'] == '401'){
        // this.router.navigate(['/auth/login']);
        this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
          this.storage.saveToken(data['access_token']); 
          this.GuardarC();
        });
      }
    });
    
  }
  CancelarC(){
    this.editciec = !this.editciec;
    this.saveciec = !this.saveciec;
    this.rOnly = !this.rOnly;
    this.passciec = '';
  }
  editarfiel(){
    this.editfiel = !this.editfiel;
    this.savefiel = !this.savefiel;
    this.rOnlyF = !this.rOnlyF;
  }
  GuardarF(){
    let formData:FormData = new FormData();
    formData.append('idusuario', this.iduser);
    formData.append('passfiel', this.passfiel);
    formData.append('fielkey', this.fielkey);
    formData.append('fielcer', this.fielkey);
    this.http.post(this.storage.getapi()+"perfil/insert/fiel",formData).subscribe(data=>{     
      this.startToast('success',data['message']); 
      this.editfiel = !this.editfiel;
      this.savefiel = !this.savefiel;
      this.rOnlyF = !this.rOnlyF;
    },error=>{
      if(error['status'] == '401'){
        // this.router.navigate(['/auth/login']);
        this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
          this.storage.saveToken(data['access_token']); 
          this.GuardarF();
        });
      }
      this.startToast('error',error['error']['message']);
    });
    
  }
  CancelarF(){
    this.editfiel = !this.editfiel;
    this.savefiel = !this.savefiel;
    this.rOnlyF = !this.rOnlyF;
    this.passfiel = '';
  }
  editarcsd(){
    this.editcsd = !this.editcsd;
    this.savecsd = !this.savecsd;
    this.rOnlyCSD = !this.rOnlyCSD;
  }
  GuardarCSD(){
    let formData:FormData = new FormData();
    formData.append('idusuario', this.iduser);
    formData.append('passcsd', this.passcsd);
    formData.append('csdkey', this.csdkey);
    formData.append('csdcer', this.csdcer);
    this.http.post(this.storage.getapi()+"perfil/insert/csd",formData).subscribe(data=>{      
      this.startToast('success',data['message']);
      this.editcsd = !this.editcsd;
      this.savecsd = !this.savecsd;
      this.rOnlyCSD = !this.rOnlyCSD;
    },error=>{
      if(error['status'] == '401'){
        // this.router.navigate(['/auth/login']);
        this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
          this.storage.saveToken(data['access_token']); 
          this.GuardarCSD();
        });
      }
      this.startToast('error',error['error']['message']);
    });

  }

  CancelarCSD(){
    this.editcsd = !this.editcsd;
    this.savecsd = !this.savecsd;
    this.rOnlyCSD = !this.rOnlyCSD;
    this.passcsd = '';
  }

  readFileFK(event) {
    this.fielkey = event.target.result;
  }

  openFileBrowserFK(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.querySelector("#fileUploadInputExampleFK") as HTMLElement;
    element.click()
  }

  handleFileInputFK(event: any) {
    if (event.target.files.length) {
      let element: HTMLElement = document.querySelector("#fileUploadInputExampleFK + .input-group .file-upload-info") as HTMLElement;
      let fileName = event.target.files[0].name;
      this.fielkey = event.target.files[0];
      element.setAttribute( 'value', fileName);
      // let reader = new FileReader();      
      // reader.addEventListener('load', this.readFileFK);
      // reader.readAsDataURL(event.target.files[0]);
    }
  }

  readFileFC(event) {
    this.fielkey = event.target.result;
  }

  openFileBrowserFC(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.querySelector("#fileUploadInputExampleFC") as HTMLElement;
    element.click()
  }

  handleFileInputFC(event: any) {
    if (event.target.files.length) {
      let element: HTMLElement = document.querySelector("#fileUploadInputExampleFC + .input-group .file-upload-info") as HTMLElement;
      let fileName = event.target.files[0].name;
      this.fielcer = event.target.files[0];
      element.setAttribute( 'value', fileName);
      // let reader = new FileReader();
      // reader.addEventListener('load', this.readFileFC);
      // reader.readAsDataURL(event.target.files[0]);
    }
  }

  readFileCSDK(event) {
    this.fielkey = event.target.result;
  }

  openFileBrowserCSDK(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.querySelector("#fileUploadInputExampleCSDK") as HTMLElement;
    element.click()
  }

  handleFileInputCSDK(event: any) {
    if (event.target.files.length) {
      let element: HTMLElement = document.querySelector("#fileUploadInputExampleCSDK + .input-group .file-upload-info") as HTMLElement;
      let fileName = event.target.files[0].name;
      this.csdkey = event.target.files[0];
      element.setAttribute( 'value', fileName);      
      // let reader = new FileReader();
      // reader.addEventListener('load', this.readFileCSDK);
      // reader.readAsDataURL(event.target.files[0]);
    }
  }

  readFileCSDC(event) {
    this.fielkey = event.target.result;
  }

  openFileBrowserCSDC(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.querySelector("#fileUploadInputExampleCSDC") as HTMLElement;
    element.click();
  }

  handleFileInputCSDC(event: any) {
    if (event.target.files.length) {
      let element: HTMLElement = document.querySelector("#fileUploadInputExampleCSDC + .input-group .file-upload-info") as HTMLElement;
      let fileName = event.target.files[0].name;
      this.csdcer = event.target.files[0];
      element.setAttribute( 'value', fileName);      
      // let reader = new FileReader();
      // reader.addEventListener('load', this.readFileCSDC);
      // reader.readAsDataURL(event.target.files[0]);
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

  downloadFile(wFile: any,filename: any){
    let formData:FormData = new FormData();
    formData.append('archivo', wFile);
    formData.append('id', this.id);
    formData.append('rfc', this.rfc);
    this.http.post(this.storage.getapi()+"perfil/descargararchivo",formData,{responseType:'arraybuffer'}).subscribe(data=>{      
      const blob = new Blob([data], {type: 'application/octet-stream'});
      saveAs(blob, filename);
    },error=>{
      if(error['status'] == '401'){
        // this.router.navigate(['/auth/login']);
        this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
          this.storage.saveToken(data['access_token']); 
          this.downloadFile(wFile,filename);
        });
      }
      this.startToast('error',error['error']['message']);
    });
  }

}
