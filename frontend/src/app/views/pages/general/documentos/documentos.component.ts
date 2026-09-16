import { Component, OnInit,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../../../core/JWT/usuarios.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from 'src/app/core/JWT/token-storage.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { BlockUI, NgBlockUI,BlockUIService  } from 'ng-block-ui';
import { ColumnMode,SelectionType } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { isBuffer } from 'util';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss']
})
export class DocumentosComponent implements OnInit {
  @BlockUI('ejercicioblock') ejercicioblock: NgBlockUI;
  @BlockUI('periodoblock') periodoblock: NgBlockUI;  
  @BlockUI('contramodal') contramodal: NgBlockUI;  
  @BlockUI('listablock') listablock: NgBlockUI;
  @BlockUI('descargarblock') descargarblock: NgBlockUI;
  @BlockUI('docublock') docublock: NgBlockUI;  
  quienve: boolean = true;
  user: any;
  ejercicios: any = [];
  periodos: any = [];
  Documentos: any = [];
  Declaraciones: any = [];
  Relacionados: any = [];
  categorias: any = [];
  catsearchdec: any = [];
  catsearchdoc: any = [];
  ejercicioEnable: boolean = true;
  periodosEnable: boolean = true;
  selectedSearchPersonId: string = null;
  newfile: any;
  newfilename: any;
  selectedejercicio: any;
  selectedperiodo: any;
  selectedcat: any;
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  selected: any = [];
  selecteddec: any = [];
  Filtered: any = [];
  FilteredD: any = [];
  newEdC: boolean = false;  
  defaultNavActiveId: any = 1;
  buscarporcatdoc: any;
  buscarporcatdec: any;
  comentario: any;  
  estadodecuenta: boolean = false;
  vinculados: boolean = false;
  docsfiscales: boolean = false;
  otros: boolean = false;
  lineadecaptura: boolean = false;
  showTocontador: boolean = true;
  noespropuesta: boolean = false;
  columns: any = [{ name: 'Nombre' }, { name: 'Categoría' }, {name: 'Fecha'}, { name: 'Documento' }];
  columnsD: any = [{ name: 'Nombre' }, { name: 'Categoría' }, {name: 'Fecha'}, { name: 'Documento' }];
  columnsR: any = [{name: 'ID'},{ name: 'Nombre' }];
  poderguardar: boolean = true;
  activado: any = true;
  mensaje: any;
  mensaje2: any;
  mensaje3: any;
  @ViewChild(DatatableComponent, {static: false}) table: DatatableComponent;
  @ViewChild(DatatableComponent, {static: false}) tableD: DatatableComponent;
  @ViewChild(DatatableComponent, {static: false}) tablerelacionados: DatatableComponent;
  meses: any =[{'01':'Enero',
                '02':'Febrero',
                '03':'Marzo',
                '04':'Abril',
                '05':'Mayo',
                '06':'Junio',
                '07':'Julio',
                '08':'Agosto',
                '09':'Septiembre',
                '10':'Octubre',
                '11':'Noviembre',
                '12':'Diciembre'}];
  constructor(private calendar: NgbCalendar, private modalService: NgbModal,private blockUIService: BlockUIService, private datepipe: DatePipe,private storage: TokenStorageService,private http: HttpClient,private UService: UsuariosService, private router: Router, private route: ActivatedRoute) { 
    this.fetch(data => {
      this.periodos = data;
    });
    let year = this.calendar.getToday().year;
    for(let x=year;x>1990;x--){
      this.ejercicios.push({
        anio: x
      });
    }
  }

