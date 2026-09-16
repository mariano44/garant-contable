declare var require: any;
import { Component, OnInit, ViewChild,LOCALE_ID  } from '@angular/core';
import { DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../../../core/JWT/usuarios.service';
import { TokenStorageService } from 'src/app/core/JWT/token-storage.service';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { DecimalPipe,formatNumber } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-upcfdis',
  templateUrl: './upcfdis.component.html',
  styleUrls: ['./upcfdis.component.scss']
})
export class UpcfdisComponent implements OnInit {
  user: any;
  Emitidas: any = [];
  Recibidas: any = [];
  Nomina: any = [];
  clientes: any = [];
  Rubros: any = [];
  ejercicios: any = [];
  periodos: any = [];
  xmlfallidos: any = [];
  loadingIndicator = true;
  showprogressbar: boolean = false;
  progreso: any;
  showerrortab: boolean = false;
  cuantosxmls: any = 0;
  totalxmls: any = 0;
  processedxmls: any = 0;
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
  NuevoPeriodo: any = [{id:'01',label:'Enero',disabled: false},
                        {id:'02',label:'Febrero',disabled: false},
                        {id:'03',label:'Marzo',disabled: false},
                        {id:'04',label:'Abril',disabled: false},
                        {id:'05',label:'Mayo',disabled: false},
                        {id:'06',label:'Junio',disabled: false},
                        {id:'07',label:'Julio',disabled: false},
                        {id:'08',label:'Agosto',disabled: false},
                        {id:'09',label:'Septiembre',disabled: false},
                        {id:'10',label:'Octubre',disabled: false},
                        {id:'11',label:'Noviembre',disabled: false},
                        {id:'12',label:'Diciembre',disabled: false}];
  filtered: any = [];
  ejercicioEnable: boolean = false;
  periodosEnable: boolean = false;
  periodosEnableCreate: boolean = true;
  selectedSearchPersonId: string = null;
  saveButton: boolean = false;
  selectedejercicio: any;
  selectedperiodo: any;
  nuevoejercicio: any;
  nuevoperiodo: any;  
  ejercicioabierto: boolean = false;
  tipo: any = [{"I":'Ingreso',"E":'Egreso',"N":"Nómina","P":"Pago"}];
  DropzoneDisabled: boolean = true;
  public config: DropzoneConfigInterface = {
    clickable: true,
    autoReset: null,
    errorReset: null,
    cancelReset: null
  };
  defaultNavActiveId: any = 1;
  @ViewChild(DropzoneDirective, { static: false }) directiveRef?: DropzoneDirective;
  showEmitidas: boolean = false;
  showRecibidas: boolean = false;
  showNomina: boolean = false;
  constructor(private modalService: NgbModal,private http: HttpClient,private datepipe: DatePipe,private storage: TokenStorageService,private UService: UsuariosService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.user = this.storage.getUser();
    this.selectedSearchPersonId = this.storage.getUltimoCliente();
    if(this.selectedSearchPersonId != undefined){
      this.http.get(this.storage.getapi()+'config/getEjercicioAbierto/'+this.selectedSearchPersonId).subscribe(data =>{
        if(data['result'] != ''){
          this.ejercicioabierto = true;
          this.startToast('info','Ya se encuentra un periodo abierto. Termina este periodo para poder abrir otro.');
          this.selectedejercicio = data['result']['ejercicio'];
          this.selectedperiodo = data['result']['periodo'];
          this.http.get(this.storage.getapi()+'config/getEjercicios/'+this.selectedSearchPersonId).subscribe(data =>{
            this.ejercicios = [];
            this.ejercicioEnable = false;
            for(let x=0;x<data['result'].length;x++){
              this.ejercicios.push({
                anio: data['result'][x]['anio']
              });
            }
            this.changeEjercicio();
            this.changePeriodos();
          },error=>{
            if(error['status'] == '401'){
              // this.router.navigate(['/auth/login']);
              this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
                this.storage.saveToken(data['access_token']); 
                this.ngOnInit();
              });
            }
          });     
        }else{
          this.ejercicioabierto = false;
          this.http.get(this.storage.getapi()+'config/getEjercicios/'+this.selectedSearchPersonId).subscribe(data =>{
            this.ejercicios = [];
            this.ejercicioEnable = false;
            for(let x=0;x<data['result'].length;x++){
              this.ejercicios.push({
                anio: data['result'][x]['anio']
              });
            }
          },error=>{
            if(error['status'] == '401'){
              // this.router.navigate(['/auth/login']);
              this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
                this.storage.saveToken(data['access_token']); 
                this.ngOnInit();
              });
            }
          });     
        }
      },error=>{
        if(error['status'] == '401'){
          // this.router.navigate(['/auth/login']);
          this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
            this.storage.saveToken(data['access_token']); 
            this.ngOnInit();
          });
        }
      });      
      
    }
    // this.http.get(this.storage.getapi()+'auth/users/cliente/1').subscribe(data =>{
    //   this.clientes = [];
    //   for(let x=0;x<data['result'].length;x++){
    //     this.clientes.push({
    //       name: data['result'][x]['rfc']+' - '+(data['result'][x]['regimen'] == 'Persona Moral' ? data['result'][x]['razonsocial'] : data['result'][x]['nombres']+" "+data['result'][x]['apellidos']),
    //       rfc: data['result'][x]['rfc']
    //     });
    //   }
    // },error=>{
    //   if(error['status'] == '401'){
    //     this.router.navigate(['/auth/login']);
    //   }
    // });
    // this.http.get(this.storage.getapi()+'config/getRubros').subscribe(data =>{
    //   this.Rubros = [];
    //   for(let x=0;x<data['result'].length;x++){
    //     this.Rubros.push({
    //       id: data['result'][x]['id'],
    //       name: data['result'][x]['nombre']
    //     });
    //   }
    // },error=>{
    //   if(error['status'] == '401'){
    //     this.router.navigate(['/auth/login']);
    //   }
    // });
  }

  onUploadError(event: any): void {
    console.log('onUploadError:', event);
  }

  onUploadSuccess(event: any): void {
    this.totalxmls = this.directiveRef.dropzone().files.length;
    this.processedxmls = this.processedxmls+1;
    console.log('onUploadSuccess:', event);
    let parseString = require('xml2js').parseString;
    let activeXML = '';
    parseString(event[1]["files"]["file"], function (err, result) {
      console.dir(result);
      activeXML = result;
    });
    if(!activeXML.hasOwnProperty('cfdi:Comprobante')){
      this.startToast('warning','El archivo XML no corresponde a un CFDI.');
      this.showerrortab = true;
      this.xmlfallidos.push({
        tipo: '',
        uuid: event[0]['name'],
        error: 'El archivo XML no corresponde a un CFDI.'
      });
      return;
    }

    if(!activeXML["cfdi:Comprobante"].hasOwnProperty("cfdi:Complemento")){
      this.startToast('warning','El archivo XML no contiene un Timbre Fiscal');
      this.showerrortab = true;
      this.xmlfallidos.push({
        tipo: this.tipo[0][activeXML["cfdi:Comprobante"]["$"]['TipoDeComprobante']],
        uuid: event[0]['name'],
        error: 'El archivo XML no contiene un Timbre Fiscal.'
      });
      return;
    }
    if(this.selectedSearchPersonId != activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]['Rfc']
    && this.selectedSearchPersonId != activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]['Rfc']){
      this.startToast('warning','El Rfc de las facturas subidas, no corresponde al del cliente seleccionado');
      this.showerrortab = true;
      this.xmlfallidos.push({
        tipo: this.tipo[0][activeXML["cfdi:Comprobante"]["$"]['TipoDeComprobante']],
        uuid: event[0]['name'],
        error: 'El Rfc de las facturas subidas, no corresponde al del cliente seleccionado.'
      });
      return;
    }

    if(this.selectedejercicio != this.datepipe.transform(activeXML["cfdi:Comprobante"]["$"]["Fecha"], 'yyyy')){
      this.startToast('warning','El año del CFDI, no corresponde al de este ejercicio.');
      this.showerrortab = true;
      this.xmlfallidos.push({
        tipo: this.tipo[0][activeXML["cfdi:Comprobante"]["$"]['TipoDeComprobante']],
        uuid: event[0]['name'],
        error: 'El año del CFDI, no corresponde al de este ejercicio.'
      });
      return;
    }

    if(this.selectedperiodo != this.datepipe.transform(activeXML["cfdi:Comprobante"]["$"]["Fecha"], 'MM')){
      this.startToast('warning','La fecha del CFDI, no corresponde al de este periodo.');
      this.showerrortab = true;
      this.xmlfallidos.push({
        tipo: this.tipo[0][activeXML["cfdi:Comprobante"]["$"]['TipoDeComprobante']],
        uuid: event[0]['name'],
        error: 'La fecha del CFDI, no corresponde al de este periodo.'
      });
      return;
    }
    this.showprogressbar = true;
    this.cuantosxmls = this.cuantosxmls + 1;
    this.progreso = (this.cuantosxmls*100)/this.directiveRef.dropzone().files.length;
    this.progreso = parseInt(this.progreso);
    if(this.selectedSearchPersonId == activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]['Rfc']){
      this.showEmitidas = true;
      if(activeXML["cfdi:Comprobante"]["$"]['TipoDeComprobante'] == 'I'){
        let frmDt:FormData = new FormData();
        frmDt.append('re', activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]['Rfc'].trim());
        frmDt.append('rr', activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]['Rfc'].trim());
        frmDt.append('tt', activeXML["cfdi:Comprobante"]["$"]["Total"].replace(",",""));
        frmDt.append('uuid',activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]['tfd:TimbreFiscalDigital'][0]["$"]['UUID']);      
        // let data2 ='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\r\n <soapenv:Header/>\r\n <soapenv:Body>\r\n <tem:Consulta>\r\n <tem:expresionImpresa><![CDATA[?re='+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]['Rfc'].trim()+'&rr='+activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]['Rfc'].trim()+'&tt='+activeXML["cfdi:Comprobante"]["$"]["Total"].replace(",","")+'&id='+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]['tfd:TimbreFiscalDigital'][0]["$"]['UUID']+']]></tem:expresionImpresa>\r\n </tem:Consulta>\r\n </soapenv:Body>\r\n </soapenv:Envelope>';
        // const httpOptions = {
        //   headers: new HttpHeaders({
        //     'Content-Type': 'text/xml;charset="utf-8"',
        //     'SOAPAction': 'http://tempuri.org/IConsultaCFDIService/Consulta',
        //     "Access-Control-Allow-Credentials": "true",
        //     "Access-Control-Expose-Headers": "*",
        //     "Access-Control-Allow-Headers": '*',
        //     "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD, OPTIONS, PATCH, PROPFIND, PROPPATCH, MKCOL, COPY, MOVE, LOCK",
        //     'Access-Control-Allow-Origin': this.storage.geturl(),
        //     "Content-Encoding": "gzip"
        //   }), responseType: 'text' as 'text'
        // };
        // this.http.post("https://consultaqr.facturaelectronica.sat.gob.mx/ConsultaCFDIService.svc?wsdl",data2,httpOptions).subscribe(data => {
          this.http.post(this.storage.getapi()+"config/revisarCFDI",frmDt).subscribe(data =>{
          let getEstatus: any;            
          getEstatus = data['message']['Estado'];
          let emi = [];
          emi.push({
            ejercicio: this.selectedejercicio,
            periodo: this.selectedperiodo,
            uuid: activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]['tfd:TimbreFiscalDigital'][0]["$"]['UUID'],
            tipo: this.tipo[0][activeXML["cfdi:Comprobante"]["$"]['TipoDeComprobante']],
            documento: (activeXML["cfdi:Comprobante"]["$"]['Serie'] == undefined ? '' : activeXML["cfdi:Comprobante"]["$"]['Serie']+" - ")+(activeXML["cfdi:Comprobante"]["$"]['Folio'] == undefined ? '' : activeXML["cfdi:Comprobante"]["$"]['Folio']),
            receptor: activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]['Nombre'].trim(),
            rfc: activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]['Rfc'].trim(),
            total: formatNumber(activeXML["cfdi:Comprobante"]["$"]["Total"],"en_US",'1.2'),
            siniva: formatNumber((activeXML["cfdi:Comprobante"]["$"]["Total"]/1.16),"en_US",'1.2'),
            fecha: this.datepipe.transform(activeXML["cfdi:Comprobante"]["$"]["Fecha"], 'dd/MM/yyyy HH:mm:ss'),
            estado: getEstatus,
            rubro: '',
            file: event[1]["files"]["file"],
            filename: event[0]['name'],
            id: ''
          });
          let formData:FormData = new FormData();
          formData.append('xmls', JSON.stringify(emi[0]));
          formData.append('ejercicio', this.selectedejercicio);
          formData.append('periodo', this.selectedperiodo);
          formData.append('idusuario', this.user['id']);
          formData.append('rfc',this.selectedSearchPersonId);
          this.http.post(this.storage.getapi()+'config/insertXMLEmitidos',formData).subscribe(data =>{
            this.Emitidas.push({
              ejercicio: this.selectedejercicio,
              periodo: this.selectedperiodo,
              uuid: activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]['tfd:TimbreFiscalDigital'][0]["$"]['UUID'],
              tipo: this.tipo[0][activeXML["cfdi:Comprobante"]["$"]['TipoDeComprobante']],
              documento: (activeXML["cfdi:Comprobante"]["$"]['Serie'] == undefined ? '' : activeXML["cfdi:Comprobante"]["$"]['Serie']+" - ")+(activeXML["cfdi:Comprobante"]["$"]['Folio'] == undefined ? '' : activeXML["cfdi:Comprobante"]["$"]['Folio']),
              receptor: activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]['Nombre'].trim(),
              rfc: activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]['Rfc'].trim(),
              total: formatNumber(activeXML["cfdi:Comprobante"]["$"]["Total"],"en_US",'1.2'),
              siniva: formatNumber((activeXML["cfdi:Comprobante"]["$"]["Total"]/1.16),"en_US",'1.2'),
              fecha: this.datepipe.transform(activeXML["cfdi:Comprobante"]["$"]["Fecha"], 'dd/MM/yyyy HH:mm:ss'),
              estado: getEstatus,
              rubro: '',
              file: event[1]["files"]["file"],
              filename: event[0]['name'],
              id: data['cfdi']
            });
            // this.Emitidas[this.Emitidas.length-1]['id'] = data['cfdi']
          },error=>{
            this.showerrortab = true;
            this.xmlfallidos.push({
              tipo: this.tipo[0][activeXML["cfdi:Comprobante"]["$"]['TipoDeComprobante']],
              uuid: event[0]['name'],
              error: error['error']['message']
            });
            this.startToast('warning',JSON.parse(error['error']['message']));
            if(error['status'] == '401'){
              // this.router.navigate(['/auth/login']);
              this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
                this.storage.saveToken(data['access_token']); 
                this.onUploadSuccess(event);
              });
            }
          });
        }, error => {          
          this.startToast('warning',error['message']);    
          if(error['status'] == '401'){
            // this.router.navigate(['/auth/login']);
            this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
              this.storage.saveToken(data['access_token']); 
              this.onUploadSuccess(event);
            });
          }      
        });
      }
      if(activeXML["cfdi:Comprobante"]["$"]['TipoDeComprobante'] == 'N'){        
        let frmDt:FormData = new FormData();
        frmDt.append('re', activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]['Rfc'].trim());
        frmDt.append('rr', activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]['Rfc'].trim());
        frmDt.append('tt', activeXML["cfdi:Comprobante"]["$"]["Total"].replace(",",""));
        frmDt.append('uuid',activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]['tfd:TimbreFiscalDigital'][0]["$"]['UUID']);      
        // let data2 ='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\r\n <soapenv:Header/>\r\n <soapenv:Body>\r\n <tem:Consulta>\r\n <tem:expresionImpresa><![CDATA[?re='+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]['Rfc'].trim()+'&rr='+activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]['Rfc'].trim()+'&tt='+activeXML["cfdi:Comprobante"]["$"]["Total"].replace(",","")+'&id='+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]['tfd:TimbreFiscalDigital'][0]["$"]['UUID']+']]></tem:expresionImpresa>\r\n </tem:Consulta>\r\n </soapenv:Body>\r\n </soapenv:Envelope>';
        // const httpOptions = {
        //   headers: new HttpHeaders({
        //     'Content-Type': 'text/xml;charset="utf-8"',
        //     'SOAPAction': 'http://tempuri.org/IConsultaCFDIService/Consulta',
        //     "Access-Control-Allow-Credentials": "true",
        //     "Access-Control-Expose-Headers": "*",
        //     "Access-Control-Allow-Headers": '*',
        //     "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD, OPTIONS, PATCH, PROPFIND, PROPPATCH, MKCOL, COPY, MOVE, LOCK",
        //     'Access-Control-Allow-Origin': this.storage.geturl(),
        //     "Content-Encoding": "gzip"
        //   }), responseType: 'text' as 'text'
        // };
        // this.http.post("https://consultaqr.facturaelectronica.sat.gob.mx/ConsultaCFDIService.svc?wsdl",data2,httpOptions).subscribe(data => {
        this.http.post(this.storage.getapi()+"config/revisarCFDI",frmDt).subscribe(data =>{
          let getEstatus: any;            
          getEstatus = data['message']['Estado'];
          let nom = [];
          nom.push({
            ejercicio: this.selectedejercicio,
            periodo: this.selectedperiodo,
            uuid: activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]['tfd:TimbreFiscalDigital'][0]["$"]['UUID'],
            tipo: this.tipo[0][activeXML["cfdi:Comprobante"]["$"]['TipoDeComprobante']],
            documento: (activeXML["cfdi:Comprobante"]["$"]['Serie'] == undefined ? '' : activeXML["cfdi:Comprobante"]["$"]['Serie']+" - ")+(activeXML["cfdi:Comprobante"]["$"]['Folio'] == undefined ? '' : activeXML["cfdi:Comprobante"]["$"]['Folio']),
            receptor: activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]['Nombre'].trim(),
            rfc: activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]['Rfc'].trim(),
            total: formatNumber(activeXML["cfdi:Comprobante"]["$"]["Total"],"en_US",'1.2'),
            siniva: 0,
            fecha: this.datepipe.transform(activeXML["cfdi:Comprobante"]["$"]["Fecha"], 'dd/MM/yyyy HH:mm:ss'),
            estado: getEstatus,
            rubro: 'Sueldos y salarios',
            file: event[1]["files"]["file"],
            filename: event[0]['name'],
            id: ''
          });
          let formData:FormData = new FormData();
          formData.append('xmls', JSON.stringify(nom[0]));
          formData.append('ejercicio', this.selectedejercicio);
          formData.append('periodo', this.selectedperiodo);
          formData.append('idusuario', this.user['id']);
          formData.append('rfc',this.selectedSearchPersonId);
          this.http.post(this.storage.getapi()+'config/insertXMLNomina',formData).subscribe(data =>{
            // this.Nomina[this.Nomina.length-1]['id'] = data['cfdi']
            this.showNomina = true;
            this.Nomina.push({
              ejercicio: this.selectedejercicio,
              periodo: this.selectedperiodo,
              uuid: activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]['tfd:TimbreFiscalDigital'][0]["$"]['UUID'],
              tipo: this.tipo[0][activeXML["cfdi:Comprobante"]["$"]['TipoDeComprobante']],
              documento: (activeXML["cfdi:Comprobante"]["$"]['Serie'] == undefined ? '' : activeXML["cfdi:Comprobante"]["$"]['Serie']+" - ")+(activeXML["cfdi:Comprobante"]["$"]['Folio'] == undefined ? '' : activeXML["cfdi:Comprobante"]["$"]['Folio']),
              receptor: activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]['Nombre'].trim(),
              rfc: activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]['Rfc'].trim(),
              total: formatNumber(activeXML["cfdi:Comprobante"]["$"]["Total"],"en_US",'1.2'),
              siniva: 0,
              fecha: this.datepipe.transform(activeXML["cfdi:Comprobante"]["$"]["Fecha"], 'dd/MM/yyyy HH:mm:ss'),
              estado: getEstatus,
              rubro: 'Sueldos y salarios',
              file: event[1]["files"]["file"],
              filename: event[0]['name'],
              id: data['cfdi']
            });
          },error=>{
            this.showerrortab = true;
            this.xmlfallidos.push({
              tipo: this.tipo[0][activeXML["cfdi:Comprobante"]["$"]['TipoDeComprobante']],
              uuid: event[0]['name'],
              error: error['error']['message']
            });
            if(error['status'] == '401'){
              // this.router.navigate(['/auth/login']);
              this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
                this.storage.saveToken(data['access_token']); 
                this.onUploadSuccess(event);
              });
            } 
            this.startToast('warning',error['error']['message']);
            
          });
        }, error => {
          if(error['status'] == '401'){
            // this.router.navigate(['/auth/login']);
            this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
              this.storage.saveToken(data['access_token']); 
              this.onUploadSuccess(event);
            });
          } 
          this.startToast('warning',error['message']);            
        });
      }
    }
    if(this.selectedSearchPersonId == activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]['Rfc']){
      let frmDt:FormData = new FormData();
        frmDt.append('re', activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]['Rfc'].trim());
        frmDt.append('rr', activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]['Rfc'].trim());
        frmDt.append('tt', (activeXML["cfdi:Comprobante"]["$"]['TipoDeComprobante'] != 'P' ? activeXML["cfdi:Comprobante"]["$"]["Total"] : 0));
        frmDt.append('uuid',activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]['tfd:TimbreFiscalDigital'][0]["$"]['UUID']);      
      // let data2 ='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\r\n <soapenv:Header/>\r\n <soapenv:Body>\r\n <tem:Consulta>\r\n <tem:expresionImpresa><![CDATA[?re='+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]['Rfc'].trim()+'&rr='+activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]['Rfc'].trim()+'&tt='+(activeXML["cfdi:Comprobante"]["$"]['TipoDeComprobante'] != 'P' ? activeXML["cfdi:Comprobante"]["$"]["Total"] : 0)+'&id='+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]['tfd:TimbreFiscalDigital'][0]["$"]['UUID']+']]></tem:expresionImpresa>\r\n </tem:Consulta>\r\n </soapenv:Body>\r\n </soapenv:Envelope>';

      //   const httpOptions = {
      //     headers: new HttpHeaders({
      //       'Content-Type': 'text/xml;charset="utf-8"',
      //       'SOAPAction': 'http://tempuri.org/IConsultaCFDIService/Consulta',
      //       "Access-Control-Allow-Credentials": "true",
      //       "Access-Control-Expose-Headers": "*",
      //       "Access-Control-Allow-Headers": '*',
      //       "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD, OPTIONS, PATCH, PROPFIND, PROPPATCH, MKCOL, COPY, MOVE, LOCK",
      //       'Access-Control-Allow-Origin': this.storage.geturl(),
      //       "Content-Encoding": "gzip"
      //     }), responseType: 'text' as 'text'
      //   };
        // this.http.post("https://consultaqr.facturaelectronica.sat.gob.mx/ConsultaCFDIService.svc?wsdl",data2,httpOptions).subscribe(data => {
        this.http.post(this.storage.getapi()+"config/revisarCFDI",frmDt).subscribe(data =>{
          let getEstatus: any;            
          getEstatus = data['message']['Estado'];
          let reb = [];
          reb.push({
            uuid: activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]['tfd:TimbreFiscalDigital'][0]["$"]['UUID'],
            tipo: this.tipo[0][activeXML["cfdi:Comprobante"]["$"]['TipoDeComprobante']],
            documento: (activeXML["cfdi:Comprobante"]["$"]['Serie'] == undefined ? '' : activeXML["cfdi:Comprobante"]["$"]['Serie']+" - ")+(activeXML["cfdi:Comprobante"]["$"]['Folio'] == undefined ? '' : activeXML["cfdi:Comprobante"]["$"]['Folio']),
            emisor: activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]['Nombre'].trim(),
            rfc: activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]['Rfc'].trim(),
            total: formatNumber((activeXML["cfdi:Comprobante"]["$"]['TipoDeComprobante'] != 'P' ? activeXML["cfdi:Comprobante"]["$"]["Total"] : activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["Monto"]),"en_US",'1.2'),
            siniva: formatNumber((activeXML["cfdi:Comprobante"]["$"]['TipoDeComprobante'] != 'P' ? (activeXML["cfdi:Comprobante"]["$"]["Total"]/1.16) : (activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["Monto"]/1.16)),"en_US",'1.2'),
            fecha: this.datepipe.transform(activeXML["cfdi:Comprobante"]["$"]["Fecha"], 'dd/MM/yyyy HH:mm:ss'),
            estado: getEstatus,
            rubro: undefined,
            file: event[1]["files"]["file"],
            filename: event[0]['name'],
            id: ''
          });  
          let formData:FormData = new FormData();
          formData.append('xmls', JSON.stringify(reb[0]));
          formData.append('ejercicio', this.selectedejercicio);
          formData.append('periodo', this.selectedperiodo);
          formData.append('idusuario', this.user['id']);
          formData.append('rfc',this.selectedSearchPersonId);
          this.http.post(this.storage.getapi()+'config/insertXMLRecibidos',formData).subscribe(data =>{
            
            this.Recibidas.push({
              uuid: activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]['tfd:TimbreFiscalDigital'][0]["$"]['UUID'],
              tipo: this.tipo[0][activeXML["cfdi:Comprobante"]["$"]['TipoDeComprobante']],
              documento: (activeXML["cfdi:Comprobante"]["$"]['Serie'] == undefined ? '' : activeXML["cfdi:Comprobante"]["$"]['Serie']+" - ")+(activeXML["cfdi:Comprobante"]["$"]['Folio'] == undefined ? '' : activeXML["cfdi:Comprobante"]["$"]['Folio']),
              emisor: activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]['Nombre'].trim(),
              rfc: activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]['Rfc'].trim(),
              total: formatNumber((activeXML["cfdi:Comprobante"]["$"]['TipoDeComprobante'] != 'P' ? activeXML["cfdi:Comprobante"]["$"]["Total"] : activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["Monto"]),"en_US",'1.2'),
              siniva: formatNumber((activeXML["cfdi:Comprobante"]["$"]['TipoDeComprobante'] != 'P' ? (activeXML["cfdi:Comprobante"]["$"]["Total"]/1.16) : (activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["Monto"]/1.16)),"en_US",'1.2'),
              fecha: this.datepipe.transform(activeXML["cfdi:Comprobante"]["$"]["Fecha"], 'dd/MM/yyyy HH:mm:ss'),
              estado: getEstatus,
              rubro: undefined,
              file: event[1]["files"]["file"],
              filename: event[0]['name'],
              id: data['cfdi']
            }); 
          },error=>{
            this.showerrortab = true;
            this.xmlfallidos.push({
              tipo: this.tipo[0][activeXML["cfdi:Comprobante"]["$"]['TipoDeComprobante']],
              uuid: event[0]['name'],
              error: error['error']['message']
            });
            if(error['status'] == '401'){
              // this.router.navigate(['/auth/login']);
              this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
                this.storage.saveToken(data['access_token']); 
                this.onUploadSuccess(event);
              });
            } 
            this.startToast('warning',error['error']['message']);
          });
        }, error => {          
          if(error['status'] == '401'){
            // this.router.navigate(['/auth/login']);
            this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
              this.storage.saveToken(data['access_token']); 
              this.onUploadSuccess(event);
            });
          } 
          this.startToast('warning',error['message']);      
        });
    }
  }

  resetDropzoneUploads(): void {
    if (this.directiveRef) {
      this.directiveRef.reset();
      this.xmlfallidos = [];
      this.progreso = 0;
      this.totalxmls = 0;
      this.processedxmls = 0;
      this.cuantosxmls = 0;
      this.showprogressbar = false;
      this.showerrortab = false;
      this.Emitidas = [];
      this.Recibidas = [];
      this.Nomina = [];
      this.showEmitidas = false;
      this.showRecibidas = false;
      this.showNomina = false;
    }
  }

  startToast(type: any,message: any){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
    })
    
    Toast.fire({
      icon: type,
      title: message
    })
  }

  changeRFC(){
    if(this.selectedSearchPersonId == '' || this.selectedSearchPersonId == null || this.selectedSearchPersonId == undefined){
      this.ejercicioEnable = false;
    }else{
      this.http.get(this.storage.getapi()+'config/getEjercicios/'+this.selectedSearchPersonId).subscribe(data =>{
        this.ejercicios = [];
        this.ejercicioEnable = false;
        for(let x=0;x<data['result'].length;x++){
          this.ejercicios.push({
            anio: data['result'][x]['anio']
          });
        }
      },error=>{
        if(error['status'] == '401'){
          // this.router.navigate(['/auth/login']);
          this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
            this.storage.saveToken(data['access_token']); 
            this.changeRFC();
          });
        } 
      });      
    }
  }

  changeEjercicio(){
    if(this.selectedejercicio == '' || this.selectedejercicio == null || this.selectedejercicio == undefined){
      this.periodosEnable = false;
    }else{
      this.http.get(this.storage.getapi()+'config/getPeriodos/'+this.selectedSearchPersonId+"/"+this.selectedejercicio).subscribe(data =>{
        this.periodos = [];
        this.periodosEnable = false;
        for(let x=0;x<data['result'].length;x++){
          this.periodos.push({
            mes: this.meses[0][data['result'][x]['periodo']],
            periodo: data['result'][x]['periodo']
          });
          for(let y = 0; y<this.NuevoPeriodo.length;y++){
            if(this.NuevoPeriodo[y]['id'] == data['result'][x]['periodo']){
              this.NuevoPeriodo[y]['disabled'] = true;
              continue;
            }
          }
          // this.periodosEnable = false;
          if(this.periodos.length == 12){
            this.periodosEnableCreate = false;
          }
        }
        
      },error=>{
        if(error['status'] == '401'){
          // this.router.navigate(['/auth/login']);
          this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
            this.storage.saveToken(data['access_token']); 
            this.changeEjercicio();
          });
        }
      });
    }
    
  }

  changePeriodos(){
    if(this.selectedperiodo == '' || this.selectedperiodo == null || this.selectedperiodo == undefined){
      this.DropzoneDisabled = true;
    }else{
      if(this.ejercicioabierto){
        this.periodosEnable = false;
        this.ejercicioEnable = false;
      }
      this.DropzoneDisabled = false;
    }
  }

  AddEjercicio(content) {
    this.modalService.open(content, {centered: true}).result.then((result) => {
      console.log("Modal closed" + result);
    }).catch((res) => {});
  }

  AddPeriodo(content) {
    this.modalService.open(content, {centered: true}).result.then((result) => {
      console.log("Modal closed" + result);
    }).catch((res) => {});
  }

  checkNumbers(e){
    if(e.charCode < 48 || e.charCode > 57){
      return false;
    }
  }

  GuardarEjercicio(){
    let formData:FormData = new FormData();
    formData.append('ejercicio', this.nuevoejercicio);
    formData.append('rfc', this.selectedSearchPersonId);
    this.http.post(this.storage.getapi()+'config/insertEjercicio',formData).subscribe(data =>{     
      this.startToast('success',data['message']); 
      this.http.get(this.storage.getapi()+'config/getEjercicios/'+this.selectedSearchPersonId).subscribe(data =>{        
        this.ejercicios = [];
        for(let x=0;x<data['result'].length;x++){
          this.ejercicios.push({
            anio: data['result'][x]['anio']
          });
        }
        this.selectedejercicio = this.nuevoejercicio;
        this.nuevoejercicio = '';  
        this.modalService.dismissAll();
        this.periodosEnable = false;
      },error=>{
        if(error['status'] == '401'){
          // this.router.navigate(['/auth/login']);
          this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
            this.storage.saveToken(data['access_token']); 
            this.GuardarEjercicio();
          });
        }
      });            
    },error=>{
      if(error['status'] == '401'){
        // this.router.navigate(['/auth/login']);
        this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
          this.storage.saveToken(data['access_token']); 
          this.GuardarEjercicio();
        });
      }
      this.startToast('warning',error['error']['message']);
    });
  }

  GuardarPeriodo(){
    let formData:FormData = new FormData();
    formData.append('ejercicio', this.selectedejercicio);
    formData.append('rfc', this.selectedSearchPersonId);
    formData.append('periodo', this.nuevoperiodo);
    this.http.post(this.storage.getapi()+'config/insertPeriodo',formData).subscribe(data =>{      
      this.startToast('success',data['message']);
      this.http.get(this.storage.getapi()+'config/getPeriodos/'+this.selectedSearchPersonId+"/"+this.selectedejercicio).subscribe(data =>{        
        this.periodos = [];
        for(let x=0;x<data['result'].length;x++){
          this.periodos.push({
            mes: this.meses[0][data['result'][x]['periodo']],
            periodo: data['result'][x]['periodo']
          });
        }
        this.selectedperiodo = this.nuevoperiodo;
        this.nuevoperiodo = '';
        this.modalService.dismissAll();
        this.DropzoneDisabled = false;
      },error=>{
        if(error['status'] == '401'){
          // this.router.navigate(['/auth/login']);
          this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
            this.storage.saveToken(data['access_token']); 
            this.GuardarPeriodo();
          });
        }
      });   
    },error=>{
      if(error['status'] == '401'){
        // this.router.navigate(['/auth/login']);
        this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
          this.storage.saveToken(data['access_token']); 
          this.GuardarPeriodo();
        });
      }
      this.startToast('warning',error['error']['message']);
    });
  }

  GuardarClasificacion(){
    let formData:FormData = new FormData();
    formData.append('emitidas', JSON.stringify(this.Emitidas));
    formData.append('recibidas', JSON.stringify(this.Recibidas));
    formData.append('nomina', JSON.stringify(this.Nomina));
    this.http.post(this.storage.getapi()+'config/guardarClasificacion',formData).subscribe(data =>{    
      this.startToast('success',data['message']);
    },error=>{
      if(error['status'] == '401'){
        // this.router.navigate(['/auth/login']);
        this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
          this.storage.saveToken(data['access_token']); 
          this.GuardarClasificacion();
        });
      }
      this.startToast('warning',error['error']['message']);
    });
  }

}
