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
import { DatatableComponent,ColumnMode,SelectionType } from '@swimlane/ngx-datatable';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-clasificar',
  templateUrl: './clasificar.component.html',
  styleUrls: ['./clasificar.component.scss', 
  '../../../../../../node_modules/@swimlane/ngx-datatable/themes/material.scss']
})
export class ClasificarComponent implements OnInit {
  @BlockUI("block-item") blockUI;
  user: any;
  Pendientes: any = [];
  Clasificados: any = [];
  OldClasificados: any = [];
  clientes: any = [];
  Rubros: any = [];
  periodos: any = [];
  ejercicios: any = [];
  selectedSearchPersonId: string = null;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  ejercicio: any;
  periodo: any;
  loadingIndicator = true;
  sihay: boolean = true;
  sihayc: boolean = true;
  p: any;
  selected : any = [];
  defaultNavActiveId: any = 1;
  periodosEnable: boolean = false;
  ejercicioEnable: boolean = false;
  @ViewChild(DatatableComponent, {static: false}) table: DatatableComponent;
  @ViewChild(DatatableComponent, {static: false}) tablec: DatatableComponent;
  columns: any = [{ name: 'Emisor' }, { name: 'Rfc' }, { name: 'Estado' }, { name: 'Total' }, { name: 'Fecha de Emisión' }, {name: 'Rubros'}];
  columnsc: any = [{name:'-'},{ name: 'Emisor/Empleado' }, { name: 'Rfc' }, { name: 'Estado' }, { name: 'Total' }, { name: 'Fecha de Emisión' }, {name: 'Rubros'}];
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
  showSaveButton: any = false;
  showEditButton: boolean = true;
  showSaveButtonClasificar: boolean = false;
  showSolospan: boolean = true;
  EnableSoloSpan: boolean = true;
  
