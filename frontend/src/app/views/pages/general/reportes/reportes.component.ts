declare var require: any;
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../../../core/JWT/usuarios.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from 'src/app/core/JWT/token-storage.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { ChartOptions as chrtoptns, ChartType, ChartDataSets, RadialChartOptions } from 'chart.js';
import { Label, Color, SingleDataSet } from 'ng2-charts';
import { DecimalPipe,formatNumber } from '@angular/common';
import { ChartComponent, ApexAxisChartSeries, ApexGrid, ApexChart, ApexXAxis, ApexYAxis, ApexMarkers, ApexStroke, ApexLegend, ApexTooltip, ApexDataLabels, ApexFill,  ApexPlotOptions, ApexResponsive, ApexNonAxisChartSeries,  ApexTitleSubtitle,} from "ng-apexcharts";
import { BlockUI, NgBlockUI,BlockUIService  } from 'ng-block-ui';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ColumnMode,SelectionType } from '@swimlane/ngx-datatable';
import pdfMake from "pdfmake/build/pdfmake";  
import pdfFonts from "pdfmake/build/vfs_fonts";  
import { TagInputAccessor } from 'ngx-chips/core/accessor';
import { resolve } from '@angular/compiler-cli/src/ngtsc/file_system';
import { saveAs } from 'file-saver';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
export type ChartOptions = {
  series: ApexAxisChartSeries;
  nonAxisSeries: ApexNonAxisChartSeries;
  colors: string[];
  grid: ApexGrid;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  markers: ApexMarkers,
  stroke: ApexStroke,
  legend: ApexLegend,
  responsive: ApexResponsive[],
  tooltip: ApexTooltip,
  fill: ApexFill
  dataLabels: ApexDataLabels,
  plotOptions: ApexPlotOptions,
  labels: string[],
  title: ApexTitleSubtitle
};
@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportesComponent implements OnInit {
  @BlockUI('emitidasblock') emitidasblock: NgBlockUI;
  @BlockUI('recibidasblock') recibidasblock: NgBlockUI;
  @BlockUI('nominasblock') nominasblock: NgBlockUI;
  @BlockUI('historicoporejercicio') historicoporejercicio: NgBlockUI;
  @BlockUI('rubrosporperiodo') rubrosporperiodo: NgBlockUI;
  @BlockUI('ejercicioblock') ejercicioblock: NgBlockUI;
  @BlockUI('periodoblock') periodoblock: NgBlockUI;
  @BlockUI('historicoporperiodo') historicoporperiodo: NgBlockUI;
  block: NgBlockUI;
  public donutChartOptions: Partial<ChartOptions>;
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  currentrow:any;
  id: any;
  user: any;
  ejercicios: any = [];
  periodos: any = [];
  emitidas: any = [];
  nominas: any = [];
  recibidas: any = [];
  clientes: any = [];
  usoCFDI: any = [];
  formasdepago: any = [];
  filteremi: any = [];
  filterrec: any = [];
  filternom: any = [];
  contotalh: boolean = false;
  contotalr: boolean = false;
  ejercicioEnable: boolean = true;
  periodosEnable: boolean = true;
  selectedSearchPersonId: string = null;
  selectedejercicio: any;
  selectedperiodo: any;
  nomostrarconiva: boolean = false;
  PorPeriodo: boolean = false;
  cliente: boolean = true;
  logo: any;
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
  showthis: boolean = true;
  showthat: boolean = false;
  showTot: boolean = true;
  defaultNavActiveId: any = 1;
  valores: any = [];
  valoresT: any = [];
  etiquetas: any = [];
  net: any = [];
  ing: any = [];
  egr: any = [];
  netT: any = [];
  ingT: any = [];
  egrT: any = [];
  netPP: any = [];
  ingPP: any = [];
  egrPP: any = [];
  netTPP: any = [];
  ingTPP: any = [];
  egrTPP: any = [];
  cuadrado: any;
  @ViewChild(DatatableComponent, {static: false}) table: DatatableComponent;
  @ViewChild(DatatableComponent, {static: false}) tablereb: DatatableComponent;
  @ViewChild(DatatableComponent, {static: false}) tablenom: DatatableComponent;
  columnsemi: any = [{ name: 'Receptor' }, { name: 'Rfc' }, {name: 'Fecha'}, { name: 'Total' },{ name: 'Estado' },{ name: 'Documento' },{ name: 'UUID' },{ name: 'Tipo' },{ name: 'Acciones' }];
  columnsreb: any = [{ name: 'Emisor' }, { name: 'Rfc' }, {name: 'Fecha'}, { name: 'Total' },{ name: 'Estado' },{ name: 'Documento' },{ name: 'UUID' },{ name: 'Tipo' },{ name: 'Rubro' },{ name: 'Acciones' }];
  columnsnom: any = [{ name: 'Receptor' }, { name: 'Rfc' }, {name: 'Fecha'}, { name: 'Total' },{ name: 'Estado' },{ name: 'Documento' },{ name: 'UUID' },{ name: 'Tipo' },{ name: 'Acciones' }];
  public mixedChartLabels: Label[] = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  public mixedChartType: ChartType = 'bar';
  public mixedChartColors: Color[] = [
    { 
      backgroundColor: "rgba(0,0,0,0)",
      borderColor: "blue",
      pointBorderWidth: 5,
      pointBackgroundColor: "white"
    },
    {
      backgroundColor:  "#4d8af0"
    },
    {
      backgroundColor: "#f77eb9"
    }
  ];
  public mixedChartData: ChartDataSets[] = [
    {
      label: 'Neto',
      data: [0,0,0,0,0,0,0,0,0,0,0,0],
      type: 'line'
    },{
      label: 'Ingresos',
      data: [0,0,0,0,0,0,0,0,0,0,0,0],
      type: 'bar'
    },{
      label: 'Egresos',
      data: [0,0,0,0,0,0,0,0,0,0,0,0],
      type: 'bar'
    }
    
  ];
  public mixedChartOptions: chrtoptns = {
    responsive: true,
    tooltips:{
      enabled: true,
      callbacks: {
        label: function(tooltipItem, data) {
          var label = data.datasets[tooltipItem.datasetIndex].label || '';
          var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          return label+': $ '+value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
      }
    }
  };

  public mixedChartLabelsPP: Label[];  
  public mixedChartDataPP: ChartDataSets[];
  public mixedChartOptionsPP: chrtoptns = {
    responsive: true,
    tooltips:{
      enabled: true,
      callbacks: {
        label: function(tooltipItem, data) {
          var label = data.datasets[tooltipItem.datasetIndex].label || '';
          var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          return label+': $ '+value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
      }
    }
  };
  constructor(private bser: BlockUIService, private blockUIService: BlockUIService, private datepipe: DatePipe,private storage: TokenStorageService,private http: HttpClient,private UService: UsuariosService, private router: Router, private route: ActivatedRoute) { 
    this.fetchUsoCFDI(data => {
      this.usoCFDI = data;
    });
    this.fetchfdp(data => {
      this.formasdepago = data;
    });
  }

  ngOnInit(): void {
    this.user = this.storage.getUser();

  



    if(this.user['tipo'] == 'cliente'){
      this.selectedSearchPersonId = this.user['rfc'];
      this.ejercicioEnable = false;
      this.ejercicioblock.start('Cargando ejercicios...');
      this.nomostrarconiva = false;
      this.showTot = false;
        this.http.get(this.storage.getapi()+'config/getEjercicios/'+this.selectedSearchPersonId).subscribe(data =>{
          this.ejercicios = [];
          this.ejercicioEnable = false;
          for(let x=0;x<data['result'].length;x++){
            this.ejercicios.push({
              anio: data['result'][x]['anio']
            });
          }
          this.ejercicioblock.stop();
          if(this.ejercicios.length == 0){
            this.ejercicioEnable = true;
          }
          this.http.get(this.storage.getapi()+'config/getLogo/'+this.selectedSearchPersonId).subscribe(data => {
           
            
            if(data['logo'] != '' && data['logo'] != undefined && data['logo'] != null){
              this.http.get(this.storage.getapi()+'config/imageForPDF?url='+this.selectedSearchPersonId+"/perfil/"+data['logo']).subscribe(data2 =>{
               this.logo = data2['archivo'];
                })
            }
            this.cuadrado = data['cuadrado'];
          },error=>{
            if(error['status'] == '401'){
              //this.router.navigate(['/auth/login']);
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
      this.selectedSearchPersonId = this.storage.getUltimoCliente();
      if(this.selectedSearchPersonId != undefined){
        this.ejercicioblock.start('Cargando ejercicios...');
        this.http.get(this.storage.getapi()+'config/getEjercicios/'+this.selectedSearchPersonId).subscribe(data =>{
          this.ejercicios = [];
          this.ejercicioEnable = false;
          for(let x=0;x<data['result'].length;x++){
            this.ejercicios.push({
              anio: data['result'][x]['anio']
            });
          }
          this.ejercicioblock.stop();
          if(this.ejercicios.length == 0){
            this.ejercicioEnable = true;
          }
        },error=>{
          if(error['status'] == '401'){
            //this.router.navigate(['/auth/login']);
            this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
              this.storage.saveToken(data['access_token']); 
              this.ngOnInit();
            });
          }
        });   
        this.http.get(this.storage.getapi()+'config/getLogo/'+this.selectedSearchPersonId).subscribe(data => {
          
          if(data['logo'] != '' && data['logo'] != undefined && data['logo'] != null){
          this.http.get(this.storage.getapi()+'config/imageForPDF?url='+this.selectedSearchPersonId+"/perfil/"+data['logo']).subscribe(data2 =>{
          this.logo = data2['archivo'];
          });
          }
          this.cuadrado = data['cuadrado'];
        },error=>{
          if(error['status'] == '401'){
            //this.router.navigate(['/auth/login']);
            this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
              this.storage.saveToken(data['access_token']); 
              this.ngOnInit();
            });
          }
        });
      }
    }
    // if(this.emitidas.length == 0){
    //   this.showthis = false;
    //   this.showthat = true;
    // }
  }

 
  changeRFC(){
    if(this.selectedSearchPersonId == '' || this.selectedSearchPersonId == null || this.selectedSearchPersonId == undefined){
      this.ejercicioEnable = true;
    }else{
      this.ejercicioblock.start('Cargando ejercicios...');
      this.http.get(this.storage.getapi()+'config/getEjercicios/'+this.selectedSearchPersonId).subscribe(data =>{
        this.ejercicios = [];
        this.ejercicioEnable = false;
        for(let x=0;x<data['result'].length;x++){
          this.ejercicios.push({
            anio: data['result'][x]['anio']
          });
        }
        this.ejercicioblock.stop();
        if(this.ejercicios.length == 0){
          this.ejercicioEnable = true;
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
      this.periodosEnable = true;
    }else{
      this.periodoblock.start('Cargando periodos...');
      this.http.get(this.storage.getapi()+'config/getPeriodos/'+this.selectedSearchPersonId+"/"+this.selectedejercicio).subscribe(data =>{
        this.periodos = [];
        this.periodosEnable = false;
        for(let x=0;x<data['result'].length;x++){
          this.periodos.push({
            mes: this.meses[0][data['result'][x]['periodo']],
            periodo: data['result'][x]['periodo']
          });
        }
        
        if(this.periodos.length==0){
          this.periodosEnable = true;
        }
        this.periodoblock.stop();
      },error=>{
        if(error['status'] == '401'){
          // this.router.navigate(['/auth/login']);
          this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
            this.storage.saveToken(data['access_token']); 
            this.changeEjercicio();
          });
        }
      }); 
      this.historicoporejercicio.start('Cargando Gráfica por ejercicio...');
        // this.blockUIService.start('rubrosporejercicio','Cargando Gráfica por ejercicio...');
      this.http.get(this.storage.getapi()+'config/getHistorico/'+this.selectedSearchPersonId+"/"+this.selectedejercicio).subscribe(data =>{
        // this.periodos = [];
        // this.periodosEnable = true;
        // for(let x=0;x<data['result'].length;x++){
        //   this.periodos.push({
        //     mes: this.meses[0][data['result'][x]['periodo']],
        //     periodo: data['result'][x]['periodo']
        //   });
        // }
        this.net = [0,0,0,0,0,0,0,0,0,0,0,0];
        this.ing = [0,0,0,0,0,0,0,0,0,0,0,0];
        this.egr = [0,0,0,0,0,0,0,0,0,0,0,0];
        this.netT = [0,0,0,0,0,0,0,0,0,0,0,0];
        this.ingT = [0,0,0,0,0,0,0,0,0,0,0,0];
        this.egrT = [0,0,0,0,0,0,0,0,0,0,0,0];
        for (let value in data['result']){
          this.net[parseInt(value)-1] = data['result'][value]['neto'];
          this.ing[parseInt(value)-1] = data['result'][value]['ingresos'];
          this.egr[parseInt(value)-1] = data['result'][value]['egresos'];
          this.netT[parseInt(value)-1] = data['result'][value]['netoT'];
          this.ingT[parseInt(value)-1] = data['result'][value]['ingresosT'];
          this.egrT[parseInt(value)-1] = data['result'][value]['egresosT'];
        }
        
        let chartdata = [{
          label: 'Neto',
          data: this.netT,
          type: 'line'
        },{
          label: 'Ingresos',
          data: this.ingT,
          type: 'bar'
        },{
          label: 'Egresos',
          data: this.egrT,
          type: 'bar'
        }];
        this.mixedChartData = chartdata;
        this.historicoporejercicio.stop();
        // this.blockUIService.start('rubrosporejercicio','Cargando Gráfica por ejercicio...');
      },error=>{
        if(error['status'] == '401'){
          // this.router.navigate(['/auth/login']);
          this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
            this.storage.saveToken(data['access_token']); 
            this.changeEjercicio();
          });
        }
        this.historicoporejercicio.stop();
        // this.blockUIService.start('rubrosporejercicio','Cargando Gráfica por ejercicio...');
      });      
    }
    
  }

  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }

  changePeriodos(){
    if(this.selectedperiodo == '' || this.selectedperiodo == null || this.selectedperiodo == undefined){
      this.emitidas = [];
      this.recibidas = [];
      this.nominas = [];
      this.PorPeriodo = false;
    }else{
      this.emitidasblock.start('Cargando facturas emitidas...');
      this.recibidasblock.start('Cargando facturas recibidas...');
      this.nominasblock.start('Cargando facturas de nómina...');
      this.http.get(this.storage.getapi()+'config/getCFDIs/'+this.selectedSearchPersonId+"/"+this.selectedejercicio+"/"+this.selectedperiodo).subscribe(data =>{
        this.emitidas = [];
        this.recibidas = [];
        this.nominas = [];
        for(let x=0;x<data['result'].length;x++){
          if(data['result'][x]['emisor'] == this.selectedSearchPersonId && data['result'][x]['tipo'] != 'Nómina'){
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
            this.emitidas.push({
              uuid: data['result'][x]['uuid'],
              tipo: data['result'][x]['tipo'],
              documento: (data['result'][x]['documento'] == undefined ? '' : data['result'][x]['documento']),
              receptor: data['result'][x]['receptor'].trim(),
              rfc: data['result'][x]['rfc'],
              total: formatNumber(data['result'][x]['total'],"en_US",'1.2'),
              totalsort: data['result'][x]['total'],
              fecha: this.datepipe.transform(data['result'][x]['fecha'],"dd/MM/yyyy HH:mm"),
              estado: data['result'][x]['estado'],
              file: data['result'][x]['file'],
              filename: data['result'][x]['filename'],
              id: data['result'][x]['id'],
              det: det
            });
            this.filteremi.push({
              uuid: data['result'][x]['uuid'],
              tipo: data['result'][x]['tipo'],
              documento: (data['result'][x]['documento'] == undefined ? '' : data['result'][x]['documento']),
              receptor: data['result'][x]['receptor'].trim(),
              rfc: data['result'][x]['rfc'],
              total: formatNumber(data['result'][x]['total'],"en_US",'1.2'),
              totalsort: data['result'][x]['total'],
              fecha: this.datepipe.transform(data['result'][x]['fecha'],"dd/MM/yyyy HH:mm"),
              estado: data['result'][x]['estado'],
              file: data['result'][x]['file'],
              filename: data['result'][x]['filename'],
              id: data['result'][x]['id'],
              det: det
            });
            
          }
          if(data['result'][x]['emisor'] == this.selectedSearchPersonId && data['result'][x]['tipo'] == 'Nómina'){
            this.nominas.push({
              uuid: data['result'][x]['uuid'],
              tipo: data['result'][x]['tipo'],
              documento: (data['result'][x]['documento'] == undefined ? '' : data['result'][x]['documento']),
              receptor: data['result'][x]['receptor'].trim(),
              rfc: data['result'][x]['rfc'],
              total: formatNumber(data['result'][x]['total'],"en_US",'1.2'),
              totalsort: data['result'][x]['total'],
              fecha: this.datepipe.transform(data['result'][x]['fecha'],"dd/MM/yyyy HH:mm"),
              estado: data['result'][x]['estado'],
              file: data['result'][x]['file'],
              filename: data['result'][x]['filename'],
              id: data['result'][x]['id']
            });
            this.filternom.push({
              uuid: data['result'][x]['uuid'],
              tipo: data['result'][x]['tipo'],
              documento: (data['result'][x]['documento'] == undefined ? '' : data['result'][x]['documento']),
              receptor: data['result'][x]['receptor'].trim(),
              rfc: data['result'][x]['rfc'],
              total: formatNumber(data['result'][x]['total'],"en_US",'1.2'),
              totalsort: data['result'][x]['total'],
              fecha: this.datepipe.transform(data['result'][x]['fecha'],"dd/MM/yyyy HH:mm"),
              estado: data['result'][x]['estado'],
              file: data['result'][x]['file'],
              filename: data['result'][x]['filename'],
              id: data['result'][x]['id']
            });
          }
          if(data['result'][x]['receptor'] == this.selectedSearchPersonId){
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
            this.recibidas.push({
              uuid: data['result'][x]['uuid'],
              tipo: data['result'][x]['tipo'],
              documento: (data['result'][x]['documento'] == undefined ? '' : data['result'][x]['documento']),
              emisor: data['result'][x]['emisor'].trim(),
              rfc: data['result'][x]['rfc'],
              total: formatNumber(data['result'][x]['total'],"en_US",'1.2'),      
              totalsort: data['result'][x]['total'],        
              fecha: this.datepipe.transform(data['result'][x]['fecha'],"dd/MM/yyyy HH:mm"),
              estado: data['result'][x]['estado'],
              rubro: data['result'][x]['rubros'],
              file: data['result'][x]['file'],
              filename: data['result'][x]['filename'],
              id: data['result'][x]['id'],
              det: det
            });
            this.filterrec.push({
              uuid: data['result'][x]['uuid'],
              tipo: data['result'][x]['tipo'],
              documento: (data['result'][x]['documento'] == undefined ? '' : data['result'][x]['documento']),
              emisor: data['result'][x]['emisor'].trim(),
              rfc: data['result'][x]['rfc'],
              total: formatNumber(data['result'][x]['total'],"en_US",'1.2'),   
              totalsort: data['result'][x]['total'],
              fecha: this.datepipe.transform(data['result'][x]['fecha'],"dd/MM/yyyy HH:mm"),
              estado: data['result'][x]['estado'],
              rubro: data['result'][x]['rubros'],
              file: data['result'][x]['file'],
              filename: data['result'][x]['filename'],
              id: data['result'][x]['id'],
              det: det
            });
          }
        }
        this.emitidasblock.stop();
        this.recibidasblock.stop();
        this.nominasblock.stop();
      },error=>{
        if(error['status'] == '401'){
          // this.router.navigate(['/auth/login']);
          this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
            this.storage.saveToken(data['access_token']); 
            this.changePeriodos();
          });
        }
        this.emitidasblock.stop();
        this.recibidasblock.stop();
        this.nominasblock.stop();
      });
      
      this.historicoporperiodo.start('Cargando gráfica de histórico por periodo...'); 
      this.http.get(this.storage.getapi()+'config/getHistoricoMensual/'+this.selectedSearchPersonId+"/"+this.selectedejercicio+"/"+this.selectedperiodo).subscribe(data =>{                    
        this.PorPeriodo = true;   
        let lastday: any;
        let today = new Date();
        if(today.getMonth()+1 == this.selectedperiodo){ 
          lastday = today.getDate(); 
        }else{
          let fech = new Date(this.selectedejercicio,this.selectedperiodo,0);
          lastday = fech.getDate();
        }
        this.netPP =[];this.ingPP=[];this.egrPP=[];this.netTPP=[];this.ingTPP=[];this.egrTPP=[];   
        let labels = [];  
        for(let x=0;x<lastday;x++){
          labels.push((""+(x+1)).padStart(2,'0'));
          this.netPP.push(0);
          this.ingPP.push(0);
          this.egrPP.push(0);
          this.netTPP.push(0);
          this.ingTPP.push(0);
          this.egrTPP.push(0);
        }
        
        for (let value in data['result']){
          this.netPP[parseInt(value)-1] = data['result'][value]['neto'];
          this.ingPP[parseInt(value)-1] = data['result'][value]['ingresos'];
          this.egrPP[parseInt(value)-1] = data['result'][value]['egresos'];
          this.netTPP[parseInt(value)-1] = data['result'][value]['netoT'];
          this.ingTPP[parseInt(value)-1] = data['result'][value]['ingresosT'];
          this.egrTPP[parseInt(value)-1] = data['result'][value]['egresosT'];
        }
        
        let chartdata = [{
          label: 'Neto',
          data: this.netTPP,
          type: 'line'
        },{
          label: 'Ingresos',
          data: this.ingTPP,
          type: 'bar'
        },{
          label: 'Egresos',
          data: this.egrTPP,
          type: 'bar'
        }];
        this.mixedChartDataPP = chartdata;
        this.mixedChartLabelsPP = labels;
        this.historicoporperiodo.stop();        
      },error=>{
        if(error['status'] == '401'){
          // this.router.navigate(['/auth/login']);
          this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
            this.storage.saveToken(data['access_token']); 
            this.changePeriodos();
          });
        }
        this.historicoporperiodo.stop();
      });
      this.rubrosporperiodo.start('Cargando gráfica de rubros por periodo...');
      this.http.get(this.storage.getapi()+'config/getGraficaRubros/'+this.selectedSearchPersonId+"/"+this.selectedejercicio+"/"+this.selectedperiodo).subscribe(data =>{
        this.valores = [];
        this.etiquetas = [];
        this.valoresT = [];
        for(let x=0;x<data['result'].length;x++){
          this.valores.push((data['result'][x]['cuantasdos'] == null ? 0 : data['result'][x]['cuantasdos']));
          this.valoresT.push(data['result'][x]['cuantas']);
          this.etiquetas.push(data['result'][x]['rubros']);
        }
        this.donutChartOptions = {
          nonAxisSeries: this.valoresT,
          labels: this.etiquetas,
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  total: {
                    showAlways: true,
                    show: true
                  }
                }
              }
            }
          },
          chart: {
            height: 300,
            type: "donut",
          },
          stroke: {
            colors: ['rgba(0,0,0,0)']
          },
          legend: {
            position: 'right',
            horizontalAlign: 'center'
          },
          dataLabels: {
            enabled: true
          },
          tooltip: {
            enabled: true,
            y: {
              formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
                return '$ '+value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              }
            }
          }
        };
        this.rubrosporperiodo.stop();
      },error=>{
        if(error['status'] == '401'){
          // this.router.navigate(['/auth/login']);
          this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
            this.storage.saveToken(data['access_token']); 
            this.changePeriodos();
          });
        }
        this.rubrosporperiodo.stop();
      });

    }
  }

  showTotalesh(e){
    if(!e.currentTarget.checked){
      let chartdata = [{
        label: 'Neto',
        data: this.netT,
        type: 'line'
      },{
        label: 'Ingresos',
        data: this.ingT,
        type: 'bar'
      },{
        label: 'Egresos',
        data: this.egrT,
        type: 'bar'
      }];
      this.mixedChartData = chartdata;
      let chartdataPP = [{
        label: 'Neto',
        data: this.netTPP,
        type: 'line'
      },{
        label: 'Ingresos',
        data: this.ingTPP,
        type: 'bar'
      },{
        label: 'Egresos',
        data: this.egrTPP,
        type: 'bar'
      }];
      this.mixedChartDataPP = chartdataPP;
    }else{     
      let chartdata = [{
        label: 'Neto',
        data: this.net,
        type: 'line'
      },{
        label: 'Ingresos',
        data: this.ing,
        type: 'bar'
      },{
        label: 'Egresos',
        data: this.egr,
        type: 'bar'
      }];
      this.mixedChartData = chartdata;
      let chartdataPP = [{
        label: 'Neto',
        data: this.netPP,
        type: 'line'
      },{
        label: 'Ingresos',
        data: this.ingPP,
        type: 'bar'
      },{
        label: 'Egresos',
        data: this.egrPP,
        type: 'bar'
      }];
      this.mixedChartDataPP = chartdataPP;
    } 
  }
  showTotalesr(e){
    if(!e.currentTarget.checked){
      this.donutChartOptions = {
        nonAxisSeries: this.valoresT,
        labels: this.etiquetas,
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                total: {
                  showAlways: true,
                  show: true
                }
              }
            }
          }
        },
        chart: {
          height: 300,
          type: "donut",
        },
        stroke: {
          colors: ['rgba(0,0,0,0)']
        },
        legend: {
          position: 'right',
          horizontalAlign: 'center'
        },
        dataLabels: {
          enabled: true
        },
        tooltip: {
          enabled: true,
          y: {
            formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
              return '$ '+value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
          }
        }
      };      
    }else{
      this.donutChartOptions = {
        nonAxisSeries: this.valores,
        labels: this.etiquetas,
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                total: {
                  showAlways: true,
                  show: true
                }
              }
            }
          }
        },
        chart: {
          height: 300,
          type: "donut",
        },
        stroke: {
          colors: ['rgba(0,0,0,0)']
        },
        legend: {
          position: 'right',
          horizontalAlign: 'center'
        },
        dataLabels: {
          enabled: true
        },
        tooltip: {
          enabled: true,
          y: {
            formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
              return '$ '+value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
          }
        }
      };      
    } 
  }

  downloadFile(row: any,tabla: any){
    
    let filename = row.filename;
    let formData:FormData = new FormData();
    formData.append('archivo', row.file);
    formData.append('filename', row.filename);
    formData.append('rfc',this.selectedSearchPersonId);
    // this.blockUIService.start(row.id,'Descargando XML...');
    this.startToast('info','Descargando XML...');
    this.http.post(this.storage.getapi()+"config/descargararchivo",formData,{responseType:'arraybuffer'}).subscribe(data=>{      
      const blob = new Blob([data], {type: 'application/octet-stream'});
      saveAs(blob, filename);
      // this.blockUIService.stop(row.id);
    },error=>{
      if(error['status'] == '401'){
        // this.router.navigate(['/auth/login']);
        this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
          this.storage.saveToken(data['access_token']); 
          this.downloadFile(row,tabla);
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

  toggleExpandRow(row) {    
    if(this.currentrow == undefined){
      this.currentrow = row;
    }
    if(this.currentrow != row){
      this.table.rowDetail.collapseAllRows();
    }
    this.currentrow = row;
    this.table.rowDetail.toggleExpandRow(row);
  }

  getRowHeight(row) {
    return row.height;
  }

  exportPDFEmitido(row,tipo){
    let parseString = require('xml2js').parseString;
    let activeXML = '';
    parseString(row['file'], function (err, result) {
      console.dir(result);
      activeXML = result;
    });
     
    let content: any = [];
   
    
    if(this.logo != '' && this.logo != undefined && this.logo != null){
      
     
      content.push({
        table: {
          widths: ['20%','55%','25%'],
          // keepWithHeaderRows: 1,
          body: [
            [{image: this.logo, width: 100, height: (this.cuadrado == 1 ? 100 : 60), rowSpan:8,border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'Emisor Del Comprobante Fiscal',fillColor: '#7aacf7',color:"white"},{fontSize: 10,text:'Documento',alignment:"center",border: [true,true,true,true],fillColor: '#7aacf7',color:"white"}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'Nombre: '+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["Nombre"]},{fontSize: 10,text:(activeXML["cfdi:Comprobante"]["$"]["Serie"] != undefined ? activeXML["cfdi:Comprobante"]["$"]["Serie"]+" - " : "")+activeXML["cfdi:Comprobante"]["$"]["Folio"],alignment:"center",border: [true,true,true,true],color: 'red'}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'RFC: '+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["Rfc"]},{fontSize: 10,text:"Fecha de Emisión",alignment:"center",border: [true,true,true,true],fillColor: '#7aacf7',color:"white"}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'Régimen Fiscal: '+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["RegimenFiscal"]+" Lugar de expedición: "+activeXML["cfdi:Comprobante"]["$"]["LugarExpedicion"]},{fontSize: 10,text:activeXML["cfdi:Comprobante"]["$"]["Fecha"],alignment:"center",border: [true,true,true,true]}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'CFDI Relacionado',fillColor: '#7aacf7',color:"white"},{fontSize: 10,text:'Fecha de Certificación',alignment:"center",border: [true,true,true,true],fillColor: '#7aacf7',color:"white"}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'Tipo relación: '},{fontSize: 10,text:activeXML['cfdi:Comprobante']["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["FechaTimbrado"],alignment:"center",border: [true,true,true,true]}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'CFDI Relacionado: '},{fontSize: 10,text:"Tipo de comprobante",alignment:"center",border: [true,true,true,true],fillColor: '#7aacf7',color:"white"}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:''},{fontSize: 10,text:'Ingreso',alignment:"center",border: [true,true,true,true]}]
          ]
        }
      });
    }else{
      console.log(this.logo);
      content.push({
        table: {
          widths: ['20%','55%','25%'],
          // keepWithHeaderRows: 1,
          body: [
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'Emisor Del Comprobante Fiscal',fillColor: '#7aacf7',color:"white"},{fontSize: 10,text:'Documento',alignment:"center",border: [true,true,true,true],fillColor: '#7aacf7',color:"white"}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'Nombre: '+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["Nombre"]},{fontSize: 10,text:(activeXML["cfdi:Comprobante"]["$"]["Serie"] != undefined ? activeXML["cfdi:Comprobante"]["$"]["Serie"]+" - " : "")+activeXML["cfdi:Comprobante"]["$"]["Folio"],alignment:"center",border: [true,true,true,true],color: 'red'}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'RFC: '+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["Rfc"]},{fontSize: 10,text:"Fecha de Emisión",alignment:"center",border: [true,true,true,true],fillColor: '#7aacf7',color:"white"}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'Régimen Fiscal: '+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["RegimenFiscal"]+" Lugar de expedición: "+activeXML["cfdi:Comprobante"]["$"]["LugarExpedicion"]},{fontSize: 10,text:activeXML["cfdi:Comprobante"]["$"]["Fecha"],alignment:"center",border: [true,true,true,true]}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'CFDI Relacionado',fillColor: '#7aacf7',color:"white"},{fontSize: 10,text:'Fecha de Certificación',alignment:"center",border: [true,true,true,true],fillColor: '#7aacf7',color:"white"}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'Tipo relación: '},{fontSize: 10,text:activeXML['cfdi:Comprobante']["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["FechaTimbrado"],alignment:"center",border: [true,true,true,true]}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'CFDI Relacionado: '},{fontSize: 10,text:"Tipo de comprobante",alignment:"center",border: [true,true,true,true],fillColor: '#7aacf7',color:"white"}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:''},{fontSize: 10,text:'Ingreso',alignment:"center",border: [true,true,true,true]}]
          ]
        }
      });
    }
    
    content.push({
      table: {
        widths: ['10%'],
        // keepWithHeaderRows: 1,
        body: [                
          [{text:'',height: 100,fontSize: 10, style: 'tableHeader', alignment: 'left'}]                
        ]
      },
      layout: 'noBorders'
    });
    content.push({
      table: {
        widths: ['50%','50%'],
        // keepWithHeaderRows: 1,
        body: [
          [{fontSize: 10,text:'Receptor Del Comprobante Fiscal',fillColor: '#7aacf7',color:"white"},{fontSize: 10,text:'Folio Fiscal',fillColor: '#7aacf7',color:"white"}],
          [{fontSize: 10,text:'Nombre: '+activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]["Nombre"]},{fontSize: 10,text:activeXML['cfdi:Comprobante']["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["UUID"]}],
          [{fontSize: 10,text:'RFC: '+activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]["Rfc"]},{fontSize: 10,text:"No. Certificado Digital",fillColor: '#7aacf7',color:"white"}],
          [{fontSize: 10,text:'Residencia Fiscal: '},{fontSize: 10,text:activeXML["cfdi:Comprobante"]["$"]["NoCertificado"]}],
          [{fontSize: 10,text:'NumRegIdTrib:'},{fontSize: 10,text:'No. Certificado SAT',fillColor: '#7aacf7',color:"white"}],
          [{fontSize: 10,text:'Uso CFDI: '+activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]["UsoCFDI"]+" - "+this.usoCFDI[0][activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]["UsoCFDI"]]},{fontSize: 10,text:activeXML['cfdi:Comprobante']["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["NoCertificadoSAT"]}]
        ]
      },
      layout: 'noBorders'
    });
    content.push({
      table: {
        widths: ['10%'],
        // keepWithHeaderRows: 1,
        body: [                
          [{text:'',height: 100,fontSize: 10, style: 'tableHeader', alignment: 'left'}]                
        ]
      },
      layout: 'noBorders'
    });
    if(activeXML["cfdi:Comprobante"]["$"]["TipoDeComprobante"] != 'P'){
      content.push({
        table: {
          widths: ['10%','10%','10%','10%','10%','20%','10%','10%','10%'],
          // keepWithHeaderRows: 1,
          body: [
            [{fontSize: 8,text:'ClvProdServ',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'NoIdent',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'Cantidad',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'Clv. Unidad',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'Unidad',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'Descripcion',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'Valor U.',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'Descuento',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'Importe',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            ],
          ]
        }
      });
      let concepts = [];
      let det = [];
      for(let y=0;y<activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'].length;y++){
        det = [];
        det.push({text: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ClaveProdServ"],fontSize: 8,border: [true,true,true,true]});
        det.push({text: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["NoIdentificacion"],fontSize: 8,border: [true,true,true,true]});
        det.push({text: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Cantidad"],fontSize: 8,border: [true,true,true,true]});
        det.push({text: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ClaveUnidad"],fontSize: 8,border: [true,true,true,true]});
        det.push({text: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Unidad"],fontSize: 8,border: [true,true,true,true]});
        det.push({text: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Descripcion"],fontSize: 8,border: [true,true,true,true]});
        det.push({text: formatNumber(parseFloat(activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ValorUnitario"]),"en_US","1.2"),fontSize: 8,border: [true,true,true,true]});      
        det.push({text: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Descuento"],fontSize: 8,border: [true,true,true,true]});
        det.push({text: formatNumber(parseFloat(activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Importe"]),"en_US","1.2"),fontSize: 8,border: [true,true,true,true]});
        concepts.push(det);
      }
      det = [];
      det.push({fontSize: 10, colSpan:9, text:'Importe en letra: '+ this.num2letras(activeXML['cfdi:Comprobante']["$"]["Total"]),border: [true,true,true,true]});
      concepts.push(det);
      content.push({
        table: {
          widths: ['10%','10%','10%','10%','10%','20%','10%','10%','10%'],
          // keepWithHeaderRows: 1,
          body: concepts
        }
      });
      let qr = '?re='+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["Rfc"]+'&rr='+activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]["Rfc"]+'&tt='+activeXML['cfdi:Comprobante']["$"]["Total"]+'&id='+activeXML['cfdi:Comprobante']["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["UUID"];
      let IEPS: any = 0;
      let IVA: any = 0;
      let retISR: any = 0;
      let retIVA: any = 0;
      if(activeXML["cfdi:Comprobante"]["$"]["TipoDeComprobante"] != 'P'){
        if(activeXML["cfdi:Comprobante"]["cfdi:Impuestos"][0] != ''){      
          for(let ind=0;ind<activeXML["cfdi:Comprobante"]["cfdi:Impuestos"][0]["cfdi:Traslados"][0]["cfdi:Traslado"].length;ind++){
            if(activeXML["cfdi:Comprobante"]["cfdi:Impuestos"][0]["cfdi:Traslados"][0]["cfdi:Traslado"][ind]["$"]["Impuesto"] == '002'){
              if(activeXML["cfdi:Comprobante"]["cfdi:Impuestos"][0]["cfdi:Traslados"][0]["cfdi:Traslado"][ind]["$"]["Importe"] > 0) {
                IVA = formatNumber(activeXML["cfdi:Comprobante"]["cfdi:Impuestos"][0]["cfdi:Traslados"][0]["cfdi:Traslado"][ind]["$"]["Importe"],"en_US","1.2");
              }
              
            }else if(activeXML["cfdi:Comprobante"]["cfdi:Impuestos"][0]["cfdi:Traslados"][0]["cfdi:Traslado"][ind]["$"]["Impuesto"] == '003'){
              IEPS = formatNumber(activeXML["cfdi:Comprobante"]["cfdi:Impuestos"][0]["cfdi:Traslados"][0]["cfdi:Traslado"][ind]["$"]["Importe"],"en_US","1.2");
            }
          }
        }
      }
      content.push({
        table: {
          widths: ['30%','45%','15%','10%'],
          // keepWithHeaderRows: 1,
          body: [
            [{qr: qr,fit: '180', border: [false,false,false,false],rowSpan:8},{border: [true,true,true,true],fontSize: 10,text:'Forma de Pago: '+this.formasdepago[0][activeXML["cfdi:Comprobante"]["$"]["FormaPago"]]},{border: [true,true,true,true],fontSize: 10,text:'Subtotal:'},{fontSize: 10,text:formatNumber(activeXML["cfdi:Comprobante"]["$"]["SubTotal"],"en_US","1.2"),alignment:"right"}],
            [{text: ''},{border: [true,true,true,true],fontSize: 10,text:'Método de pago: '+(activeXML["cfdi:Comprobante"]["$"]["FormaPago"] == 'PUE' ? 'PUE - Pago en una sola exhibición' : 'PPD - Pago en parcialidades o diferido')},{fontSize:10,text: 'Descuento'},{fontSize: 10,text:formatNumber((activeXML["cfdi:Comprobante"]["$"]["Descuento"] != undefined ? activeXML["cfdi:Comprobante"]["$"]["Descuento"] : 0),"en_US","1.2"),alignment:"right"}],
            [{text: ''},{border: [true,true,true,true],fontSize: 10,text:'Condición de pago: '+(activeXML["cfdi:Comprobante"]["$"]["CondicionesDePago"] == undefined ? '' :activeXML["cfdi:Comprobante"]["$"]["CondicionesDePago"])},{border: [true,true,true,true],fontSize: 10,text:"IEPS:"},{border: [true,true,true,true],fontSize: 10, text:IEPS,alignment:"right"}],
            [{text: ''},{border: [true,true,true,true],fontSize: 10,text:'Moneda: '+activeXML["cfdi:Comprobante"]["$"]["Moneda"]},{border: [true,true,true,true],fontSize: 10,text:"IVA:"},{border: [true,true,true,true],fontSize: 10, text:IVA,alignment:"right"}],
            [{text: ''},{border: [true,true,true,true],fontSize: 10,text:'Versión del comprobante: '+activeXML["cfdi:Comprobante"]["$"]["Version"]},{border: [true,true,true,true],fontSize: 10,text:"Retensiones ISR:"},{border: [true,true,true,true],fontSize: 10, text:0,alignment:"right"}],
            [{text: ''},{border: [true,true,true,true],fontSize: 10,text:'Tipo de cambio: '+(activeXML["cfdi:Comprobante"]["$"]["TipoCambio"] == undefined ? 1 : activeXML["cfdi:Comprobante"]["$"]["TipoCambio"])},{border: [true,true,true,true],fontSize: 10,text:"Retensiones IVA:"},{border: [true,true,true,true],fontSize: 10, text:0,alignment:"right"}],
            [{text: ''},{border: [true,true,true,true],fontSize: 10,text:'Clave confirmación: '},{border: [true,true,true,true],fontSize: 10,text:"Total:"},{border: [true,true,true,true],fontSize: 10, text:formatNumber(activeXML["cfdi:Comprobante"]["$"]["Total"],"en_US","1.2"),alignment:"right"}],
            [{text: ''},{border: [true,true,true,true],fontSize: 10, colSpan:3,text:'Este documento es una representación impresa de un CFDI, la reproduccion no autorizada de este comprobante constituye un delito en los terminos de las disposiciones fiscales'}],
          ]
        }
      });
    }
    if(activeXML["cfdi:Comprobante"]["$"]["TipoDeComprobante"] == 'P'){
      content.push({
        table: {
          widths: ['100%'],
          // keepWithHeaderRows: 1,
          body: [
            [{fontSize: 8,text:'Información del Pago',border: [true,true,true,true],aligment: 'center',fillColor: '#7aacf7',color:"white"}],
          ]
        }
      });
      content.push({
        table: {
          widths: ['25%','25%','25%','25%'],
          // keepWithHeaderRows: 1,
          body: [
            [{fontSize: 8,text:'Pago Monto:'+formatNumber(activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["Monto"],"en_US","1.2")},
              {fontSize: 8,text:'Moneda Pago:'+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["MonedaP"]},
              {fontSize: 8,text:'Forma de Pago:'+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["FormaDePagoP"]},
              {fontSize: 8,text:'Fecha de Pago:'+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["FechaPago"]}],
            [{fontSize: 8,text:'Num. Operación:'+(activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["NumOperacion"] != undefined ? activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["NumOperacion"] : '')},
              {fontSize: 8,text:'RFC Emisor Cta. Ben:'+(activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["RfcEmisorCtaBen"] != undefined ? activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["RfcEmisorCtaBen"] : '')},
              {fontSize: 8,text:'RFC Emisor Cta. Ord:'+(activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["RfcEmisorCtaOrd"] != undefined ? activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["RfcEmisorCtaOrd"] : '')},
              {fontSize: 8,text:'Cta. Ordenante:'+(activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["CtaOrdenante"] != undefined ? activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["CtaOrdenante"] : '')}]
          ]
        },
        layout: 'noBorders'
      });
      content.push({
        table: {
          widths: ['20%','10%','10%','10%','10%','10%','10%','10%','10%'],
          // keepWithHeaderRows: 1,
          body: [
            [{fontSize: 8,text:'IdDocumento',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'Serie',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'Folio',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'Moneda DR',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'MetodoDePagoDR',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'NumParcialidad',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'ImpSaldoAnt',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'ImpPagado',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'ImpSaldoInsoluto',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            ],
          ]
        }
      });
      let concepts = [];
      let det = [];
      for(let y=0;y<activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["pago10:DoctoRelacionado"].length;y++){
        det = [];
        det.push({text: activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["pago10:DoctoRelacionado"][y]["$"]['IdDocumento'],fontSize: 8,border: [true,true,true,true]});
        det.push({text: activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["pago10:DoctoRelacionado"][y]["$"]['Serie'],fontSize: 8,border: [true,true,true,true]});
        det.push({text: activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["pago10:DoctoRelacionado"][y]["$"]['Folio'],fontSize: 8,border: [true,true,true,true]});
        det.push({text: activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["pago10:DoctoRelacionado"][y]["$"]['MonedaDR'],fontSize: 8,border: [true,true,true,true]});
        det.push({text: activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["pago10:DoctoRelacionado"][y]["$"]['MetodoDePagoDR'],fontSize: 8,border: [true,true,true,true]});
        det.push({text: activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["pago10:DoctoRelacionado"][y]["$"]['NumParcialidad'],fontSize: 8,border: [true,true,true,true]});
        det.push({text: formatNumber(parseFloat(activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["pago10:DoctoRelacionado"][y]["$"]['ImpSaldoAnt']),"en_US","1.2"),fontSize: 8,border: [true,true,true,true]});      
        det.push({text: formatNumber(parseFloat(activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["pago10:DoctoRelacionado"][y]["$"]['ImpPagado']),"en_US","1.2"),fontSize: 8,border: [true,true,true,true]});
        det.push({text: formatNumber(parseFloat(activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["pago10:DoctoRelacionado"][y]["$"]['ImpSaldoInsoluto']),"en_US","1.2"),fontSize: 8,border: [true,true,true,true]});
        concepts.push(det);
      }
      det = [];
      det.push({fontSize: 10, colSpan:9, text:'Importe en letra: CERO PESOS CON 00/100 M.N',border: [true,true,true,true]});
      concepts.push(det);
      content.push({
        table: {
          widths: ['20%','10%','10%','10%','10%','10%','10%','10%','10%'],
          // keepWithHeaderRows: 1,
          body: concepts
        }
      });
      let qr = '?re='+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["Rfc"]+'&rr='+activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]["Rfc"]+'&tt='+activeXML['cfdi:Comprobante']["$"]["Total"]+'&id='+activeXML['cfdi:Comprobante']["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["UUID"];
      let IEPS: any = 0;
      let IVA: any = 0;
      let retISR: any = 0;
      let retIVA: any = 0;
      content.push({
        table: {
          widths: ['30%','45%','15%','10%'],
          // keepWithHeaderRows: 1,
          body: [
            [{qr: qr,fit: '150', border: [false,false,false,false],rowSpan:8},{border: [true,true,true,true],fontSize: 10,text:'Forma de Pago: '},{border: [true,true,true,true],fontSize: 10,text:'Subtotal:'},{fontSize: 10,text:0,alignment:"right"}],
            [{text: ''},{border: [true,true,true,true],fontSize: 10,text:'Método de pago: '},{fontSize:10,text: 'Descuento'},{fontSize: 10,text:0,alignment:"right"}],
            [{text: ''},{border: [true,true,true,true],fontSize: 10,text:'Condición de pago: '},{border: [true,true,true,true],fontSize: 10,text:"IEPS:"},{border: [true,true,true,true],fontSize: 10, text:IEPS,alignment:"right"}],
            [{text: ''},{border: [true,true,true,true],fontSize: 10,text:'Moneda: XXX'},{border: [true,true,true,true],fontSize: 10,text:"IVA:"},{border: [true,true,true,true],fontSize: 10, text:IVA,alignment:"right"}],
            [{text: ''},{border: [true,true,true,true],fontSize: 10,text:'Versión del comprobante: '+activeXML["cfdi:Comprobante"]["$"]["Version"]},{border: [true,true,true,true],fontSize: 10,text:"Retensiones ISR:"},{border: [true,true,true,true],fontSize: 10, text:0,alignment:"right"}],
            [{text: ''},{border: [true,true,true,true],fontSize: 10,text:'Tipo de cambio: '},{border: [true,true,true,true],fontSize: 10,text:"Retensiones IVA:"},{border: [true,true,true,true],fontSize: 10, text:0,alignment:"right"}],
            [{text: ''},{border: [true,true,true,true],fontSize: 10,text:'Clave confirmación: '},{border: [true,true,true,true],fontSize: 10,text:"Total:"},{border: [true,true,true,true],fontSize: 10, text:0,alignment:"right"}],
            [{text: ''},{border: [true,true,true,true],fontSize: 10, colSpan:3,text:'Este documento es una representación impresa de un CFDI, la reproduccion no autorizada de este comprobante constituye un delito en los terminos de las disposiciones fiscales'}],
          ]
        }
      });
    }
    content.push({
      table: {
        widths: ['100%'],
        // keepWithHeaderRows: 1,
        body: [
          [{fontSize: 10,text:'Sello Digital CFDI'}],
          [{fontSize: 8,text:activeXML["cfdi:Comprobante"]["$"]["Sello"]}],
          [{fontSize: 10,text:'Sello Digital del SAT'}],
          [{fontSize: 8,text:activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["SelloSAT"]}],
          [{fontSize: 10,text:'Cadena Original del complemento de certificación digital del SAT'}],
          [{fontSize: 8,text:'||1.1|'+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["UUID"]+
                              '|'+activeXML['cfdi:Comprobante']["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["FechaTimbrado"]+
                              '|'+activeXML["cfdi:Comprobante"]["$"]["Sello"]+
                              '|'+activeXML['cfdi:Comprobante']["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["NoCertificadoSAT"]+"||"
          }]
        ]
      },
      layout: 'noBorders'
    });

    let docDefinition = {        
      pageMargins: [20,20,20,20],
      content: content
    }
    pdfMake.createPdf(docDefinition).open();
  }

  exportPDFRecibido(row,tipo){
    let parseString = require('xml2js').parseString;
    let activeXML = '';
    parseString(row['file'], function (err, result) {
      console.dir(result);
      activeXML = result;
    });
    let content: any = [];
    if(this.logo != '' && this.logo != undefined && this.logo != null){
      content.push({
        table: {
          widths: ['20%','55%','25%'],
          // keepWithHeaderRows: 1,
          body: [
            [{image: this.logo, width: 100, height: (this.cuadrado == 1 ? 100 : 60), rowSpan:8,border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'Emisor Del Comprobante Fiscal',fillColor: '#7aacf7',color:"white"},{fontSize: 10,text:'Documento',alignment:"center",border: [true,true,true,true],fillColor: '#7aacf7',color:"white"}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'Nombre: '+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["Nombre"]},{fontSize: 10,text:(activeXML["cfdi:Comprobante"]["$"]["Serie"] != undefined ? activeXML["cfdi:Comprobante"]["$"]["Serie"]+" - " : "")+(activeXML["cfdi:Comprobante"]["$"]["Folio"] != undefined ? activeXML["cfdi:Comprobante"]["$"]["Folio"] : '' ),alignment:"center",border: [true,true,true,true],color: 'red'}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'RFC: '+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["Rfc"]},{fontSize: 10,text:"Fecha de Emisión",alignment:"center",border: [true,true,true,true],fillColor: '#7aacf7',color:"white"}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'Régimen Fiscal: '+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["RegimenFiscal"]+" Lugar de expedición: "+activeXML["cfdi:Comprobante"]["$"]["LugarExpedicion"]},{fontSize: 10,text:activeXML["cfdi:Comprobante"]["$"]["Fecha"],alignment:"center",border: [true,true,true,true]}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'CFDI Relacionado',fillColor: '#7aacf7',color:"white"},{fontSize: 10,text:'Fecha de Certificación',alignment:"center",border: [true,true,true,true],fillColor: '#7aacf7',color:"white"}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'Tipo relación: '},{fontSize: 10,text:activeXML['cfdi:Comprobante']["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["FechaTimbrado"],alignment:"center",border: [true,true,true,true]}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'CFDI Relacionado: '},{fontSize: 10,text:"Tipo de comprobante",alignment:"center",border: [true,true,true,true],fillColor: '#7aacf7',color:"white"}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:''},{fontSize: 10,text:'Ingreso',alignment:"center",border: [true,true,true,true]}]
          ]
        }
      });
    }else{
      content.push({
        table: {
          widths: ['20%','55%','25%'],
          // keepWithHeaderRows: 1,
          body: [
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'Emisor Del Comprobante Fiscal',fillColor: '#7aacf7',color:"white"},{fontSize: 10,text:'Documento',alignment:"center",border: [true,true,true,true],fillColor: '#7aacf7',color:"white"}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'Nombre: '+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["Nombre"]},{fontSize: 10,text:(activeXML["cfdi:Comprobante"]["$"]["Serie"] != undefined ? activeXML["cfdi:Comprobante"]["$"]["Serie"]+" - " : "")+(activeXML["cfdi:Comprobante"]["$"]["Folio"] != undefined ? activeXML["cfdi:Comprobante"]["$"]["Folio"] : '' ),alignment:"center",border: [true,true,true,true],color: 'red'}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'RFC: '+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["Rfc"]},{fontSize: 10,text:"Fecha de Emisión",alignment:"center",border: [true,true,true,true],fillColor: '#7aacf7',color:"white"}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'Régimen Fiscal: '+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["RegimenFiscal"]+" Lugar de expedición: "+activeXML["cfdi:Comprobante"]["$"]["LugarExpedicion"]},{fontSize: 10,text:activeXML["cfdi:Comprobante"]["$"]["Fecha"],alignment:"center",border: [true,true,true,true]}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'CFDI Relacionado',fillColor: '#7aacf7',color:"white"},{fontSize: 10,text:'Fecha de Certificación',alignment:"center",border: [true,true,true,true],fillColor: '#7aacf7',color:"white"}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'Tipo relación: '},{fontSize: 10,text:activeXML['cfdi:Comprobante']["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["FechaTimbrado"],alignment:"center",border: [true,true,true,true]}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'CFDI Relacionado: '},{fontSize: 10,text:"Tipo de comprobante",alignment:"center",border: [true,true,true,true],fillColor: '#7aacf7',color:"white"}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:''},{fontSize: 10,text:'Ingreso',alignment:"center",border: [true,true,true,true]}]
          ]
        }
      });
    }
    content.push({
      table: {
        widths: ['10%'],
        // keepWithHeaderRows: 1,
        body: [                
          [{text:'',height: 100,fontSize: 10, style: 'tableHeader', alignment: 'left'}]                
        ]
      },
      layout: 'noBorders'
    });
    content.push({
      table: {
        widths: ['50%','50%'],
        // keepWithHeaderRows: 1,
        body: [
          [{fontSize: 10,text:'Receptor Del Comprobante Fiscal',fillColor: '#7aacf7',color:"white"},{fontSize: 10,text:'Folio Fiscal',fillColor: '#7aacf7',color:"white"}],
          [{fontSize: 10,text:'Nombre: '+activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]["Nombre"]},{fontSize: 10,text:activeXML['cfdi:Comprobante']["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["UUID"]}],
          [{fontSize: 10,text:'RFC: '+activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]["Rfc"]},{fontSize: 10,text:"No. Certificado Digital",fillColor: '#7aacf7',color:"white"}],
          [{fontSize: 10,text:'Residencia Fiscal: '},{fontSize: 10,text:activeXML["cfdi:Comprobante"]["$"]["NoCertificado"]}],
          [{fontSize: 10,text:'NumRegIdTrib:'},{fontSize: 10,text:'No. Certificado SAT',fillColor: '#7aacf7',color:"white"}],
          [{fontSize: 10,text:'Uso CFDI: '+activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]["UsoCFDI"]+" - "+this.usoCFDI[0][activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]["UsoCFDI"]]},{fontSize: 10,text:activeXML['cfdi:Comprobante']["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["NoCertificadoSAT"]}]
        ]
      },
      layout: 'noBorders'
    });
    content.push({
      table: {
        widths: ['10%'],
        // keepWithHeaderRows: 1,
        body: [                
          [{text:'',height: 100,fontSize: 10, style: 'tableHeader', alignment: 'left'}]                
        ]
      },
      layout: 'noBorders'
    });
    if(activeXML["cfdi:Comprobante"]["$"]["TipoDeComprobante"] != 'P'){
      content.push({
        table: {
          widths: ['10%','10%','10%','10%','10%','20%','10%','10%','10%'],
          // keepWithHeaderRows: 1,
          body: [
            [{fontSize: 8,text:'ClvProdServ',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'NoIdent',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'Cantidad',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'Clv. Unidad',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'Unidad',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'Descripcion',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'Valor U.',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'Descuento',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'Importe',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            ],
          ]
        }
      });
      let concepts = [];
      let det = [];
      for(let y=0;y<activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'].length;y++){
        det = [];
        det.push({text: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ClaveProdServ"],fontSize: 8,border: [true,true,true,true]});
        det.push({text: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["NoIdentificacion"],fontSize: 8,border: [true,true,true,true]});
        det.push({text: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Cantidad"],fontSize: 8,border: [true,true,true,true]});
        det.push({text: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ClaveUnidad"],fontSize: 8,border: [true,true,true,true]});
        det.push({text: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Unidad"],fontSize: 8,border: [true,true,true,true]});
        det.push({text: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Descripcion"],fontSize: 8,border: [true,true,true,true]});
        det.push({text: formatNumber(parseFloat(activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["ValorUnitario"]),"en_US","1.2"),fontSize: 8,border: [true,true,true,true]});      
        det.push({text: activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Descuento"],fontSize: 8,border: [true,true,true,true]});
        det.push({text: formatNumber(parseFloat(activeXML['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][y]['$']["Importe"]),"en_US","1.2"),fontSize: 8,border: [true,true,true,true]});
        concepts.push(det);
      }
      det = [];
      det.push({fontSize: 10, colSpan:9, text:'Importe en letra: '+ this.num2letras(activeXML['cfdi:Comprobante']["$"]["Total"]),border: [true,true,true,true]});
      concepts.push(det);
      content.push({
        table: {
          widths: ['10%','10%','10%','10%','10%','20%','10%','10%','10%'],
          // keepWithHeaderRows: 1,
          body: concepts
        }
      });
      let qr = '?re='+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["Rfc"]+'&rr='+activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]["Rfc"]+'&tt='+activeXML['cfdi:Comprobante']["$"]["Total"]+'&id='+activeXML['cfdi:Comprobante']["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["UUID"];
      let IEPS: any = 0;
      let IVA: any = 0;
      let retISR: any = 0;
      let retIVA: any = 0;
      if(activeXML["cfdi:Comprobante"]["$"]["TipoDeComprobante"] != 'P'){
        if(activeXML["cfdi:Comprobante"]["cfdi:Impuestos"][0] != ''){      
          for(let ind=0;ind<activeXML["cfdi:Comprobante"]["cfdi:Impuestos"][0]["cfdi:Traslados"][0]["cfdi:Traslado"].length;ind++){
            if(activeXML["cfdi:Comprobante"]["cfdi:Impuestos"][0]["cfdi:Traslados"][0]["cfdi:Traslado"][ind]["$"]["Impuesto"] == '002'){
              if(activeXML["cfdi:Comprobante"]["cfdi:Impuestos"][0]["cfdi:Traslados"][0]["cfdi:Traslado"][ind]["$"]["Importe"] > 0){
                IVA = formatNumber(activeXML["cfdi:Comprobante"]["cfdi:Impuestos"][0]["cfdi:Traslados"][0]["cfdi:Traslado"][ind]["$"]["Importe"],"en_US","1.2");
              }
             
            }else if(activeXML["cfdi:Comprobante"]["cfdi:Impuestos"][0]["cfdi:Traslados"][0]["cfdi:Traslado"][ind]["$"]["Impuesto"] == '003'){
              IEPS = formatNumber(activeXML["cfdi:Comprobante"]["cfdi:Impuestos"][0]["cfdi:Traslados"][0]["cfdi:Traslado"][ind]["$"]["Importe"],"en_US","1.2");
            }
          }
        }
      }
      content.push({
        table: {
          widths: ['30%','45%','15%','10%'],
          // keepWithHeaderRows: 1,
          body: [
            [{qr: qr,fit: '180', border: [false,false,false,false],rowSpan:8},{border: [true,true,true,true],fontSize: 10,text:'Forma de Pago: '+this.formasdepago[0][activeXML["cfdi:Comprobante"]["$"]["FormaPago"]]},{border: [true,true,true,true],fontSize: 10,text:'Subtotal:'},{fontSize: 10,text:formatNumber(activeXML["cfdi:Comprobante"]["$"]["SubTotal"],"en_US","1.2"),alignment:"right"}],
            [{text: ''},{border: [true,true,true,true],fontSize: 10,text:'Método de pago: '+(activeXML["cfdi:Comprobante"]["$"]["FormaPago"] == 'PUE' ? 'PUE - Pago en una sola exhibición' : 'PPD - Pago en parcialidades o diferido')},{fontSize:10,text: 'Descuento'},{fontSize: 10,text:formatNumber((activeXML["cfdi:Comprobante"]["$"]["Descuento"] != undefined ? activeXML["cfdi:Comprobante"]["$"]["Descuento"] : 0),"en_US","1.2"),alignment:"right"}],
            [{text: ''},{border: [true,true,true,true],fontSize: 10,text:'Condición de pago: '+(activeXML["cfdi:Comprobante"]["$"]["CondicionesDePago"] == undefined ? '' :activeXML["cfdi:Comprobante"]["$"]["CondicionesDePago"])},{border: [true,true,true,true],fontSize: 10,text:"IEPS:"},{border: [true,true,true,true],fontSize: 10, text:IEPS,alignment:"right"}],
            [{text: ''},{border: [true,true,true,true],fontSize: 10,text:'Moneda: '+activeXML["cfdi:Comprobante"]["$"]["Moneda"]},{border: [true,true,true,true],fontSize: 10,text:"IVA:"},{border: [true,true,true,true],fontSize: 10, text:IVA,alignment:"right"}],
            [{text: ''},{border: [true,true,true,true],fontSize: 10,text:'Versión del comprobante: '+activeXML["cfdi:Comprobante"]["$"]["Version"]},{border: [true,true,true,true],fontSize: 10,text:"Retensiones ISR:"},{border: [true,true,true,true],fontSize: 10, text:0,alignment:"right"}],
            [{text: ''},{border: [true,true,true,true],fontSize: 10,text:'Tipo de cambio: '+(activeXML["cfdi:Comprobante"]["$"]["TipoCambio"] == undefined ? 1 : activeXML["cfdi:Comprobante"]["$"]["TipoCambio"])},{border: [true,true,true,true],fontSize: 10,text:"Retensiones IVA:"},{border: [true,true,true,true],fontSize: 10, text:0,alignment:"right"}],
            [{text: ''},{border: [true,true,true,true],fontSize: 10,text:'Clave confirmación: '},{border: [true,true,true,true],fontSize: 10,text:"Total:"},{border: [true,true,true,true],fontSize: 10, text:formatNumber(activeXML["cfdi:Comprobante"]["$"]["Total"],"en_US","1.2"),alignment:"right"}],
            [{text: ''},{border: [true,true,true,true],fontSize: 10, colSpan:3,text:'Este documento es una representación impresa de un CFDI, la reproduccion no autorizada de este comprobante constituye un delito en los terminos de las disposiciones fiscales'}],
          ]
        }
      });
    }
    if(activeXML["cfdi:Comprobante"]["$"]["TipoDeComprobante"] == 'P'){
      content.push({
        table: {
          widths: ['100%'],
          // keepWithHeaderRows: 1,
          body: [
            [{fontSize: 8,text:'Información del Pago',border: [true,true,true,true],aligment: 'center',fillColor: '#7aacf7',color:"white"}],
          ]
        }
      });
      content.push({
        table: {
          widths: ['25%','25%','25%','25%'],
          // keepWithHeaderRows: 1,
          body: [
            [{fontSize: 8,text:'Pago Monto:'+formatNumber(activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["Monto"],"en_US","1.2")},
              {fontSize: 8,text:'Moneda Pago:'+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["MonedaP"]},
              {fontSize: 8,text:'Forma de Pago:'+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["FormaDePagoP"]},
              {fontSize: 8,text:'Fecha de Pago:'+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["FechaPago"]}],
            [{fontSize: 8,text:'Num. Operación:'+(activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["NumOperacion"] != undefined ? activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["NumOperacion"] : '')},
              {fontSize: 8,text:'RFC Emisor Cta. Ben:'+(activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["RfcEmisorCtaBen"] != undefined ? activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["RfcEmisorCtaBen"] : '')},
              {fontSize: 8,text:'RFC Emisor Cta. Ord:'+(activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["RfcEmisorCtaOrd"] != undefined ? activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["RfcEmisorCtaOrd"] : '')},
              {fontSize: 8,text:'Cta. Ordenante:'+(activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["CtaOrdenante"] != undefined ? activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["CtaOrdenante"] : '')}]
          ]
        },
        layout: 'noBorders'
      });
      content.push({
        table: {
          widths: ['20%','10%','10%','10%','10%','10%','10%','10%','10%'],
          // keepWithHeaderRows: 1,
          body: [
            [{fontSize: 8,text:'IdDocumento',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'Serie',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'Folio',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'Moneda DR',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'MetodoDePagoDR',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'NumParcialidad',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'ImpSaldoAnt',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'ImpPagado',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            {fontSize: 8,text:'ImpSaldoInsoluto',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
            ],
          ]
        }
      });
      let concepts = [];
      let det = [];
      for(let y=0;y<activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["pago10:DoctoRelacionado"].length;y++){
        det = [];
        det.push({text: activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["pago10:DoctoRelacionado"][y]["$"]['IdDocumento'],fontSize: 8,border: [true,true,true,true]});
        det.push({text: activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["pago10:DoctoRelacionado"][y]["$"]['Serie'],fontSize: 8,border: [true,true,true,true]});
        det.push({text: activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["pago10:DoctoRelacionado"][y]["$"]['Folio'],fontSize: 8,border: [true,true,true,true]});
        det.push({text: activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["pago10:DoctoRelacionado"][y]["$"]['MonedaDR'],fontSize: 8,border: [true,true,true,true]});
        det.push({text: activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["pago10:DoctoRelacionado"][y]["$"]['MetodoDePagoDR'],fontSize: 8,border: [true,true,true,true]});
        det.push({text: activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["pago10:DoctoRelacionado"][y]["$"]['NumParcialidad'],fontSize: 8,border: [true,true,true,true]});
        det.push({text: formatNumber(parseFloat(activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["pago10:DoctoRelacionado"][y]["$"]['ImpSaldoAnt']),"en_US","1.2"),fontSize: 8,border: [true,true,true,true]});      
        det.push({text: formatNumber(parseFloat(activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["pago10:DoctoRelacionado"][y]["$"]['ImpPagado']),"en_US","1.2"),fontSize: 8,border: [true,true,true,true]});
        det.push({text: formatNumber(parseFloat(activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["pago10:DoctoRelacionado"][y]["$"]['ImpSaldoInsoluto']),"en_US","1.2"),fontSize: 8,border: [true,true,true,true]});
        concepts.push(det);
      }
      det = [];
      det.push({fontSize: 10, colSpan:9, text:'Importe en letra: CERO PESOS CON 00/100 M.N',border: [true,true,true,true]});
      concepts.push(det);
      content.push({
        table: {
          widths: ['20%','10%','10%','10%','10%','10%','10%','10%','10%'],
          // keepWithHeaderRows: 1,
          body: concepts
        }
      });
      let qr = '?re='+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["Rfc"]+'&rr='+activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]["Rfc"]+'&tt='+activeXML['cfdi:Comprobante']["$"]["Total"]+'&id='+activeXML['cfdi:Comprobante']["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["UUID"];
      let IEPS: any = 0;
      let IVA: any = 0;
      let retISR: any = 0;
      let retIVA: any = 0;
      content.push({
        table: {
          widths: ['30%','45%','15%','10%'],
          // keepWithHeaderRows: 1,
          body: [
            [{qr: qr,fit: '150', border: [false,false,false,false],rowSpan:8},{border: [true,true,true,true],fontSize: 10,text:'Forma de Pago: '},{border: [true,true,true,true],fontSize: 10,text:'Subtotal:'},{fontSize: 10,text:0,alignment:"right"}],
            [{text: ''},{border: [true,true,true,true],fontSize: 10,text:'Método de pago: '},{fontSize:10,text: 'Descuento'},{fontSize: 10,text:0,alignment:"right"}],
            [{text: ''},{border: [true,true,true,true],fontSize: 10,text:'Condición de pago: '},{border: [true,true,true,true],fontSize: 10,text:"IEPS:"},{border: [true,true,true,true],fontSize: 10, text:IEPS,alignment:"right"}],
            [{text: ''},{border: [true,true,true,true],fontSize: 10,text:'Moneda: XXX'},{border: [true,true,true,true],fontSize: 10,text:"IVA:"},{border: [true,true,true,true],fontSize: 10, text:IVA,alignment:"right"}],
            [{text: ''},{border: [true,true,true,true],fontSize: 10,text:'Versión del comprobante: '+activeXML["cfdi:Comprobante"]["$"]["Version"]},{border: [true,true,true,true],fontSize: 10,text:"Retensiones ISR:"},{border: [true,true,true,true],fontSize: 10, text:0,alignment:"right"}],
            [{text: ''},{border: [true,true,true,true],fontSize: 10,text:'Tipo de cambio: '},{border: [true,true,true,true],fontSize: 10,text:"Retensiones IVA:"},{border: [true,true,true,true],fontSize: 10, text:0,alignment:"right"}],
            [{text: ''},{border: [true,true,true,true],fontSize: 10,text:'Clave confirmación: '},{border: [true,true,true,true],fontSize: 10,text:"Total:"},{border: [true,true,true,true],fontSize: 10, text:0,alignment:"right"}],
            [{text: ''},{border: [true,true,true,true],fontSize: 10, colSpan:3,text:'Este documento es una representación impresa de un CFDI, la reproduccion no autorizada de este comprobante constituye un delito en los terminos de las disposiciones fiscales'}],
          ]
        }
      });
    }
    content.push({
      table: {
        widths: ['100%'],
        // keepWithHeaderRows: 1,
        body: [          
          [{fontSize: 10,text:'Sello Digital CFDI'}],
          [{fontSize: 8,text:activeXML["cfdi:Comprobante"]["$"]["Sello"]}],
          [{fontSize: 10,text:'Sello Digital del SAT'}],
          [{fontSize: 8,text:activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["SelloSAT"]}],
          [{fontSize: 10,text:'Cadena Original del complemento de certificación digital del SAT'}],
          [{fontSize: 8,text:'||1.1|'+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["UUID"]+
                              '|'+activeXML['cfdi:Comprobante']["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["FechaTimbrado"]+
                              '|'+activeXML["cfdi:Comprobante"]["$"]["Sello"]+
                              '|'+activeXML['cfdi:Comprobante']["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["NoCertificadoSAT"]+"||"
          }]
        ]
      },
      layout: 'noBorders'
    });

    let docDefinition = {        
      pageMargins: [20,20,20,20],
      content: content
    }
    pdfMake.createPdf(docDefinition).open();
  }

  exportPDFNomina(row){
    let parseString = require('xml2js').parseString;
    let activeXML = '';
    parseString(row['file'], function (err, result) {
      console.dir(result);
      activeXML = result;
    });

    let content: any = [];
    if(this.logo != '' && this.logo != undefined && this.logo != null){
      content.push({
        table: {
          widths: ['20%','55%','25%'],
          // keepWithHeaderRows: 1,
          body: [
            [{image: this.logo, width: 100, height: (this.cuadrado == 1 ? 100 : 60), rowSpan:6,border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'Emisor Del Comprobante Fiscal',fillColor: '#7aacf7',color:"white"},{fontSize: 10,text:'Nómina',alignment:"center",border: [true,true,true,true],fillColor: '#7aacf7',color:"white"}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text: activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["Nombre"]},{fontSize: 10,text:(activeXML["cfdi:Comprobante"]["$"]["Serie"] != undefined ? activeXML["cfdi:Comprobante"]["$"]["Serie"]+" - " : "")+activeXML["cfdi:Comprobante"]["$"]["Folio"],alignment:"center",border: [true,true,true,true],color: 'red'}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'RFC: '+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["Rfc"]},{fontSize: 10,text:"Folio Fiscal",alignment:"center",border: [true,true,true,true],fillColor: '#7aacf7',color:"white"}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'Régimen Fiscal: '+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["RegimenFiscal"]+" Lugar de expedición: "+activeXML["cfdi:Comprobante"]["$"]["LugarExpedicion"]},{fontSize: 10,text:this.datepipe.transform(activeXML["cfdi:Comprobante"]["$"]["Fecha"],"dd/MM/yyyy"),alignment:"center",border: [true,true,true,true]}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'Registro Peatonal: '+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["nomina12:Emisor"][0]["$"]["RegistroPatronal"]},{fontSize: 10,text:'Fecha de Emisión',alignment:"center",border: [true,true,true,true],fillColor: '#7aacf7',color:"white"}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:''},{fontSize: 10,text:activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["UUID"],alignment:"center",border: [true,true,true,true]}],
          ]
        }
      });
    }else{
      content.push({
        table: {
          widths: ['20%','55%','25%'],
          // keepWithHeaderRows: 1,
          body: [
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'Emisor Del Comprobante Fiscal',fillColor: '#7aacf7',color:"white"},{fontSize: 10,text:'Nómina',alignment:"center",border: [true,true,true,true],fillColor: '#7aacf7',color:"white"}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text: activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["Nombre"]},{fontSize: 10,text:(activeXML["cfdi:Comprobante"]["$"]["Serie"] != undefined ? activeXML["cfdi:Comprobante"]["$"]["Serie"]+" - " : "")+activeXML["cfdi:Comprobante"]["$"]["Folio"],alignment:"center",border: [true,true,true,true],color: 'red'}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'RFC: '+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["Rfc"]},{fontSize: 10,text:"Folio Fiscal",alignment:"center",border: [true,true,true,true],fillColor: '#7aacf7',color:"white"}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'Régimen Fiscal: '+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["RegimenFiscal"]+" Lugar de expedición: "+activeXML["cfdi:Comprobante"]["$"]["LugarExpedicion"]},{fontSize: 10,text:this.datepipe.transform(activeXML["cfdi:Comprobante"]["$"]["Fecha"],"dd/MM/yyyy"),alignment:"center",border: [true,true,true,true]}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'Registro Peatonal: '+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["nomina12:Emisor"][0]["$"]["RegistroPatronal"]},{fontSize: 10,text:'Fecha de Emisión',alignment:"center",border: [true,true,true,true],fillColor: '#7aacf7',color:"white"}],
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:''},{fontSize: 10,text:activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["UUID"],alignment:"center",border: [true,true,true,true]}],
          ]
        }
      });
    }
    content.push({
      table: {
        widths: ['10%'],
        // keepWithHeaderRows: 1,
        body: [                
          [{text:'',height: 100,fontSize: 10, style: 'tableHeader', alignment: 'left'}]                
        ]
      },
      layout: 'noBorders'
    });

    content.push({
      table: {
        widths: ['100%'],
        // keepWithHeaderRows: 1,
        body: [
          [{fontSize: 12,text:'Datos del trabajador',border: [true,true,true,true],alignment: 'center',fillColor: '#7aacf7',color:"white"}],
        ]
      }
    });
    content.push({
      table: {
        widths: ['34%','33%','33%'],
        // keepWithHeaderRows: 1,
        body: [
          [{fontSize: 8,text:'No Trab: '+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["nomina12:Receptor"][0]["$"]["NumEmpleado"]},{fontSize: 8,text:'Departamento:'+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["nomina12:Receptor"][0]["$"]["Departamento"]},{fontSize: 8,text:'Periodo:'+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["$"]["FechaInicialPago"]+" al "+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["$"]["FechaFinalPago"]}],
          [{fontSize: 8,text:'Nombre: '+activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]["Nombre"]},{fontSize:8,text: 'Puesto:'+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["nomina12:Receptor"][0]["$"]["Puesto"]},{fontSize: 8,text:'Días Trabajador:'+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["$"]["NumDiasPagados"]}],
          [{fontSize: 8,text:'CURP: '+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["nomina12:Receptor"][0]["$"]["Curp"]},{fontSize: 8,text:"Jornada:"+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["nomina12:Receptor"][0]["$"]["TipoJornada"]},{fontSize: 8, text:'Periodicidad:'+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["nomina12:Receptor"][0]["$"]["PeriodicidadPago"]}],
          [{fontSize: 8,text:'RFC: '+activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]["Rfc"]},{fontSize: 8,text:"Ultimo Ingreso:"+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["nomina12:Receptor"][0]["$"]["FechaInicioRelLaboral"]},{fontSize: 8, text:'Fecha Pago:'+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["$"]["FechaPago"]}],
          [{fontSize: 8,text:'R. IMSS: '+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["nomina12:Receptor"][0]["$"]["NumSeguridadSocial"]},{fontSize: 8,text:"Antigüedad:"+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["nomina12:Receptor"][0]["$"]["Antigüedad"]},{fontSize: 8, text:'Salario Diario:'}],
          [{fontSize: 8,text:'Régimen Trabajador: '+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["nomina12:Receptor"][0]["$"]["TipoRegimen"]},{fontSize: 8,text:"Tipo Salario:"+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["nomina12:Receptor"][0]["$"]["TipoContrato"]},{fontSize: 8, text:'Salario Diario Integrado:'+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["nomina12:Receptor"][0]["$"]["SalarioDiarioIntegrado"]}]          
        ]
      }
    });
    content.push({
      table: {
        widths: ['10%'],
        // keepWithHeaderRows: 1,
        body: [                
          [{text:'',height: 100,fontSize: 10, style: 'tableHeader', alignment: 'left'}]                
        ]
      },
      layout: 'noBorders'
    });
    content.push({
      table: {
        widths: ['100%'],
        // keepWithHeaderRows: 1,
        body: [
          [{fontSize: 12,text:'Percepciones',border: [false,false,false,false],alignment: 'center',fillColor: '#7aacf7',color:"white"}],
        ]
      }
    });
    content.push({
      table: {
        widths: ['10%','70%','10%','10%'],
        // keepWithHeaderRows: 1,
        body: [
          [{fontSize: 10,text:'Clave',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
          {fontSize: 10,text:'Concepto',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
          {fontSize: 10,text:'Gravado',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
          {fontSize: 10,text:'Exento',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"}          
          ],
        ]
      }
    });
    let concepts = [];
    let det = [];
    for(let y=0;y<activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["nomina12:Percepciones"][0]["nomina12:Percepcion"].length;y++){
      det = [];
      det.push({text: activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["nomina12:Percepciones"][0]["nomina12:Percepcion"][y]["$"]["Clave"],fontSize: 8,border: [true,true,true,true]});
      det.push({text: activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["nomina12:Percepciones"][0]["nomina12:Percepcion"][y]["$"]["Concepto"],fontSize: 8,border: [true,true,true,true]});
      det.push({text: formatNumber(activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["nomina12:Percepciones"][0]["nomina12:Percepcion"][y]["$"]["ImporteGravado"],"en_US","1.2"),fontSize: 8,border: [true,true,true,true],alignment: 'right'});
      det.push({text: formatNumber(activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["nomina12:Percepciones"][0]["nomina12:Percepcion"][y]["$"]["ImporteExento"],"en_US","1.2"),fontSize: 8,border: [true,true,true,true],alignment: 'right'});
      concepts.push(det);
    }    
    det = [];
    det.push({text: '',fontSize: 8,border: [true,true,true,true]});
    det.push({text: 'Total Percepción:',fontSize: 8,border: [true,true,true,true]});
    det.push({text: formatNumber(activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["$"]["TotalPercepciones"],"en_US","1.2"),fontSize: 8,border: [true,true,true,true],alignment: "right"});
    det.push({text: '',fontSize: 8,border: [true,true,true,true]});
    concepts.push(det);
    content.push({
      table: {
        widths: ['10%','70%','10%','10%'],
        // keepWithHeaderRows: 1,
        body: concepts
      }
    });
    content.push({
      table: {
        widths: ['10%'],
        // keepWithHeaderRows: 1,
        body: [                
          [{text:'',height: 100,fontSize: 10, style: 'tableHeader', alignment: 'left'}]                
        ]
      },
      layout: 'noBorders'
    });
    content.push({
      table: {
        widths: ['100%'],
        // keepWithHeaderRows: 1,
        body: [
          [{fontSize: 12,text:'Deducciones',border: [false,false,false,false],alignment: 'center',fillColor: '#7aacf7',color:"white"}],
        ]
      }
    });
    content.push({
      table: {
        widths: ['10%','70%','10%','10%'],
        // keepWithHeaderRows: 1,
        body: [
          [{fontSize: 10,text:'Clave',fillColor: '#7aacf7',color:"white"},
          {fontSize: 10,text:'Concepto',fillColor: '#7aacf7',color:"white"},
          {fontSize: 10,text:'Gravado',fillColor: '#7aacf7',color:"white"},
          {fontSize: 10,text:'Exento',fillColor: '#7aacf7',color:"white"}          
          ],
        ]
      }
    });
    concepts = [];
    for(let y=0;y<activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["nomina12:Deducciones"][0]["nomina12:Deduccion"].length;y++){
      det = [];
      det.push({text: activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["nomina12:Deducciones"][0]["nomina12:Deduccion"][y]["$"]["Clave"],fontSize: 8,border: [true,true,true,true]});
      det.push({text: activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["nomina12:Deducciones"][0]["nomina12:Deduccion"][y]["$"]["Concepto"],fontSize: 8,border: [true,true,true,true]});
      det.push({text: formatNumber(activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["nomina12:Deducciones"][0]["nomina12:Deduccion"][y]["$"]["Importe"],"en_US","1.2"),fontSize: 8,border: [true,true,true,true],alignment: 'right'});
      det.push({text: "0.00",fontSize: 8,border: [true,true,true,true],alignment: 'right'});
      concepts.push(det);
    }   
    det = [];
    det.push({text: '',fontSize: 8,border: [true,true,true,true]});
    det.push({text: 'Total Percepción:',fontSize: 8,border: [true,true,true,true]});
    det.push({text: formatNumber(activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["$"]["TotalDeducciones"],"en_US","1.2"),alignment: "right",fontSize: 8,border: [true,true,true,true]});
    det.push({text: '',fontSize: 8,border: [true,true,true,true]});
    det = [];
    det.push({fontSize: 10, colSpan:4, text:'Importe en letra: '+ this.num2letras(activeXML['cfdi:Comprobante']["$"]["Total"]),border: [true,true,true,true]});
    concepts.push(det);
    content.push({
      table: {
        widths: ['10%','70%','10%','10%'],
        // keepWithHeaderRows: 1,
        body: concepts
      }
    });

    let qr = '?re='+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["Rfc"]+'&rr='+activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]["Rfc"]+'&tt='+activeXML['cfdi:Comprobante']["$"]["Total"]+'&id='+activeXML['cfdi:Comprobante']["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["UUID"];
    let IEPS: any = 0;
    let IVA: any = 0;
    let retISR: any = 0;
    let retIVA: any = 0;
    content.push({
      table: {
        widths: ['30%','40%','20%','10%'],
        // keepWithHeaderRows: 1,
        body: [
          [{qr: qr,fit: '150', border: [false,false,false,false],rowSpan:8},{border: [true,true,true,true],fontSize: 8,text:'Método de Pago: PUE - En una sola exhibición'},{border: [true,true,true,true],fontSize: 8,text:'Total Percepciones:'},{fontSize: 8,text:formatNumber(activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["$"]["TotalPercepciones"],"en_US","1.2"),alignment:"right"}],
          [{text: ''},{border: [true,true,true,true],fontSize: 8,text:'Forma de pago: '+this.formasdepago[activeXML["cfdi:Comprobante"]["$"]["FormaPago"]]},{fontSize:8,text: 'Total Deducciones:'},{fontSize: 8,text:formatNumber(activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["$"]["TotalDeducciones"],"en_US","1.2"),alignment:"right"}],
          [{text: ''},{border: [true,true,true,true],fontSize: 8,text:'Moneda: '+activeXML["cfdi:Comprobante"]["$"]["Moneda"]},{border: [true,true,true,true],fontSize: 8,text:"Total Otros Pagos:"},{border: [true,true,true,true],fontSize: 8, text:formatNumber((activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["$"]["TotalOtrosPagos"] != undefined ? activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["$"]["TotalOtrosPagos"] : 0),"en_US","1.2"),alignment:"right"}],
          [{text: ''},{border: [true,true,true,true],fontSize: 8,text:'Tipo de Cambio: Versioó:'+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["$"]["Version"]},{border: [true,true,true,true],fontSize: 8,text:"Total Retensiones:"},{border: [true,true,true,true],fontSize: 8, text:formatNumber((activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["$"]["TotalRetensiones"] != undefined ? activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["nomina12:Nomina"][0]["$"]["TotalRetensiones"] : 0),"en_US","1.2"),alignment:"right"}],          
          [{text: ''},{border: [true,true,true,true],fontSize: 8,text:'No. de Certificado Digital: '+activeXML["cfdi:Comprobante"]["$"]["NoCertificado"]},{border: [true,true,true,true],fontSize: 8,text:""},{border: [true,true,true,true],fontSize: 8, text:'',alignment:"right"}],
          [{text: ''},{border: [true,true,true,true],fontSize: 8,text:'No. Certificado SAT: '+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["NoCertificadoSAT"]},{border: [true,true,true,true],fontSize: 8,text:""},{border: [true,true,true,true],fontSize: 8, text:'',alignment:"right"}],
          [{text: ''},{border: [true,true,true,true],fontSize: 8,text:''},{border: [true,true,true,true],fontSize: 8,text:"Total Neto:"},{border: [true,true,true,true],fontSize: 8, text:formatNumber(activeXML["cfdi:Comprobante"]["$"]["Total"],"en_US","1.2"),alignment:"right"}],
          [{text: ''},{border: [true,true,true,true],fontSize: 8, colSpan:3,text:'Este documento es una representación impresa de un CFDI, la reproduccion no autorizada de este comprobante constituye un delito en los terminos de las disposiciones fiscales'}],
        ]
      }
    });
    
    content.push({
      table: {
        widths: ['100%'],
        // keepWithHeaderRows: 1,
        body: [
          [{fontSize: 10,text:'Sello Digital CFDI'}],
          [{fontSize: 8,text:activeXML["cfdi:Comprobante"]["$"]["Sello"]}],
          [{fontSize: 10,text:'Sello Digital del SAT'}],
          [{fontSize: 8,text:activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["SelloSAT"]}],
          [{fontSize: 10,text:'Cadena Original del complemento de certificación digital del SAT'}],
          [{fontSize: 8,text:'||1.1|'+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["UUID"]+
                              '|'+activeXML['cfdi:Comprobante']["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["FechaTimbrado"]+
                              '|'+activeXML["cfdi:Comprobante"]["$"]["Sello"]+
                              '|'+activeXML['cfdi:Comprobante']["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["NoCertificadoSAT"]+"||"
          }]
        ]
      },
      layout: 'noBorders'
    });

    let docDefinition = {        
      pageMargins: [20,20,20,20],
      content: content
    }
    pdfMake.createPdf(docDefinition).open();
  }

  num2letras($num: any, $fem = false, $dec = true, $usd=false) { 
    let $matuni = [];
    let $matunisub = [];
    let $matdec = [];
    let $matmil = [];
    let $matsub = [];
    $matuni[2]  = "dos"; 
    $matuni[3]  = "tres"; 
    $matuni[4]  = "cuatro"; 
    $matuni[5]  = "cinco"; 
    $matuni[6]  = "seis"; 
    $matuni[7]  = "siete";
    $matuni[8]  = "ocho"; 
    $matuni[9]  = "nueve";
    $matuni[10] = "diez"; 
    $matuni[11] = "once"; 
    $matuni[12] = "doce"; 
    $matuni[13] = "trece";
    $matuni[14] = "catorce"; 
    $matuni[15] = "quince"; 
    $matuni[16] = "dieciseis"; 
    $matuni[17] = "diecisiete"; 
    $matuni[18] = "dieciocho"; 
    $matuni[19] = "diecinueve"; 
    $matuni[20] = "veinte"; 
    $matunisub[2] = "dos"; 
    $matunisub[3] = "tres";
    $matunisub[4] = "cuatro"; 
    $matunisub[5] = "quin"; 
    $matunisub[6] = "seis"; 
    $matunisub[7] = "sete"; 
    $matunisub[8] = "ocho"; 
    $matunisub[9] = "nove"; 
    $matdec[2] = "veint"; 
    $matdec[3] = "treinta"; 
    $matdec[4] = "cuarenta"; 
    $matdec[5] = "cincuenta"; 
    $matdec[6] = "sesenta"; 
    $matdec[7] = "setenta"; 
    $matdec[8] = "ochenta"; 
    $matdec[9] = "noventa"; 
    $matsub[3]  = 'mill'; 
    $matsub[5]  = 'bill'; 
    $matsub[7]  = 'mill'; 
    $matsub[9]  = 'trill';
    $matsub[11] = 'mill'; 
    $matsub[13] = 'bill'; 
    $matsub[15] = 'mill'; 
    $matmil[4]  = 'millones'; 
    $matmil[6]  = 'billones'; 
    $matmil[7]  = 'de billones'; 
    $matmil[8]  = 'millones de billones'; 
    $matmil[10] = 'trillones'; 
    $matmil[11] = 'de trillones'; 
    $matmil[12] = 'millones de trillones'; 
    $matmil[13] = 'de trillones'; 
    $matmil[14] = 'billones de trillones'; 
    $matmil[15] = 'de billones de trillones'; 
    $matmil[16] = 'millones de billones de trillones';    

    //Zi hack
    let $float=$num.split(".");
    $num=$float[0];

    $num = $num.trim();    
    let $neg = ''; 
    if ($num == '-') { 
       let $neg = 'menos '; 
       $num = $num.substring(1); 
    }

    while ($num == '0') $num = $num.substring(1); 

    if ($num < '1' || $num > 9) $num = '0' + $num; 

    let  $zeros = true; 
    let  $punt = false; 
    let  $ent = ''; 
    let  $fra = ''; 

    for (let $c = 0; $c < $num.length; $c++) { 
       let $n = $num[$c]; 
       if (!(".,'''".indexOf($n) === -1)) { 
          if ($punt) break; 
          else{ 
             $punt = true; 
             continue; 
          } 
       }else if (!('0123456789'.indexOf($n) === -1)) { 
          if ($punt) { 
             if ($n != '0') $zeros = false; 
             $fra += $n; 
          }else 
             $ent += $n; 
       }else 
          break; 
    } 

    $ent = '     ' + $ent; 
    let $s;
    let $fin = '';
    if ($dec && $fra && ! $zeros) { 
      $fin = ' coma'; 
       for (let $n = 0; $n < $fra.length; $n++) { 
          if (($s = $fra[$n]) == '0') 
             $fin += ' cero'; 
          else if ($s == '1') 
             $fin += $fem ? ' una' : ' un'; 
          else 
             $fin += ' ' + $matuni[$s]; 
       } 
    }else {
      $fin = ''; 
    }
    if (parseInt($ent) === 0) return 'Cero ' + $fin; 
    let $tex = ''; 
    let $sub = 0; 
    let $mils = 0;
    let $neutro = false; 
    let $subcent = '';
    while ( ($num = $ent.substring($ent.length-3)) != '   ' && $ent.substring($ent.length-3) !== '  0') { 
       $ent = $ent.substring(0, ($ent.length-3)); 
       if (++$sub < 3 && $fem) { 
          $matuni[1] = 'una'; 
          $subcent = 'as';
       }else{ 
          $matuni[1] = $neutro ? 'un' : 'uno'; 
          $subcent = 'os'; 
       } 
       let $t = ''; 
       let $n2 = $num.substring(1); 
       if ($n2 == '00') { 
       }else if ($n2 < 21)
          $t = ' ' + $matuni[parseInt($n2)]; 
       else if ($n2 < 30) { 
          let $n3 = $num[2]; 
          if ($n3 != 0) $t = 'i' + $matuni[$n3]; 
          $n2 = $num[1]; 
          $t = ' ' + $matdec[$n2] + $t; 
       }else{ 
          let $n3 = $num[2]; 
          if ($n3 != 0) $t = ' y ' + $matuni[$n3]; 
          $n2 = $num[1]; 
          $t = ' ' + $matdec[$n2] + $t; 
       } 
       let $n = $num[0]; 
       if ($n == 1) { 
         if($t == ''){
           $t = ' cien';
         }else{
          $t = ' ciento' + $t; 
         }
       }else if ($n == 5){ 
          $t = ' ' + $matunisub[$n] + 'ient' + $subcent + $t; 
       }else if ($n != 0){ 
          $t = ' ' + $matunisub[$n] + 'cient' + $subcent + $t; 
       } 
       if ($sub == 1) { 
       }else if ($matsub.indexOf($sub) === -1) { 
          if ($num == 1) { 
             $t = ' mil'; 
          }else if ($num > 1){ 
             $t += ' mil'; 
          } 
       }else if ($num == 1) { 
          $t += ' ' + $matsub[$sub] + 'ón'; 

       }else if ($num > 1){ 
          $t += ' ' + $matsub[$sub] + 'ones'; 
       }   
       if ($num == '000') $mils ++; 
       else if ($mils != 0) {
          if ($matsub.indexOf($sub) !== -1) $t += ' ' + $matmil[$sub]; 
          $mils = 0; 
       } 
       $neutro = true; 

       $tex = $t + $tex; 
    } 
    $tex = $neg + $tex.substring(1) + $fin; 
    //Zi hack --> return ucfirst($tex);
    let $tipo= []; 
    $tipo[0]=' PESOS ';
    $tipo[1]=' M.N.';
    if($usd){
       $tipo[0]=' DOLARES ';
       $tipo[1]=' USD';
    }

    // let $end_num= $tex.charAt(0).toUpperCase()+$tipo[0]+$float[1]+'/100 '+$tipo[1];

    return $tex.toUpperCase()+$tipo[0]+$float[1]+'/100 '+$tipo[1];

 } 

  fetchUsoCFDI(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/usocfdi.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  fetchfdp(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/formaspago.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }


  loadImage(imageUrl) {
    const self = this;
    const xhr = new XMLHttpRequest()
   
    xhr.open("GET", imageUrl);
    xhr.responseType = "blob";
    xhr.send();
    
    xhr.addEventListener("load", function() {
      console.log("a");
        var reader = new FileReader();
        reader.readAsDataURL(xhr.response); 
        reader.addEventListener("loadend", function() {    
         
          
                   
            self.logo = reader.result;
        });
    });
  }

  FilterBy(e,tab: any){
    let value: any = e.currentTarget.value;
    if(tab == 'emi'){
      const temp = this.filteremi.filter(function (d) {
        if(d.rol != null){
          return d.rfc.indexOf(value) !== -1 || !value;
        }   
        if(d.receptor != null){     
          return d.receptor.toLowerCase().indexOf(value) !== -1 || !value;
        }
        if(d.uud != null){
          return d.uuid.toLowerCase().indexOf(value) !== -1 || !value;
        }
      });
  
      // update the rows
      this.emitidas = temp;
      // Whenever the filter changes, always go back to the first page
      this.table.offset = 0;
    }else if(tab == 'rec'){
      const temp = this.filterrec.filter(function (d) {
        if(d.rol != null){
          return d.rfc.indexOf(value) !== -1 || !value;
        }   
        if(d.emisor != null){     
          return d.emisor.toLowerCase().indexOf(value) !== -1 || !value;
        }
        if(d.uud != null){
          return d.uuid.toLowerCase().indexOf(value) !== -1 || !value;
        }
      });
  
      // update the rows
      this.recibidas = temp;
      // Whenever the filter changes, always go back to the first page
      this.tablereb.offset = 0;
    }else{
      const temp = this.filternom.filter(function (d) {
        if(d.rol != null){
          return d.rfc.indexOf(value) !== -1 || !value;
        }   
        if(d.receptor != null){     
          return d.receptor.toLowerCase().indexOf(value) !== -1 || !value;
        }
        if(d.uud != null){
          return d.uuid.toLowerCase().indexOf(value) !== -1 || !value;
        }
      });
  
      // update the rows
      this.nominas = temp;
      // Whenever the filter changes, always go back to the first page
      this.tablenom.offset = 0;
    }
    
  }

}