  ngOnInit(): void {

    this.user = this.storage.getUser();
    if(this.user['tipo'] == 'cliente'){
      
      this.categorias.push({label: 'Estado de cuenta'},{label: 'Vinculados a Nómina'},{label: 'Documentos Fiscales'},{label: 'Otros'});
      this.catsearchdec.push({label: 'Propuesta'},{label: 'Linea de captura'},{label: 'DIOT'},{label: 'Contabilidad Electrónica'},{label: 'Otros'});
      this.catsearchdoc.push({label: 'Estado de cuenta'},{label: 'Vinculados a Nómina'},{label: 'Documentos Fiscales'},{label: 'Otros'});
      this.quienve = false;
      this.selectedSearchPersonId = this.user['rfc'];
      this.showTocontador = false;
      this.listablock.start('Cargando documentos...');
      if(this.user['status'] == 0){
        this.activado = false;
        // this.mensaje = 'Tu suscripción limitado el servicio, contacta con el administrador de Garant Contable.';
        // this.mensaje2 = 'mailto:pagos@garantcontable.com?subject=Solicito de su ayuda para reestablecer mi servicio';
        this.defaultNavActiveId = 2;
      }
      this.http.get(this.storage.getapi()+'docs/obtsellos/'+this.selectedSearchPersonId).subscribe(data => {
        // if(data['result'] != null){            
          this.http.get(this.storage.getapi()+'docs/lista/'+this.selectedSearchPersonId).subscribe(data =>{
            this.Documentos = [];
            this.Filtered = [];
            this.Declaraciones = [];
            this.FilteredD = [];
            this.Relacionados = [];
            for(let x=0;x<data['result'].length;x++){
              this.Documentos.push({
                id: data['result'][x]['id'],
                nombre: data['result'][x]['nombre'],
                categoria: data['result'][x]['categoria'],
                subido: this.datepipe.transform(data['result'][x]['created_at'],'dd/MM/yyyy'),
                ejercicio: data['result'][x]['ejercicio'],
                periodo: this.meses[0][data['result'][x]['periodo']],
                puedequitar: false
              });
              this.Filtered.push({
                id: data['result'][x]['id'],
                nombre: data['result'][x]['nombre'],
                categoria: data['result'][x]['categoria'],
                subido: this.datepipe.transform(data['result'][x]['created_at'],'dd/MM/yyyy')
              });
            }
            for(let x=0;x<data['declaraciones'].length;x++){
              if(data['declaraciones'][x].aceptada == 0){
                this.Declaraciones.push({
                  id: data['declaraciones'][x].id,
                  nombre: data['declaraciones'][x].nombre,
                  subido: this.datepipe.transform(data['declaraciones'][x].created_at,'dd/MM/yyyy'),
                  categoria: data['declaraciones'][x].categoria,
                  aceptada: (data['declaraciones'][x].aceptada == 1 ? true : false),
                  aceptable: (this.user['tipo'] == 'cliente' ? true : false),
                  eslinea: (data['declaraciones'][x].categoria != 'Propuesta' ? false : true ),
                  text: (data['declaraciones'][x].aceptada == 1 ? 'Propuesta aceptada' : 'Aceptar propuesta'),
                  puedequitar: false
                });
                this.FilteredD.push({
                  id: data['declaraciones'][x].id,
                  nombre: data['declaraciones'][x].nombre,
                  subido: this.datepipe.transform(data['declaraciones'][x].created_at,'dd/MM/yyyy'),
                  categoria: data['declaraciones'][x].categoria
                });
              }
            }
            for(let x=0; x<data['docsrelacionadas'].length; x++){
              this.Relacionados.push({
                id: data['docsrelacionadas'][x].id,
                nombre: data['docsrelacionadas'][x].nombre
              });
            }
            this.listablock.stop();
          },error=>{
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
    }else{
      this.categorias.push({label: 'Propuesta'},{label: 'Linea de captura'},{label: 'DIOT'},{label: 'Contabilidad Electrónica'},{label: 'Otros'});
      this.catsearchdec.push({label: 'Propuesta'},{label: 'Linea de captura'},{label: 'DIOT'},{label: 'Contabilidad Electrónica'},{label: 'Otros'});
      this.catsearchdoc.push({label: 'Estado de cuenta'},{label: 'Vinculados a Nómina'},{label: 'Documentos Fiscales'},{label: 'Otros'});
      this.quienve = true;
      this.selectedSearchPersonId = this.storage.getUltimoCliente();
      if(this.selectedSearchPersonId != undefined){
        this.listablock.start('Cargando documentos...');
        this.http.get(this.storage.getapi()+'docs/obtsellos/'+this.selectedSearchPersonId).subscribe(data => {
            this.http.get(this.storage.getapi()+'docs/lista/'+this.selectedSearchPersonId).subscribe(data =>{
              this.Documentos = [];
              this.Filtered = [];
              this.Declaraciones = [];
              this.FilteredD = [];
              this.Relacionados = [];
              for(let x=0;x<data['result'].length;x++){
                this.Documentos.push({
                  id: data['result'][x]['id'],
                  nombre: data['result'][x]['nombre'],
                  categoria: data['result'][x]['categoria'],
                  subido: this.datepipe.transform(data['result'][x]['created_at'],'dd/MM/yyyy'),
                  ejercicio: data['result'][x]['ejercicio'],
                  periodo: this.meses[0][data['result'][x]['periodo']],
                  puedequitar: true
                });
                this.Filtered.push({
                  id: data['result'][x]['id'],
                  nombre: data['result'][x]['nombre'],
                  categoria: data['result'][x]['categoria'],
                  subido: this.datepipe.transform(data['result'][x]['created_at'],'dd/MM/yyyy')
                });
              }
              for(let x=0;x<data['declaraciones'].length;x++){
                this.Declaraciones.push({
                  id: data['declaraciones'][x].id,
                  nombre: data['declaraciones'][x].nombre,
                  subido: this.datepipe.transform(data['declaraciones'][x].created_at,'dd/MM/yyyy'),
                  categoria: data['declaraciones'][x].categoria,
                  aceptada: (data['declaraciones'][x].aceptada == 1 ? true : false),
                  eslinea: (data['declaraciones'][x].categoria != 'Propuesta' ? false : true ),
                  aceptable: (this.user['tipo'] == 'cliente' ? true : false),
                  text: (data['declaraciones'][x].aceptada == 1 ? 'Declaración aceptada' : 'Aceptar declaración'),
                  puedequitar: true
                });
                this.FilteredD.push({
                  id: data['declaraciones'][x].id,
                  nombre: data['declaraciones'][x].nombre,
                  subido: this.datepipe.transform(data['declaraciones'][x].created_at,'dd/MM/yyyy'),
                  categoria: data['declaraciones'][x].categoria,
                });
              }
              for(let x=0; x<data['docsrelacionadas'].length; x++){
                this.Relacionados.push({
                  id: data['docsrelacionadas'][x].id,
                  nombre: data['docsrelacionadas'][x].nombre
                });
              }
              this.listablock.stop();
            },error=>{
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

  downloadFile(filename: any){
    let formData:FormData = new FormData();
    formData.append('archivo', filename);
    // formData.append('id', this.id);
    formData.append('rfc', this.selectedSearchPersonId);
    this.descargarblock.start('Descargando documento...');
    this.http.post(this.storage.getapi()+"docs/descargararchivo",formData,{responseType:'arraybuffer'}).subscribe(data=>{      
      const blob = new Blob([data], {type: 'application/octet-stream'});
      saveAs(blob, filename);
      this.descargarblock.stop();
    },error=>{
      if(error['status'] == '401'){
        // this.router.navigate(['/auth/login']);
        this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
          this.storage.saveToken(data['access_token']); 
          this.downloadFile(filename);
        });
      }
      this.startToast('error',error['error']['message']);
    });
  }

  deleteFile(filename: any, id: any, index: any,tab: any){
    const Alrt = Swal.mixin({
      showConfirmButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:'Si',      
      cancelButtonText: 'No'      
    })
    
    Alrt.fire({
      icon: 'warning',
      title: '¿Deseas eliminar este archivo?'
    }).then((result)=>{
      if(result.isConfirmed){  
        let formData:FormData = new FormData();
        formData.append('archivo', filename);
        formData.append('id', id);
        formData.append('rfc', this.selectedSearchPersonId);
        formData.append('tab',tab);
        this.descargarblock.start('Eliminando documento...');
        this.http.post(this.storage.getapi()+"docs/eliminararchivo",formData,{responseType:'arraybuffer'}).subscribe(data=>{      
          this.startToast('success','¡Se ha eliminado el archivo correctamente!.');
          if(tab == 'dec'){
            this.Declaraciones.splice(index,1);
            this.Declaraciones = [...this.Declaraciones];
          }else{
            this.Documentos.splice(index,1);
            this.Documentos = [...this.Documentos];
          }
          this.descargarblock.stop();
        },error=>{
          if(error['status'] == '401'){
            // this.router.navigate(['/auth/login']);
            this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
              this.storage.saveToken(data['access_token']); 
              this.downloadFile(filename);
            });
          }
          this.startToast('error',error['error']['message']);
        });
      }
      if(result.isDismissed){

      }
    });
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
      this.newfilename = event.target.files[0].name;
      this.newfile = event.target.files[0];
      element.setAttribute( 'value', fileName);
    }
  }

  openFileBrowserD(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.querySelector("#fileUploadInputExampleD") as HTMLElement;
    element.click()
  }

  handleFileInputD(event: any) {
    if (event.target.files.length) {
      let element: HTMLElement = document.querySelector("#fileUploadInputExampleD + .input-group .file-upload-info") as HTMLElement;
      let fileName = event.target.files[0].name;
      this.newfilename = event.target.files[0].name;
      this.newfile = event.target.files[0];
      element.setAttribute( 'value', fileName);
    }
  }

  AgregarArchivo(content) {
    this.modalService.open(content, {centered: true}).result.then((result) => {
      console.log("Modal closed" + result);
    }).catch((res) => {});
  }

  AgregarDeclaracion(content) {
    this.modalService.open(content, {centered: true}).result.then((result) => {
      console.log("Modal closed" + result);
    }).catch((res) => {});
  }

  GuardarArchivo(){
    if(this.newfile == undefined){
      this.startToast('error','Favor de subir un archivo.');
      return false;
    }
    if(this.selectedcat == undefined){
      this.startToast('error','Favor de seleccionar una categoría.')
      return false;
    }
    if(this.selectedcat == 'Estado de cuenta'){
      if(this.selectedejercicio == undefined || this.selectedperiodo == undefined){
        this.startToast('error','Favor de seleccionar Ejercicio y Periodo antes de guardar.');
        return false;
      }
    }
    this.docublock.start('Guardando Archivo...');
    let formData:FormData = new FormData();
    formData.append('rfc', this.selectedSearchPersonId);
    formData.append('archivo', this.newfile);
    formData.append('filename', this.newfilename);
    formData.append('categoria',this.selectedcat);      
    formData.append('ejercicio',this.selectedejercicio);   
    formData.append('periodo',this.selectedperiodo); 
    this.http.post(this.storage.getapi()+"docs/nuevo",formData).subscribe(data=>{      
      this.startToast('success',data['message']);
      this.Documentos.push({
        id: data['result'].id,
        nombre: data['result'].nombre,
        subido: this.datepipe.transform(data['result'].created_at,'dd/MM/yyyy'),
        categoria: data['result'].categoria,
        ejercicio: data['result'].ejercicio,
        periodo: data['result'].periodo
      });
      this.Documentos = [...this.Documentos];
      this.Filtered.push({
        id: data['result'].id,
        nombre: data['result'].nombre,
        subido: this.datepipe.transform(data['result'].created_at,'dd/MM/yyyy'),
        categoria: data['result'].categoria
      });
      this.Filtered = [...this.Filtered];
      this.selectedcat = undefined;
      this.docublock.stop();
    },error=>{
      if(error['status'] == '401'){
        // this.router.navigate(['/auth/login']);
        this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
          this.storage.saveToken(data['access_token']); 
          this.GuardarArchivo();
        });
      }
      this.startToast('error',error['error']['message']);
    });
  }

  GuardarDeclaracion(){
    let propuestaselect = '';
    if(this.newfile == undefined){
      this.startToast('error','Favor de subir un archivo.');
      return false;
    }
    if(this.selectedcat == undefined){
      this.startToast('error','Favor de seleccionar una categoría.')
      return false;
    }
    if(this.selectedcat == 'Linea de captura'){      
      if(this.selecteddec.length == 0){
        this.startToast('error','Favor de seleccionar la propuesta para establecer la relación de la linea de captura.');
        return false;
      }
    }
    
    this.docublock.start('Subiendo documento...');
    let formData:FormData = new FormData();
    formData.append('rfc', this.selectedSearchPersonId);
    formData.append('archivo', this.newfile);
    formData.append('filename', this.newfilename);
    formData.append('categoria',this.selectedcat);
    if(this.selectedcat == 'Linea de captura'){
      formData.append('propuestaselec',this.selecteddec[0]['id']);
    }
    this.http.post(this.storage.getapi()+"docs/declaracion",formData).subscribe(data=>{      
      this.startToast('success',data['message']);
      this.selecteddec = [];
      this.selectedcat = undefined;
      this.Declaraciones.push({
        id: data['result'].id,
        nombre: data['result'].nombre,
        subido: this.datepipe.transform(data['result'].created_at,'dd/MM/yyyy'),
        comentario: data['result'].comentario,
        aceptada: (data['result'].aceptada == 1 ? true : false),
        aceptable: (data['result'].aceptada == 1 ? true : false)
      });
      
      this.Declaraciones = [...this.Declaraciones];
      this.FilteredD.push({
        id: data['result'].id,
        nombre: data['result'].nombre,
        subido: this.datepipe.transform(data['result'].created_at,'dd/MM/yyyy'),
        comentario: data['result'].categoria
      });
      this.FilteredD = [...this.FilteredD];
      this.docublock.stop();
    },error=>{
      if(error['status'] == '401'){
        // this.router.navigate(['/auth/login']);
        this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
          this.storage.saveToken(data['access_token']); 
          this.GuardarDeclaracion();
        });
      }
      this.startToast('error',error['error']['message']);
    });
  }

  buscarporcategoriadocumentos(){
    let value = this.buscarporcatdoc;
    const temp = this.Filtered.filter(function (d) {
      return d.categoria.indexOf(value) !== -1 || !value;
    });

    // update the rows
    this.Documentos = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  buscarporcategoriadeclaraciones(){
    let value = this.buscarporcatdec;
    const temp = this.FilteredD.filter(function (d) {
      return d.categoria.indexOf(value) !== -1 || !value;
    });

    // update the rows
    this.Declaraciones = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  BuscarPorNombre(e,pestania){
    let value: any = e.currentTarget.value;
    
    if(pestania == 'doc'){
      const temp = this.Filtered.filter(function (d) {
        return d.nombre.toLowerCase().indexOf(value) !== -1 || !value;      
      });
          // update the rows
      this.Documentos = temp;
      // Whenever the filter changes, always go back to the first page
      this.table.offset = 0;
    }else{
      const temp = this.FilteredD.filter(function (d) {
        return d.nombre.toLowerCase().indexOf(value) !== -1 || !value;      
      });
          // update the rows
      this.Declaraciones = temp;
      // Whenever the filter changes, always go back to the first page
      this.table.offset = 0;
    }
  }

  AceptarDeclaracion(e,row){
    if(row.aceptada){
      row.aceptada = true;
      return false;
    }
    if(e.currentTarget.checked){
      const Alrt = Swal.mixin({
        showConfirmButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:'Si',      
        cancelButtonText: 'No'      
      })
      
      Alrt.fire({
        icon: 'warning',
        title: '¿Aceptas la declaración de impuestos? (No podrás cancelar este proceso)'
      }).then((result)=>{
        if(result.isConfirmed){  
          this.periodoblock.start('Aceptando Declaracion...');
          let formData:FormData = new FormData();
          formData.append('id', row.id);
          this.http.post(this.storage.getapi()+"docs/aceptardeclaracion",formData).subscribe(data=>{      
            this.startToast('success','Declaración Aceptada');
            row.aceptada = true;      
            row.text = 'Declaración aceptada';      
            this.periodoblock.stop();
          },error=>{
            if(error['status'] == '401'){
              // this.router.navigate(['/auth/login']);
              this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
                this.storage.saveToken(data['access_token']); 
                let formData:FormData = new FormData();
                formData.append('id', row.id);
                this.http.post(this.storage.getapi()+"docs/aceptardeclaracion",formData).subscribe(data=>{      
                  this.startToast('success','Declaración Aceptada');
                  row.aceptada = true;      
                  row.text = 'Declaración aceptada';      
                  this.periodoblock.stop();
                },error=>{                  
                  this.startToast('error',error['error']['message']);
                });
              });
            }
            this.startToast('error',error['error']['message']);
          });  
        }
        if(result.isDismissed){
          row.aceptada = false;
        }
      });
    }
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/periodos.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }
  
  changecategorias(){
    switch(this.selectedcat){
      case 'Estado de cuenta':{
        this.estadodecuenta = true;
        this.vinculados = false;
        this.docsfiscales = false;
        this.otros = false;
        this.poderguardar = true;     
        break;
      }
      case 'Vinculados a Nómina':{
        this.estadodecuenta = false;
        this.vinculados = true;
        this.docsfiscales = false;
        this.otros = false;
        this.poderguardar = true;
        break;
      }
      case 'Documentos Fiscales':{
        this.estadodecuenta = false;
        this.vinculados = false;
        this.docsfiscales = true;
        this.otros = false;
        this.poderguardar = true;
        break;
      }
      case 'Otros':{
        this.estadodecuenta = false;
        this.vinculados = false;
        this.docsfiscales = false;
        this.otros = true;
        this.poderguardar = true;
        break;
      }
      case 'Linea de captura':{
        this.lineadecaptura = true;
        this.poderguardar = true;
        break;
      }
      default: { 
        this.estadodecuenta = false;
        this.vinculados = false;
        this.docsfiscales = false;
        this.otros = false;
        this.lineadecaptura = false;
        break; 
     }
    }
  }

  HabilitarGuardar(){
    if(this.selectedejercicio != undefined && this.selectedperiodo != undefined){
      this.poderguardar = true;
    }
  }

  singleSelectCheck = (row:any) => {
    return this.selecteddec.indexOf(row) === -1;
  }

}