  constructor(private modalService: NgbModal,private http: HttpClient,private datepipe: DatePipe,private storage: TokenStorageService,private UService: UsuariosService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.user = this.storage.getUser();
    if(this.user['rolid'] != 8 && this.user['rolid'] != 15){
      this.showSaveButton = false;
      this.showSolospan = true;
    }
    this.Pendientes = [];
    this.selectedSearchPersonId = this.storage.getUltimoCliente();
    if(this.selectedSearchPersonId != undefined){
      this.startToast('info','Veremos si el cliente cuenta con un periodo ya iniciado.');
      this.blockUI.start('Revisando...'); // Start blocking      
      this.http.get(this.storage.getapi()+'config/getEjercicioAbierto/'+this.selectedSearchPersonId).subscribe(data =>{
        if(data['result'] != ''){
          this.ejercicio = data['result']['ejercicio'];
          this.periodo = this.meses[0][data['result']['periodo']];
          this.p = data['result']['periodo'];
          this.http.get(this.storage.getapi()+'config/getPendientes/'+this.selectedSearchPersonId+"/"+this.ejercicio+"/"+data['result']['periodo']).subscribe(data =>{
            this.Pendientes = [];
            for(let x=0;x<data['result'].length;x++){
              let parseString = require('xml2js').parseString;
              let activeXML = '';
              parseString(data['result'][x]['file'], function (err, result) {
                console.dir(result);
                activeXML = result;
              });
              let det = [];
              for(let y=0;y<activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'].length;y++){
                det.push({
                  desc: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Descripcion"],
                  imp: formatNumber(parseFloat(activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Importe"]),"en_US","1.2"),
                  vuni: formatNumber(parseFloat(activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ValorUnitario"]),"en_US","1.2"),
                  clv: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ClaveProdServ"],
                  noiden: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["NoIdentificacion"],
                  clvu: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ClaveUnidad"],
                  can: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Cantidad"],
                  uni: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Unidad"],
                  descuento: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Descuento"]
                });
              }
              this.Pendientes.push({
                id: data['result'][x]["id"],
                emisor: data['result'][x]['emisor'],
                rfc: data['result'][x]['rfc'],
                fecha: data['result'][x]['fecha'],
                estado: data['result'][x]['estado'],
                total: formatNumber(data['result'][x]['total'],"en_US",'1.0'),
                rubro: undefined,
                rubros: this.Rubros,
                det: det
              });
            }
            this.Clasificados = [];
            for(let x=0;x<data['resultc'].length;x++){              
              let det = [];
              if(data['resultc'][x]['tipo'] != 'Nómina'){
                let parseString = require('xml2js').parseString;
                let activeXML = '';
                parseString(data['resultc'][x]['file'], function (err, result) {
                  console.dir(result);
                  activeXML = result;
                });
                for(let y=0;y<activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'].length;y++){
                  det.push({
                    desc: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Descripcion"],
                    imp: formatNumber(parseFloat(activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Importe"]),"en_US","1.2"),
                    vuni: formatNumber(parseFloat(activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ValorUnitario"]),"en_US","1.2"),
                    clv: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ClaveProdServ"],
                    noiden: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["NoIdentificacion"],
                    clvu: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ClaveUnidad"],
                    can: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Cantidad"],
                    uni: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Unidad"],
                    descuento: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Descuento"]
                  });
                }
              }
              this.Clasificados.push({
                id: data['resultc'][x]["id"],
                cliente: (data['resultc'][x]['tipo'] == 'Nómina' ? data['resultc'][x]['receptor'] : data['resultc'][x]['emisor']),
                rfc: data['resultc'][x]['rfc'],
                fecha: data['resultc'][x]['fecha'],
                estado: data['resultc'][x]['estado'],
                total: formatNumber(data['resultc'][x]['total'],"en_US",'1.0'),
                rubro: data['resultc'][x]['rubros'],
                nuevoestado: data['resultc'][x]['nuevoestado'],
                showIfcancelada:(data['resultc'][x]['nuevoestado']['Estado'] != data['resultc'][x]['estado'] ? true : false),
                tooltipmsg: (data['resultc'][x]['nuevoestado']['Estado'] != data['resultc'][x]['estado'] ? 'El comprobante cambió su estado de Vigente a '+data['resultc'][x]['nuevoestado']['Estado'] : ''),
                rubros: this.Rubros,
                det: det
              });
              this.OldClasificados = this.Clasificados;
            }
            if(this.Pendientes.length > 0){
              this.sihay = true;
              this.showSaveButton = true;
            }else{
              this.sihay = false;
            }
            if(this.Clasificados.length > 0){
              this.sihayc = true;
            }else{
              this.sihayc = false;
            } 
            this.blockUI.stop();
            this.http.get(this.storage.getapi()+'config/getEjercicios/'+this.selectedSearchPersonId).subscribe(data =>{
              this.ejercicios = [];
              for(let x=0;x<data['result'].length;x++){
                this.ejercicios.push({
                  anio: data['result'][x]['anio']
                });
              }
              this.http.get(this.storage.getapi()+'config/getPeriodos/'+this.selectedSearchPersonId+"/"+this.ejercicio).subscribe(data =>{
                this.periodos = [];
                // this.periodosEnable = false;
                for(let x=0;x<data['result'].length;x++){
                  this.periodos.push({
                    mes: this.meses[0][data['result'][x]['periodo']],
                    periodo: data['result'][x]['periodo']
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
              // this.changeEjercicio();
            },error=>{
              if(error['status'] == '401'){
                // this.router.navigate(['/auth/login']);
                this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
                  this.storage.saveToken(data['access_token']); 
                  this.ngOnInit();
                });
              }
            }); 
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
          this.startToast('warning','No hay un periodo abierto para este cliente, favor de abrir uno en el módulo de "Subir CFDIs".');
          this.blockUI.stop();
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
    }else{
      this.ejercicio = '';
      this.periodo = '';
      this.Clasificados = [];
      this.Pendientes = [];
      this.showSaveButton = false;
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
    this.http.get(this.storage.getapi()+'config/getRubros').subscribe(data =>{
      this.Rubros = [];
      for(let x=0;x<data['result'].length;x++){
        this.Rubros.push({
          id: data['result'][x]['id'],
          name: data['result'][x]['nombre']
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

  changeEjercicio(){
    if(this.ejercicio == '' || this.ejercicio == null || this.ejercicio == undefined){
      // this.periodosEnable = false;
    }else{
      this.http.get(this.storage.getapi()+'config/getPeriodos/'+this.selectedSearchPersonId+"/"+this.ejercicio).subscribe(data =>{
        this.periodos = [];
        // this.periodosEnable = false;
        for(let x=0;x<data['result'].length;x++){
          this.periodos.push({
            mes: this.meses[0][data['result'][x]['periodo']],
            periodo: data['result'][x]['periodo']
          });
        }
        this.blockUI.stop();
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
    this.blockUI.start('Revisando...'); // Start blocking    
    this.http.get(this.storage.getapi()+'config/getPendientes/'+this.selectedSearchPersonId+"/"+this.ejercicio+"/"+this.p).subscribe(data =>{
      this.Pendientes = [];
      for(let x=0;x<data['result'].length;x++){
        let parseString = require('xml2js').parseString;
        let activeXML = '';
        parseString(data['result'][x]['file'], function (err, result) {
          console.dir(result);
          activeXML = result;
        });
        let det = [];
        for(let y=0;y<activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'].length;y++){
          det.push({
            desc: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Descripcion"],
            imp: formatNumber(parseFloat(activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Importe"]),"en_US","1.2"),
            vuni: formatNumber(parseFloat(activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ValorUnitario"]),"en_US","1.2"),
            clv: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ClaveProdServ"],
            noiden: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["NoIdentificacion"],
            clvu: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ClaveUnidad"],
            can: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Cantidad"],
            uni: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Unidad"],
            descuento: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Descuento"]
          });
        }
        this.Pendientes.push({
          id: data['result'][x]["id"],
          emisor: data['result'][x]['emisor'],
          rfc: data['result'][x]['rfc'],
          fecha: data['result'][x]['fecha'],
          estado: data['result'][x]['estado'],
          total: formatNumber(data['result'][x]['total'],"en_US",'1.0'),
          rubro: undefined,
          rubros: this.Rubros,
          det: det
        });
      }
      this.Clasificados = [];
      for(let x=0;x<data['resultc'].length;x++){
        let det = [];
        if(data['resultc'][x]['tipo'] != 'Nómina'){
          let parseString = require('xml2js').parseString;
          let activeXML = '';
          parseString(data['resultc'][x]['file'], function (err, result) {
            console.dir(result);
            activeXML = result;
          });
          for(let y=0;y<activeXML['cfdi:Comprobante']['cfdi:Conceptos'].length;y++){
            det.push({
              desc: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Descripcion"],
              imp: formatNumber(parseFloat(activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Importe"]),"en_US","1.2"),
              vuni: formatNumber(parseFloat(activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ValorUnitario"]),"en_US","1.2"),
              clv: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ClaveProdServ"],
              noiden: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["NoIdentificacion"],
              clvu: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ClaveUnidad"],
              can: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Cantidad"],
              uni: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Unidad"],
              descuento: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Descuento"]
            });
          }
        }
        this.Clasificados.push({
          id: data['resultc'][x]["id"],
          cliente: (data['resultc'][x]['tipo'] == 'Nómina' ? data['resultc'][x]['receptor'] : data['resultc'][x]['emisor']),
          rfc: data['resultc'][x]['rfc'],
          fecha: data['resultc'][x]['fecha'],
          estado: data['resultc'][x]['estado'],
          total: formatNumber(data['resultc'][x]['total'],"en_US",'1.0'),
          rubro: data['resultc'][x]['rubros'],
          nuevoestado: data['resultc'][x]['nuevoestado'],
          showIfcancelada:(data['resultc'][x]['nuevoestado']['Estado'] != data['resultc'][x]['estado'] ? true : false),
          tooltipmsg: (data['resultc'][x]['nuevoestado']['Estado'] != data['resultc'][x]['estado'] ? 'El comprobante cambió su estado de Vigente a '+data['resultc'][x]['nuevoestado']['Estado'] : ''),
          det: det
        });
      }
      if(this.Pendientes.length > 0){
        this.sihay = true;
        this.showSaveButton = true;
      }else{
        this.sihay = false;
      }
      if(this.Clasificados.length > 0){
        this.sihayc = true;
      }else{
        this.sihayc = false;
      }
      this.blockUI.stop();
    },error=>{
      // this.router.navigate(['/auth/login']);
      this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
        this.storage.saveToken(data['access_token']); 
        this.changePeriodos();
      });
    });
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
    if(this.selectedSearchPersonId != '' && this.selectedSearchPersonId != null && this.selectedSearchPersonId != undefined){
      this.startToast('info','Veremos si el cliente cuenta con un periodo ya iniciado.');
      this.blockUI.start('Revisando...'); // Start blocking
      this.http.get(this.storage.getapi()+'config/getEjercicioAbierto/'+this.selectedSearchPersonId).subscribe(data =>{
        if(data['result'] != ''){
          this.ejercicio = data['result']['ejercicio'];
          this.periodo = this.meses[0][data['result']['periodo']];
          this.p = data['result']['periodo'];
          this.http.get(this.storage.getapi()+'config/getPendientes/'+this.selectedSearchPersonId+"/"+this.ejercicio+"/"+data['result']['periodo']).subscribe(data =>{
            this.Pendientes = [];
            for(let x=0;x<data['result'].length;x++){
              let parseString = require('xml2js').parseString;
              let activeXML = '';
              parseString(data['result'][x]['file'], function (err, result) {
                console.dir(result);
                activeXML = result;
              });
              let det = [];
              for(let y=0;y<activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'].length;y++){
                det.push({
                  desc: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Descripcion"],
                  imp: formatNumber(parseFloat(activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Importe"]),"en_US","1.2"),
                  vuni: formatNumber(parseFloat(activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ValorUnitario"]),"en_US","1.2"),
                  clv: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ClaveProdServ"],
                  noiden: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["NoIdentificacion"],
                  clvu: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ClaveUnidad"],
                  can: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Cantidad"],
                  uni: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Unidad"],
                  descuento: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Descuento"]
                });
              }
              this.Pendientes.push({
                id: data['result'][x]["id"],
                emisor: data['result'][x]['emisor'],
                rfc: data['result'][x]['rfc'],
                fecha: data['result'][x]['fecha'],
                estado: data['result'][x]['estado'],
                total: formatNumber(data['result'][x]['total'],"en_US",'1.0'),
                rubro: undefined,
                rubros: this.Rubros,
                det: det
              });
            }
            this.Clasificados = [];
            for(let x=0;x<data['resultc'].length;x++){
              let det = [];
              if(data['resultc'][x]['tipo'] == 'Nómina'){
                let parseString = require('xml2js').parseString;
                let activeXML = '';
                parseString(data['resultc'][x]['file'], function (err, result) {
                  console.dir(result);
                  activeXML = result;
                });
                for(let y=0;y<activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'].length;y++){
                  det.push({
                    desc: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Descripcion"],
                    imp: formatNumber(parseFloat(activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Importe"]),"en_US","1.2"),
                    vuni: formatNumber(parseFloat(activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ValorUnitario"]),"en_US","1.2"),
                    clv: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ClaveProdServ"],
                    noiden: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["NoIdentificacion"],
                    clvu: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ClaveUnidad"],
                    can: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Cantidad"],
                    uni: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Unidad"],
                    descuento: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Descuento"]
                  });
                }
              }
              this.Clasificados.push({
                id: data['resultc'][x]["id"],
                cliente: (data['resultc'][x]['tipo'] == 'Nómina' ? data['resultc'][x]['receptor'] : data['resultc'][x]['emisor']),
                rfc: data['resultc'][x]['rfc'],
                fecha: data['resultc'][x]['fecha'],
                estado: data['resultc'][x]['estado'],
                total: formatNumber(data['resultc'][x]['total'],"en_US",'1.0'),
                rubro: data['resultc'][x]['rubros'],
                det: det
              });
            }
            if(this.Pendientes.length > 0){
              this.sihay = true;
              this.showSaveButton = true;
            }else{
              this.sihay = false;
            }
            if(this.Clasificados.length > 0){
              this.sihayc = true;
            }else{
              this.sihayc = false;
            }
            this.blockUI.stop();
          },error=>{
            if(error['status'] == '401'){
              this.router.navigate(['/auth/login']);
            }
          });
        }else{
          this.startToast('warning','No hay un periodo abierto para este cliente, favor de abrir uno en el módulo de "Subir CFDIs".');
          this.blockUI.stop();
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
    }else{
      this.ejercicio = '';
      this.periodo = '';
      this.Clasificados = [];
      this.Pendientes = [];
      this.showSaveButton = false;
    }
  }

  getRowClass = (row) => {    
    return 'm-1';    
  }

  rubrosVacíos() {
    const Alrt = Swal.mixin({
      showConfirmButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:'Si',      
      cancelButtonText: 'No'      
    })
    
    Alrt.fire({
      icon: 'warning',
      title: 'Hay CFDIs sin clasificar. ¿Deseas continuar?'
    }).then((result)=>{
      if(result.isConfirmed){    
        this.blockUI.start('Guardando...'); // Start blocking    
        let pend: any = [];
        for(let y=0;y<this.Pendientes.length;y++){
          if(this.Pendientes[y]['rubro'] != undefined){
            pend.push({
              id: this.Pendientes[y]['id'],
              rubro: this.Pendientes[y]['rubro']
            })
          }
        }
        let formData:FormData = new FormData();
        formData.append('rubros', JSON.stringify(pend));
        this.http.post(this.storage.getapi()+'config/guardarRubros',formData).subscribe(data => {
          if(data['affected'] == 'guardadas'){
            this.startToast('success',"Se han clasificado los CFDI's correctamente!");
            this.http.get(this.storage.getapi()+'config/getPendientes/'+this.selectedSearchPersonId+"/"+this.ejercicio+"/"+this.p).subscribe(data =>{
              this.Pendientes = [];
              if(data['result'].length > 0){
                for(let x=0;x<data['result'].length;x++){
                  let parseString = require('xml2js').parseString;
                  let activeXML = '';
                  parseString(data['result'][x]['file'], function (err, result) {
                    console.dir(result);
                    activeXML = result;
                  });
                  let det = [];
                  for(let y=0;y<activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'].length;y++){
                    det.push({
                      desc: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Descripcion"],
                      imp: formatNumber(parseFloat(activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Importe"]),"en_US","1.2"),
                      vuni: formatNumber(parseFloat(activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ValorUnitario"]),"en_US","1.2"),
                      clv: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ClaveProdServ"],
                      noiden: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["NoIdentificacion"],
                      clvu: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ClaveUnidad"],
                      can: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Cantidad"],
                      uni: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Unidad"],
                      descuento: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Descuento"]
                    });
                  }
                  this.Pendientes.push({
                    id: data['result'][x]["id"],
                    emisor: data['result'][x]['emisor'],
                    rfc: data['result'][x]['rfc'],
                    fecha: data['result'][x]['fecha'],
                    estado: data['result'][x]['estado'],
                    total: formatNumber(data['result'][x]['total'],"en_US",'1.2'),
                    rubro: undefined,
                    rubros: this.Rubros,
                    det: det
                  });
                }
                this.Clasificados = [];
                for(let x=0;x<data['resultc'].length;x++){
                  let det = [];
                  if(data['resultc'][x]['tipo'] != 'Nómina'){
                    let parseString = require('xml2js').parseString;
                    let activeXML = '';
                    parseString(data['resultc'][x]['file'], function (err, result) {
                      console.dir(result);
                      activeXML = result;
                    });
                    for(let y=0;y<activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'].length;y++){
                      det.push({
                        desc: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Descripcion"],
                        imp: formatNumber(parseFloat(activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Importe"]),"en_US","1.2"),
                        vuni: formatNumber(parseFloat(activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ValorUnitario"]),"en_US","1.2"),
                        clv: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ClaveProdServ"],
                        noiden: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["NoIdentificacion"],
                        clvu: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ClaveUnidad"],
                        can: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Cantidad"],
                        uni: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Unidad"],
                        descuento: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Descuento"]
                      });
                    }
                  }
                  this.Clasificados.push({
                    id: data['resultc'][x]["id"],
                    cliente: (data['resultc'][x]['tipo'] == 'Nómina' ? data['resultc'][x]['receptor'] : data['resultc'][x]['emisor']),
                    rfc: data['resultc'][x]['rfc'],
                    fecha: data['resultc'][x]['fecha'],
                    estado: data['resultc'][x]['estado'],
                    total: formatNumber(data['resultc'][x]['total'],"en_US",'1.0'),
                    rubro: data['resultc'][x]['rubros'],
                    det: det
                  });
                }
                if(this.Pendientes.length > 0){
                  this.showSaveButton = true;
                  this.sihay = true;
                }else{
                  this.showSaveButton = false;
                  this.sihay = false;
                }
                if(this.Clasificados.length > 0){
                  this.sihayc = true;
                }else{
                  this.sihayc = false;
                }
                this.blockUI.stop();
              }else{
                this.Clasificados = [];
                for(let x=0;x<data['resultc'].length;x++){
                  let det = [];
                  if(data['resultc'][x]['tipo'] != 'Nómina'){
                    let parseString = require('xml2js').parseString;
                    let activeXML = '';
                    parseString(data['resultc'][x]['file'], function (err, result) {
                      console.dir(result);
                      activeXML = result;
                    });
                    for(let y=0;y<activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'].length;y++){
                      det.push({
                        desc: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Descripcion"],
                        imp: formatNumber(parseFloat(activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Importe"]),"en_US","1.2"),
                        vuni: formatNumber(parseFloat(activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ValorUnitario"]),"en_US","1.2"),
                        clv: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ClaveProdServ"],
                        noiden: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["NoIdentificacion"],
                        clvu: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ClaveUnidad"],
                        can: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Cantidad"],
                        uni: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Unidad"],
                        descuento: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Descuento"]
                      });
                    }
                  }
                  this.Clasificados.push({
                    id: data['resultc'][x]["id"],
                    receptor: data['resultc'][x]['receptor'],
                    rfc: data['resultc'][x]['rfc'],
                    fecha: data['resultc'][x]['fecha'],
                    estado: data['resultc'][x]['estado'],
                    total: formatNumber(data['resultc'][x]['total'],"en_US",'1.0'),
                    rubro: data['resultc'][x]['rubros'],
                    det: det
                  });
                }
                this.showSaveButton = false;
                this.blockUI.stop();
              }
            },error=>{
              if(error['status'] == '401'){
                // this.router.navigate(['/auth/login']);
                this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
                  this.storage.saveToken(data['access_token']); 
                  this.rubrosVacíos();
                });
              }
            });
          }else{
            this.blockUI.stop();
          }
        },error =>{
          if(error['status'] == '401'){
            // this.router.navigate(['/auth/login']);
            this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
              this.storage.saveToken(data['access_token']); 
              this.rubrosVacíos();
            });
          }
        });
      }
      if(result.isDismissed){
        this.blockUI.stop();
        return;
      }
    });
  }

  saveRubros(){
    let faltan: any = 0;
    let pend: any = [];
    for(let y=0;y<this.Pendientes.length;y++){
      if(this.Pendientes[y]['rubro'] == undefined){
        faltan = 1;
        break;
      }
    }
    if(faltan == 1){
      this.rubrosVacíos();
    }else{
      this.blockUI.start('Guardando...'); // Start blocking    
      for(let y=0;y<this.Pendientes.length;y++){
        if(this.Pendientes[y]['rubro'] != undefined){
          pend.push({
            id: this.Pendientes[y]['id'],
            rubro: this.Pendientes[y]['rubro']
          })
        }
      }
      let formData:FormData = new FormData();
      formData.append('rubros', JSON.stringify(pend));
      this.http.post(this.storage.getapi()+'config/guardarRubros',formData).subscribe(data => {
        if(data['affected'] == 'guardadas'){
          this.startToast('success',"Se han clasificado los CFDI's correctamente!");
          this.http.get(this.storage.getapi()+'config/getPendientes/'+this.selectedSearchPersonId+"/"+this.ejercicio+"/"+this.p).subscribe(data =>{
            this.Pendientes = [];
            if(data['result'].length > 0){
              for(let x=0;x<data['result'].length;x++){
                let parseString = require('xml2js').parseString;
                let activeXML = '';
                parseString(data['result'][x]['file'], function (err, result) {
                  console.dir(result);
                  activeXML = result;
                });
                let det = [];
                for(let y=0;y<activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'].length;y++){
                  det.push({
                    desc: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Descripcion"],
                    imp: formatNumber(parseFloat(activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Importe"]),"en_US","1.2"),
                    vuni: formatNumber(parseFloat(activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ValorUnitario"]),"en_US","1.2"),
                    clv: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ClaveProdServ"],
                    noiden: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["NoIdentificacion"],
                    clvu: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ClaveUnidad"],
                    can: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Cantidad"],
                    uni: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Unidad"],
                    descuento: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Descuento"]
                  });
                }
                this.Pendientes.push({
                  id: data['result'][x]["id"],
                  emisor: data['result'][x]['emisor'],
                  rfc: data['result'][x]['rfc'],
                  fecha: data['result'][x]['fecha'],
                  estado: data['result'][x]['estado'],
                  total: formatNumber(data['result'][x]['total'],"en_US",'1.0'),
                  rubro: undefined,
                  rubros: this.Rubros,
                  det: det
                });
              }
              this.showSaveButton = true;
            }else{
              this.showSaveButton = false;
            }
            this.blockUI.stop();
          },error=>{
            if(error['status'] == '401'){
              // this.router.navigate(['/auth/login']);
              this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
                this.storage.saveToken(data['access_token']); 
                this.saveRubros();
              });
            }
          });
        }
      },error =>{
        if(error['status'] == '401'){
          // this.router.navigate(['/auth/login']);
          this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
            this.storage.saveToken(data['access_token']); 
            this.saveRubros();
          });
        }
      });
    }
  }
    
  toggleExpandRow(row) {    
    this.table.rowDetail.collapseAllRows();
    this.table.rowDetail.toggleExpandRow(row);
  }

  toggleExpandRow2(row) {
    this.tablec.rowDetail.collapseAllRows();
    this.tablec.rowDetail.toggleExpandRow(row);
  }

  getRowHeight(row) {
    return row.height;
  }

  habiliitarEdicionRubros(){
    this.showSaveButtonClasificar = true;
    this.showSolospan = false;
    this.showEditButton = false;
    this.EnableSoloSpan = false;
  }

  CancelActRubros(){    
    this.showSaveButtonClasificar = false;
    this.showSolospan = true;
    this.showEditButton = true;
    this.EnableSoloSpan = true;
  }

  actRubros(){
    const Alrt = Swal.mixin({
      showConfirmButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:'Si',      
      cancelButtonText: 'No'      
    })
    
    Alrt.fire({
      icon: 'warning',
      title: 'Se van a actualizar los rubros. ¿Deseas continuar?'
    }).then((result)=>{
      if(result.isConfirmed){    
        this.blockUI.start('Guardando...'); // Start blocking 
        let formData:FormData = new FormData();
        formData.append('rubros', JSON.stringify(this.Clasificados));
        this.http.post(this.storage.getapi()+'config/actRubros',formData).subscribe(data => {
          if(data['affected'] == 'guardadas'){
            this.startToast('success',"Se han actualizado los rubros de los CFDI's correctamente!");  
            this.showSaveButtonClasificar = false;
            this.showSolospan = true;
            this.showEditButton = true;
            this.EnableSoloSpan = true;         
            this.blockUI.stop();
          }
        },error =>{
          if(error['status'] == '401'){
            // this.router.navigate(['/auth/login']);
            this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
              this.storage.saveToken(data['access_token']); 
              this.actRubros();
            });
          }
        });
      }
      if(result.isDismissed){
        this.blockUI.stop();
        return;
      }
    });
  }

}
