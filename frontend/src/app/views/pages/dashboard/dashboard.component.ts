import { Component, OnInit } from '@angular/core';
import { ApexAxisChartSeries, ApexNonAxisChartSeries, ApexGrid, ApexChart, ApexXAxis, ApexYAxis, ApexMarkers, ApexStroke, ApexLegend, ApexResponsive, ApexTooltip, ApexFill, ApexDataLabels, ApexPlotOptions, ApexTitleSubtitle } from 'ng-apexcharts';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
// Ng2-charts
import { ChartOptions, ChartType, ChartDataSets, RadialChartOptions } from 'chart.js';
import { Label, Color, SingleDataSet } from 'ng2-charts';
import { TokenStorageService } from '../../../core/JWT/token-storage.service';
// Progressbar.js
import ProgressBar from 'progressbar.js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BlockUI, NgBlockUI,BlockUIService  } from 'ng-block-ui';
import { UsuariosService } from '../../../core/JWT/usuarios.service';
import * as CryptoJS from 'crypto-js'; 

export type apexChartOptions = {
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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  preserveWhitespaces: true
})
export class DashboardComponent implements OnInit {
  @BlockUI('ejercicioblock') ejercicioblock: NgBlockUI;
  @BlockUI('periodoblock') periodoblock: NgBlockUI;
  @BlockUI('historicoporejercicio') historicoporejercicio: NgBlockUI;
  @BlockUI('rubrosporejercicio') rubrosporejercicio: NgBlockUI;
  public donutChartOptions: Partial<apexChartOptions>;
  user: any;
  ejercicios: any = [];
  periodos: any = [];  
  clientes: any = [];
  valores: any = [];
  etiquetas: any = [];
  ejercicioEnable: boolean = true;
  periodosEnable: boolean = true;
  selectedSearchPersonId: string = null;
  selectedejercicio: any;
  selectedperiodo: any;
  cliente: boolean = true;  
  net: any = [];
  ing: any = [];
  egr: any = [];
  netT: any = [];
  ingT: any = [];
  egrT: any = [];
  contotal: boolean = false;
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
  public mixedChartOptions: ChartOptions = {
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
 
  /**
   * NgbDatepicker
   */
  currentDate: NgbDateStruct;

  constructor(private router: Router, private calendar: NgbCalendar, private UService: UsuariosService,private storage: TokenStorageService,private http: HttpClient) {
    
  }

  ngOnInit(): void {
    this.currentDate = this.calendar.getToday();
    this.user = this.storage.getUser();
    this.donutChartOptions = {
      nonAxisSeries: [],
      labels: [],
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

    if(this.user['tipo'] == 'cliente'){
      this.cliente = false;
      this.selectedSearchPersonId = this.user['rfc'];
      this.ejercicioEnable = false;
      this.ejercicioblock.start('Cargando ejercicios...');
        this.http.get(this.storage.getapi()+'config/getEjercicios/'+this.selectedSearchPersonId).subscribe(data =>{
          this.ejercicios = [];
          this.ejercicioEnable = false;
          for(let x=0;x<data['result'].length;x++){
            this.ejercicios.push({
              anio: data['result'][x]['anio']
            });
          }
          if(data['activo']){
            this.selectedejercicio = data["activo"][0]["ejercicio"];
            this.changeEjercicio();
          }
          this.ejercicioblock.stop();
        },error=>{
          if(error['status'] == '401'){
            // this.router.navigate(['/auth/login']);
            this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
              this.storage.saveToken(data['access_token']); 
              this.ngOnInit();
            });
          }
          this.ejercicioblock.stop();
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
          // if(data['activo']){
          //   this.selectedejercicio = data["activo"][0]["ejercicio"];
          //   this.changeEjercicio();
          // }
          this.ejercicioblock.stop();
        },error=>{
          if(error['status'] == '401'){
            // this.router.navigate(['/auth/login']);
            this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
              this.storage.saveToken(data['access_token']); 
              this.ngOnInit();
            });
          }
          this.ejercicioblock.stop();
        });    
      }
    }
  }

  changeRFC(){
    if(this.selectedSearchPersonId == '' || this.selectedSearchPersonId == null || this.selectedSearchPersonId == undefined){
      this.ejercicioEnable = true;
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
          this.router.navigate(['/auth/login']);
        }
      });      
    }
  }

  changeEjercicio(){
    if(this.selectedejercicio == '' || this.selectedejercicio == null || this.selectedejercicio == undefined){
      this.periodosEnable = true;
    }else{
      this.http.get(this.storage.getapi()+'config/getPeriodos/'+this.selectedSearchPersonId+"/"+this.selectedejercicio).subscribe(data =>{
        this.periodos = [];
        this.periodosEnable = false;
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
            this.changeEjercicio();
          });
        }
      }); 
      this.historicoporejercicio.start('Cargando Gráfica por ejercicio...');
      this.http.get(this.storage.getapi()+'config/getHistorico/'+this.selectedSearchPersonId+"/"+this.selectedejercicio).subscribe(data =>{
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
        this.historicoporejercicio.stop();
        
      },error=>{
        if(error['status'] == '401'){
          // this.router.navigate(['/auth/login']);
          this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
            this.storage.saveToken(data['access_token']); 
            this.changeEjercicio();
          });
        }
      });      
      this.rubrosporejercicio.start('Cargando gráfica de rubros por ejercicio...');
      this.http.get(this.storage.getapi()+'config/getGraficaRubrosPorEjercicio/'+this.selectedSearchPersonId+"/"+this.selectedejercicio).subscribe(data =>{
        this.valores = [];
        this.etiquetas = [];
        for(let x=0;x<data['result'].length;x++){
          this.valores.push((data['result'][x]['cuantasdos'] == null ? data['result'][x]['cuantas']:data['result'][x]['cuantasdos']));
          this.etiquetas.push(data['result'][x]['rubros']);
        }
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
        this.rubrosporejercicio.stop();
      },error=>{
        if(error['status'] == '401'){
          // this.router.navigate(['/auth/login']);
          this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
            this.storage.saveToken(data['access_token']); 
            this.changeEjercicio();
          });
        }
        this.rubrosporejercicio.stop();
      });
    }
    
  }

}
