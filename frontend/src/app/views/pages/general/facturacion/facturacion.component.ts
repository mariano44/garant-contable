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
import { DecimalPipe, formatNumber } from '@angular/common';
import { ChartComponent, ApexAxisChartSeries, ApexGrid, ApexChart, ApexXAxis, ApexYAxis, ApexMarkers, ApexStroke, ApexLegend, ApexTooltip, ApexDataLabels, ApexFill, ApexPlotOptions, ApexResponsive, ApexNonAxisChartSeries, ApexTitleSubtitle, } from "ng-apexcharts";
import { BlockUI, NgBlockUI, BlockUIService } from 'ng-block-ui';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
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
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FacturacionComponent implements OnInit {
  defaultNavActiveId = 1;
  emitidas: any = [];
  filteremi:any = [];
  filterrec: any = [];
  @BlockUI("block-item") blockUI;
//PDF
logo:any;
cuadrado:any;
usoCFDI:any;
repsPdf:any;
formasdepago:any;
//Relacion de Clientes//  

razonsocial:any;
rfc:any;
correo:any;
calle:any;
noext:any;
noint:any;
entrecalle:any;
ycalle:any;
colonia:any;
ciudad:any;
cp:any;
estado:any;
telefono:any;
idcliente:any;
idusuario:any;
idproducto: any;
estatus:any;
clienteseleccionado:any;
productoseleccionado:any;
user:any;
users:any;
filtered:any;
filteredProductos:any;
filteredFacturas:any;
//Productos o Servicios//
claveinterna:any;
claveproducto:any;
id:any;
descripcion: any;
nombreinterno:any;
precio:any;
codigosat:any;
cuadroAlertaCancelacion:any;
unidad:any;
unidadItems:any = [{id:"H87",name:"H87-Pieza"}, {id:"EA",name:"EA-Elemento"}, {id:"E48",name:"E48-Unidad de servicio"}, {id:"ACT",name:"ACT-Actividad"}, {id:"KGM",name:"KGM-Kilogramo"},{id:"E51",name:"E51-Trabajo"}, {id:"A9",name:"A9-Tarifa"}, {id:"MTR",name:"MTR-Metro"}, {id:"AB",name:"AB-Paquete a granel"},
                  {id:"BB",name:"BB-Caja base"}, {id:"KT",name:"KT-Kit"}, {id:"SET",name:"SET-Conjunto"}, {id:"LTR",name:"LTR-Litro"}, {id:"XBX",name:"XBX-Caja"}, {id:"MON",name:"MON-Mes"},{id:"HUR",name:"HUR-Hora"}, 
                  {id:"MTK",name:"MTK-Metro Cuadrado"}, {id:"11",name:"11-Equipos"}, {id:"MGM",name:"MGM-Kilogramo"}, {id:"XPK",name:"XPK-Paquete"}, {id:"XKI",name:"XKI-Conjunto de piezas"},{id:"AS",name:"AS-Variedad"},
                   {id:"GRM",name:"GRM-Gramo"}, {id:"PR",name:"PR-Par"}, {id:"DPC",name:"DPC-Docena de Piezas"}, {id:"xun",name:"xun-Unidad"}, {id:"DAY",name:"DAY-Dia"},{id:"XLT",name:"XLT-Lote"},{id:"10",name:"10-Grupos"}, {id:"MLT",name:"MLT-Mililitro"}, {id:"E54",name:"E54-Viaje"}];
noidentificacion:any;
cuentapredial:any;
iva:any;
ivaItems:any = [16,  8,  0, "exento"];
ivaretItems:any = [10.6667,  6,5.33,4,  3];
ivaret:any;
isr:any;
ieps:any;
isrItems:any = [10];
fromDateFormat:any;
toDateFormat:any;
selectedSearchPersonId: string = null;
nuevocliente: boolean= true; 
editarcliente: boolean= false;
cfdi:any;
nuevoproducto: boolean= true;
editarproducto: boolean= false;
selectedDate: any;
hoveredDate: NgbDate | null = null;
fromDate: NgbDate | null;
toDate: NgbDate | null;
facturas: any =[];
clientes: any;
productos: any;
emitida:any;
columnsemi: any = [{ name: 'Fechaemision' }, { name: 'Total' }, { name: 'Subtotal' }, {name: "Tasaiva"}, { name: 'Tasaret' }, { name: 'Tasaisr' }, { name: 'Tasaieps' }];
columnsemiRelacion: any = [{ name: 'nombre' }, { name: 'RFC' }, { name: 'Accion' }];
columnsemiProductos: any = [{ name: 'ProductoServicio' }, { name: 'PrecioUnitario' }, { name: 'IVA' },{ name: 'CodigoDeProducto' }, { name: 'Accion' },];
columnsemiReps: any = [{ name: 'Fechaemision' }, { name: 'UUID' }, { name: 'Monto' },{ name: 'Imp. Pagado' }];
limite: any = 10;
basicModalCloseResult: string = '';
rowIndex:any;
prodRowIndex: any;
currentrow:any;
clienteRowIndex: any;
showtipofactura:any;
showestado:any;
cuadroAlertaCancelacionRep:any;
filteredcdfi:any;
reps:any;
rfcblock:any;
fechaInicio:any;
fechaFin:any;
filteredreps:any;
tipoQuienve:any;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  loadingIndicator = true;
  tienetimbres: boolean = true;
  alertaMsg: any = '';
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(DatatableComponent, { static: false }) tablec: DatatableComponent;
  @ViewChild(DatatableComponent, { static: false }) tablep: DatatableComponent;
  @ViewChild(DatatableComponent, { static: false }) tabler: DatatableComponent;
  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter,private bser: BlockUIService,private modalService: NgbModal, private blockUIService: BlockUIService, private datepipe: DatePipe, private storage: TokenStorageService, private http: HttpClient, private UService: UsuariosService, private router: Router, private route: ActivatedRoute) {
    this.limite = 10;
    this.fetchUsoCFDI(data => {
      this.usoCFDI = data;
    });
    
    this.fetchfdp(data => {
      this.formasdepago = data;
    });
  }

  fetchfdp(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/formaspago.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  ngOnInit() {
    this.user = this.storage.getUser();
    
    this.tipoQuienve = this.user.tipo;
    if(this.user['tipo'] == 'cliente'){
      this.clienteseleccionado = this.user.rfc;
    } else {
      this.clienteseleccionado=this.storage.getUltimoCliente(); 
    }

     
    this.http.get(this.storage.getapi()+"fact/listas/" + this.clienteseleccionado).subscribe(data => {  //Aqui se meten los datos del back a las variables.
    this.cfdi = [];  
   
    
    
    this.filteredcdfi = [];

    this.http.get(this.storage.getapi()+'config/getLogo/'+this.clienteseleccionado).subscribe(data => {
      if(data['logo'] != '' && data['logo'] != undefined && data['logo'] != null){
      this.http.get(this.storage.getapi()+'config/imageForPDF?url='+this.clienteseleccionado+"/perfil/"+data['logo']).subscribe(data2 =>{
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


    
    for(let x=0;x<data['facturas'].length;x++){
      
          let parseString = require('xml2js').parseString;
          let activeXML = '';
          parseString(data['facturas'][x]['file'], function (err, result) {
           
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
        this.cfdi.push({
          fechaemision: this.datepipe.transform(data['facturas'][x]['fechaemision'],"dd/MM/yyyy"),
          cp: data['facturas'][x]['cp'],
          subtotal: data['facturas'][x]['subtotal'],
          total: data['facturas'][x]['total'],
          rfc:data['facturas'][x]['rfc'],
          razonsocial:data['facturas'][x]['razonsocial'],
          tipo:data['facturas'][x]['tipo'],
          uuid:data['facturas'][x]['uuid'],
          descuento:data['facturas'][x]['descuento'],
          estado: (data['facturas'][x]['cancelada'] == 0 ? 'Vigente' : 'Cancelada'),
          file: data['facturas'][x]['file'],
          filename: data['facturas'][x]['filename'],
          id: data['facturas'][x]['id'],
          dat: det
        });
        
         
        if(this.cfdi[x].tipo === "I") {
          this.showtipofactura = "Ingreso";
          this.cfdi[x].tipo = this.showtipofactura;
        } else {
          this.showtipofactura = "Egreso";
          this.cfdi[x].tipo = this.showtipofactura;
        }

        this.filteredcdfi.push({
          fechaemision: this.datepipe.transform(data['facturas'][x]['fechaemision'],"dd/MM/yyyy"),
          cp: data['facturas'][x]['cp'],
          subtotal: data['facturas'][x]['subtotal'],
          total: data['facturas'][x]['total'],
          rfc:data['facturas'][x]['rfc'],
          razonsocial:data['facturas'][x]['razonsocial'],
          tipo:data['facturas'][x]['tipo'],
          uuid:data['facturas'][x]['uuid'],
          estado: (data['facturas'][x]['cancelada'] == 0 ? 'Vigente' : 'Cancelada'),
          descuento:data['facturas'][x]['descuento'],
          file: data['facturas'][x]['file'],
          filename: data['facturas'][x]['filename'],
          id: data['facturas'][x]['id'],
          dat: det
        });
     
     
        if(this.filteredcdfi[x].tipo === "I") {
          this.showtipofactura = "Ingreso";
          this.filteredcdfi[x].tipo = this.showtipofactura;
        } else {
          this.showtipofactura = "Egreso";
          this.filteredcdfi[x].tipo = this.showtipofactura;
        }
    }

    this.filtered = [];
      this.clientes = []; 
      for(let x=0;x<data['clientes'].length;x++){
        if(data['clientes'][x]['estatus']==1){
          this.clientes.push({
            id: data['clientes'][x]['id'],
            razonsocial: data['clientes'][x]['razonsocial'],
            correo: data['clientes'][x]['correo'],
            rfc: data['clientes'][x]['rfc'],
            calle: data['clientes'][x]['calle'],
            noext: data['clientes'][x]['noext'],
            noint: data['clientes'][x]['noint'],
            entrecalle: data['clientes'][x]['entrecalle'],
            ycalle: data['clientes'][x]['ycalle'],
            colonia: data['clientes'][x]['colonia'],
            ciudad: data['clientes'][x]['ciudad'],
            cp: data['clientes'][x]['cp'],
            estado: data['clientes'][x]['estado'],
            telefono: data['clientes'][x]['telefono'],
            estatus: data['clientes'][x]['estatus'],
            idusuario: data['clientes'][x]['idusuario']
          });
          this.filtered.push({
            id: data['clientes'][x]['id'],
            razonsocial: data['clientes'][x]['razonsocial'],
            correo: data['clientes'][x]['correo'],
            rfc: data['clientes'][x]['rfc'],
            calle: data['clientes'][x]['calle'],
            noext: data['clientes'][x]['noext'],
            noint: data['clientes'][x]['noint'],
            entrecalle: data['clientes'][x]['entrecalle'],
            ycalle: data['clientes'][x]['ycalle'],
            colonia: data['clientes'][x]['colonia'],
            ciudad: data['clientes'][x]['ciudad'],
            cp: data['clientes'][x]['cp'],
            estado: data['clientes'][x]['estado'],
            telefono: data['clientes'][x]['telefono'],
            estatus: data['clientes'][x]['estatus'],
            idusuario: data['clientes'][x]['idusuario']
          });
        }
      }


      this.productos = []; 
      this.filteredProductos = [];
      for(let x=0;x<data['productos'].length;x++){
        if(data['productos'][x]['estatus']==1){
          this.productos.push({
            id: data['productos'][x]['id'],
            claveinterna: data["productos"][x]['claveinterna'],
            claveproducto: data["productos"][x]['claveproducto'],
            cuentapredial: data["productos"][x]['cuentapredial'],
            descripcion: data["productos"][x]['descripcion'],
            estatus: data["productos"][x]['estatus'],
            idusuario: data["productos"][x]['idusuario'],
            isr: data["productos"][x]['isr'],
            iva: data["productos"][x]['iva'],
            ivaret: data["productos"][x]['ivaret'],
            noidentificacion: data["productos"][x]['noidentificacion'],
            nombreinterno: data["productos"][x]['nombreinterno'],
            precio: data["productos"][x]['precio'],
            unidad:data["productos"][x]['unidad'],
            ieps:data["productos"][x]['ieps']
          });
          
          
          this.filteredProductos.push({
            id: data['productos'][x]['id'],
            claveinterna: data["productos"][x]['claveinterna'],
            claveproducto: data["productos"][x]['claveproducto'],
            cuentapredial: data["productos"][x]['cuentapredial'],
            descripcion: data["productos"][x]['descripcion'],
            estatus: data["productos"][x]['estatus'],
            idusuario: data["productos"][x]['idusuario'],
            isr: data["productos"][x]['isr'],
            iva: data["productos"][x]['iva'],
            ivaret: data["productos"][x]['ivaret'],
            noidentificacion: data["productos"][x]['noidentificacion'],
            nombreinterno: data["productos"][x]['nombreinterno'],
            precio: data["productos"][x]['precio'],
            unidad:data["productos"][x]['unidad'],
            ieps:data["productos"][x]['ieps']
            });
          }
      }

     
     
      this.reps = [];
      for(let x=0;x<data['reps'].length;x++){

        let parseString = require('xml2js').parseString;
        let activeXML = '';
        parseString(data['reps'][x]['file'], function (err, result) {
         
          activeXML = result;
        });

        this.reps.push({
          uuid: data['reps'][x]['uuid'],
          fechaemision: this.datepipe.transform(data['reps'][x]['fechaemision'],"dd/MM/yyyy"),
          monto: data['reps'][x]['monto'],
          imppagado : data['reps'][x]['imppagado'],
          folio: data['reps'][x]['folio'],
          parcialidad: data['reps'][x]['mensualidad'],
          archivo: data['reps'][x]['file'],
          filename: data['reps'][x]['filename'],
          id: data['reps'][x]['id'],
          receptor: data['reps'][x]['razonsocial'],
          estado: (data['reps'][x]['cancelada']  == 0 ? 'Vigente' : 'Cancelada'),

        });
      } 
 

      this.filteredreps = [];
      for(let x=0;x<data['reps'].length;x++){
        this.filteredreps.push({
          uuid: data['reps'][x]['uuid'],
          fechaemision: this.datepipe.transform(data['reps'][x]['fechaemision'],"dd/MM/yyyy"),
          monto: data['reps'][x]['monto'],
          imppagado : data['reps'][x]['imppagado'],
          folio: data['reps'][x]['folio'],
          parcialidad: data['reps'][x]['mensualidad'],
          archivo: data['reps'][x]['file'],
          filename: data['reps'][x]['filename'],
          id: data['reps'][x]['id'],
          receptor: data['reps'][x]['razonsocial'],
          estado: (data['reps'][x]['cancelada']  == 0 ? 'Vigente' : 'Cancelada'),

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
    this.http.get(this.storage.getapi()+"fact/consultaTimbres/"+this.clienteseleccionado).subscribe(data=>{
      if(data['msg'] == 'notiene'){
        this.tienetimbres = false;
        this.alertaMsg = "El cliente "+this.clienteseleccionado+" no cuenta con timbres.";
      }
    },error=>{
      this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
        this.storage.saveToken(data['access_token']); 
        this.ngOnInit();
      });
    });
    this.http.get(this.storage.getapi()+"fact/revisarSellos/"+this.clienteseleccionado).subscribe(data=>{
      if(data['mensaje'] != 'tiene'){
        this.tienetimbres = false;
        this.alertaMsg = "El cliente con el RFC: "+this.clienteseleccionado+". No ha cargado sus archivos CSD. Favor de subir dichos archivos."
      }
    },error=>{
      this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
        this.storage.saveToken(data['access_token']); 
        this.ngOnInit();
      });
    });
  }
  //DATEPICKER

  


 

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

    if(this.fromDate != null && this.toDate != null) { //FILTRAR 

      this.fechaInicio = new Date(this.fromDate.year,this.fromDate.month -1, this.fromDate.day); //crear un objeto tipo Date para poder comparar.
      this.fechaFin = new Date(this.toDate.year,this.toDate.month -1, this.toDate.day);//crear un objeto tipo Date para poder comparar.
      
      this.fromDateFormat = {day:this.fromDate.year, month: this.fromDate.month, year:this.fromDate.day};
      this.toDateFormat = {day:this.toDate.year, month: this.toDate.month, year:this.toDate.day};

      this.filteredcdfi = this.cfdi.filter(item => { //Metodo Filter 
       
        let fechas = item.fechaemision
      //  fechas = this.datepipe.transform(fechas)
     
        
      //  item.fechaemision = this.datepipe.transform(item.fechaemision,"yyyy/dd/MM") ;
       
        
        
        let fecha:any =  item.fechaemision.split("/");  //Crea un arreglo por el split "-".
        
        
      
        let fechaComparar = new Date(fecha[2],fecha[1]-1,fecha[0]); //Crear el objeto tipo Date "Se resta -1 al mes"

        return fechaComparar >= this.fechaInicio  && fechaComparar <= this.fechaFin ; //REGRESA LOS ELEMENTOS QUE CUMPLAN ESA CONDICION Y SE GENERA UN ARREGLO CON ESAS CONDICIONES. 
      });
    }
    
  }

  clear(){
    this.fromDate = undefined;
    this.toDate = undefined;
    
    this.fromDateFormat = undefined;
    this.toDateFormat = undefined;
    this.fechaFin = undefined;
    this.fechaInicio = undefined;
    this.ngOnInit();
   
  }

  mesActual(){
    
  }

  onDateSelection2(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

    if(this.fromDate != null && this.toDate != null) { //FILTRAR 
      let fechaInicio = new Date(this.fromDate.year,this.fromDate.month -1, this.fromDate.day); //crear un objeto tipo Date para poder comparar.
      let fechaFin = new Date(this.toDate.year,this.toDate.month -1, this.toDate.day);//crear un objeto tipo Date para poder comparar.
          
        this.fromDateFormat = {day:this.fromDate.year, month: this.fromDate.month, year:this.fromDate.day};
        this.toDateFormat = {day:this.toDate.year, month: this.toDate.month, year:this.toDate.day};

          this.filteredreps = this.reps.filter(item => {  //Metodo Filter 
           
          let itemFormat = this.datepipe.transform(item.fechaemision,"yyyy/dd/MM") ;
         
          
          let fechaFormat:any =   itemFormat.split("/"); //Crea un arreglo por el split "-".

          let fechaComparar = new Date(fechaFormat[0],fechaFormat[1]-1,fechaFormat[2]);
        
          //Crear el objeto tipo Date "Se resta -1 al mes"
          return  fechaComparar >= fechaInicio && fechaComparar <=fechaFin ; //REGRESA LOS ELEMENTOS QUE CUMPLAN ESA CONDICION Y SE GENERA UN ARREGLO CON ESAS CONDICIONES. 
      });
    }
    
  }
  
  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
  //
  FilterBy(e){
    let value: any = e.currentTarget.value.toLowerCase(); //Obtienes lo del input

    this.filteredcdfi = this.cfdi.filter(item => {     //El metodo filter crea un nuevo arreglo con los elementos que cumples la condicion || El metodo filter recorre el arreglo. 
      let comparacion = item.razonsocial.toLowerCase().includes(value); //Aqui se hace una condicion que es "includes" para verificar si el elemento cumple la condicion y regresa TRUE O FALSE.
      let comparacionRFC = item.rfc.toLowerCase().includes(value);
      
      return comparacion || comparacionRFC; // Internamente hace un array con los elementos que cumplan la condicion.
    });

    }


  toggleExpandRow(row) {      //Mas info en el data table.
    if(this.currentrow == undefined){
      this.currentrow = row;
    }
    if(this.currentrow != row){
      this.table.rowDetail.collapseAllRows();
    }
    this.currentrow = row;
    this.table.rowDetail.toggleExpandRow(row);
  }
  filtrarReceptor(){  //Filtrar con el input "filtrar por receptor"
   
   
  }
  openBasicModal(content,cualModal: any) {  //Modal basico
    if(cualModal == 'nuevo'){                // este if es para que dependiendo de que si nuevoCliente es true 
      this.nuevocliente = true;

    }else{
      this.nuevocliente = false;
    }
    this.modalService.open(content, {}).result.then((result) => {
      this.basicModalCloseResult = "Modal closed" + result
    }).catch((res) => {});
  }

  openXlModal(content,cualModal2:any) {  //modal XL

   if(cualModal2 == "nuevo") {
     this.nuevoproducto = true;
   } else {
     this.nuevoproducto = false;
   }
    this.modalService.open(content, {size: 'xl'}).result.then((result) => {
      
    }).catch((res) => {});
  }
  
  openLgModal(content) { //Modal lg
    this.modalService.open(content, {size: 'lg'}).result.then((result) => {
      
    }).catch((res) => {});
  }

  cambiarPaginacion(e:any){ //cambiar pagina
    
    this.table.limit = parseInt(e.currentTarget.value);
    this.table.offset = 0;
    
  } 

 guardarCliente(){  //guardar los datos.
  if(this.rfc == null || this.rfc == "" || this.rfc == undefined) {
    this.startToast('warning','Favor de ingresar RFC');
    return false;
   }
   
   if(this.razonsocial == null || this.razonsocial == "" || this.razonsocial == undefined) {
      this.startToast('warning','Favor de ingresar la Razon Social');
      return false;
    } 

    
  let data = {
    razonsocial:this.razonsocial,
    rfccliente:this.rfc,
    correo:this.correo,
    calle:this.calle,
    entrecalle:this.entrecalle,
    ycalle:this.ycalle,
    noext:this.noext,
    noint:this.noint,
    colonia:this.colonia,
    ciudad:this.ciudad,
    cp:this.cp,
    estado:this.estado,
    telefono:this.telefono,
    idcliente:this.idcliente
    
   }
   
   
   this.http.post(this.storage.getapi()+"fact/addc/" + this.clienteseleccionado,data).subscribe(data=>{    //Post al back para meterlo a la base de datos.
     this.clientes.push({
        razonsocial: this.razonsocial,
        correo: this.correo,
        rfc: this.rfc,
        calle: this.calle,
        noext: this.noext,
        noint: this.noint,
        entrecalle: '',
        ycalle: '',
        colonia: this.colonia,
        ciudad: this.ciudad,
        cp: this.cp,
        estado: this.estado,
        telefono: this.telefono,
        estatus: this.estatus,
        idcliente:this.idcliente,
        idusuario: data['idusuario'],
        id: data['id']
     });

     this.filtered.push({
      razonsocial: this.razonsocial,
      correo: this.correo,
      rfc: this.rfc,
      calle: this.calle,
      noext: this.noext,
      noint: this.noint,
      entrecalle: '',
      ycalle: '',
      colonia: this.colonia,
      ciudad: this.ciudad,
      cp: this.cp,
      estado: this.estado,
      telefono: this.telefono,
      estatus: this.estatus,
      idcliente:this.idcliente,
      idusuario: data['idusuario'],
      id: data['id']
     });

     this.clientes = [...this.clientes]; // De esta forma se actualiza un nuevo registro  en el data table
     this.razonsocial = '';
      this.rfc = '';
      this.correo = '';
      this.calle = '';
      this.entrecalle = '';
      this.ycalle = '';
      this.noext = '';
      this.noint = '';
      this.colonia = '';
      this.ciudad = '';
      this.cp = '';
      this.estado = '';
      this.telefono = '';
      this.idcliente = '';
      this.modalService.dismissAll();        
      this.startToast('success','Se ha guardado el cliente correctamente');
  },error=>{
    if(error['status'] == '401'){
      // this.router.navigate(['/auth/login']);
      this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
        this.storage.saveToken(data['access_token']); 
      });
    }
    let err = error['error']['message'];
    this.startToast('error',err);
  });  

}




cerrarModalClientes(){             //Ya que cierras el modal de clientes para que los inputs queden vacios.
  this.modalService.dismissAll();
  this.razonsocial = '';
  this.rfc = '';
  this.correo = '';
  this.calle = '';
  this.entrecalle = '';
  this.ycalle = '';
  this.noext = '';
  this.noint = '';
  this.colonia = '';
  this.ciudad = '';
  this.cp = '';
  this.estado = '';
  this.telefono = '';
}



eliminarCliente(row: any, index: any){               //eliminar cliente
    const Alrt = Swal.mixin({//alerta de confiracion
      showConfirmButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:'Si',      
      cancelButtonText: 'No'      
    })
    
    Alrt.fire({
      icon: 'warning',
      title: '¿Deseas eliminar este cliente?'
    }).then((result)=>{
      if(result.isConfirmed){  
        this.http.post(this.storage.getapi()+"fact/deshabilitarc/"+row['id'],{}).subscribe(data=>{    //elimina el row de la base de datos.
          this.clientes.splice(index,1); //elimina el row.
          this.clientes = [...this.clientes];
          this.startToast('success','Se ha desabilitado el cliente correctamente');
        },error=>{
      
        });
      }
      if(result.isDismissed){

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

guardarProducto(){
  
  if(this.descripcion == null || this.descripcion == "" || this.descripcion == undefined) {
    this.startToast('warning','Favor de ingresar Descripcion');
    return false;
  }
  if(this.precio == null || this.precio == "" || this.precio == undefined) {
    this.startToast('warning','Favor de ingresar un Precio');
    return false;
  } 
  if(this.claveproducto == null || this.claveproducto == "" || this.claveproducto == undefined) {
    this.startToast('warning','Favor de ingresar el Codigo del SAT');
     return false;
  } 
  
  if(this.iva == null ||  this.iva == undefined) { 
    this.startToast('warning','Favor de ingresar el IVA');
      return false;
  }
  if(this.unidad == null || this.unidad == "" || this.unidad == undefined) {
    this.startToast('warning','Favor de ingresar la Unidad');
    return false;
  } 

  if(this.iva == null || this.iva == "" || this.iva == undefined) {
    this.startToast('warning','Favor de ingresar un IVA');
    return false;
  } 

  let data= {
    descripcion:this.descripcion,
    nombreinterno:this.nombreinterno,
    precio:this.precio,
    unidad:this.unidad,
    cuentapredial:this.cuentapredial,
    claveproducto:this.claveproducto,
    noidentificacion:this.noidentificacion,
    claveinterna:this.claveinterna,
    iva:this.iva,
    ivaret:this.ivaret,
    isr:this.isr,
    ieps:this.ieps,
    estatus:this.estatus

  }
  

  this.http.post(this.storage.getapi()+"fact/addp/" + this.clienteseleccionado,data).subscribe(data=>{    
  this.productos.push({
    descripcion:this.descripcion,
    nombreinterno:this.nombreinterno,
    precio:this.precio,
    unidad:this.unidad,
    cuentapredial:this.cuentapredial,
    claveproducto:this.claveproducto,
    noidentificacion:this.noidentificacion,
    claveinterna:this.claveinterna,
    iva:this.iva,
    ivaret:this.ivaret,
    idproducto:this.idproducto,
    estatus:this.estatus,
    isr:this.isr,
    ieps:this.ieps,
    id: data['id']
  });

  this.filteredProductos.push({
    descripcion:this.descripcion,
    nombreinterno:this.nombreinterno,
    precio:this.precio,
    unidad:this.unidad,
    cuentapredial:this.cuentapredial,
    claveproducto:this.claveproducto,
    noidentificacion:this.noidentificacion,
    claveinterna:this.claveinterna,
    iva:this.iva,
    ivaret:this.ivaret,
    idproducto:this.idproducto,
    estatus:this.estatus,
    isr:this.isr,
    ieps:this.ieps,
    id: data['id']
  });
  
  this.productos = [...this.productos]; // De esta forma se actualiza un nuevo registro  en el data table
     this.claveinterna = "";
     this.nombreinterno = '';
     this.claveproducto = "";
     this.descripcion = '';
     this.codigosat = '';
     this.unidad = '';
     this.noidentificacion = '';
     this.cuentapredial = '';
     this.iva = '';
     this.ivaret = '';
     this.isr = '';
     this.precio = '';
     this.ieps = '';
     this.modalService.dismissAll();        
     this.startToast('success','Se ha guardado el producto correctamente');
   
          
  },error=>{
    if(error['status'] == '401'){
      // this.router.navigate(['/auth/login']);
      this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
        this.storage.saveToken(data['access_token']); 
        

      });
    }
  let err = JSON.parse(error['error']);
  
    
  });  
  

}

guardarEdicionCliente(rowIndex: any){
  
 

  
   
  if(this.razonsocial == null || this.razonsocial == "" || this.razonsocial == undefined) {
    this.startToast('warning','Favor de ingresar la Razon Social');
    return false;
  }
  let data = {
    razonsocial:this.razonsocial,
    rfccliente:this.rfc,
    correo:this.correo,
    calle:this.calle,
    entrecalle:this.entrecalle,
    ycalle:this.ycalle,
    noext:this.noext,
    noint:this.noint,
    colonia:this.colonia,
    ciudad:this.ciudad,
    cp:this.cp,
    estado:this.estado,
    telefono:this.telefono,
    estatus:this.estatus,
    idusuario:this.idusuario,
    idcliente:this.idcliente
  }

  this.http.post(this.storage.getapi()+"fact/editarc/" + this.idcliente ,data).subscribe(data=>{    
  this.clientes[this.clienteRowIndex]['razonsocial'] = this.razonsocial;
  this.clientes[this.clienteRowIndex]['rfc'] = this.rfc,
  this.clientes[this.clienteRowIndex]['correo'] = this.correo,
  this.clientes[this.clienteRowIndex]['calle'] = this.calle,
  this.clientes[this.clienteRowIndex]['entrecalle'] = this.entrecalle,
  this.clientes[this.clienteRowIndex]['estatus'] = this.estatus,
  this.clientes[this.clienteRowIndex]['ycalle'] = this.ycalle,
  this.clientes[this.clienteRowIndex]['noext'] = this.noext,
  this.clientes[this.clienteRowIndex]['noint'] = this.noint,
  this.clientes[this.clienteRowIndex]['colonia'] = this.colonia,
  this.clientes[this.clienteRowIndex]['ciudad'] = this.ciudad,
  this.clientes[this.clienteRowIndex]['cp'] = this.cp;
  this.clientes[this.clienteRowIndex]['estado'] = this.estado,
  this.clientes[this.clienteRowIndex]['telefono'] = this.telefono;

  this.filtered.push({
    razonsocial: this.razonsocial,
    correo: this.correo,
    rfc: this.rfc,
    calle: this.calle,
    noext: this.noext,
    noint: this.noint,
    entrecalle: '',
    ycalle: '',
    colonia: this.colonia,
    ciudad: this.ciudad,
    cp: this.cp,
    estado: this.estado,
    telefono: this.telefono,
    estatus: this.estatus,
    idcliente:this.idcliente,
    idusuario: data['idusuario'],
    id: data['id']
   });
  this.clientes = [...this.clientes]; // De esta forma se actualiza un nuevo registro  en el data table
  this.razonsocial = '';
   this.rfc = '';
   this.correo = '';
   this.calle = '';
   this.entrecalle = '';
   this.ycalle = '';
   this.noext = '';
   this.noint = '';
   this.colonia = '';
   this.ciudad = '';
   this.cp = '';
   this.estado = '';
   this.telefono = '';
   this.idcliente = '';
   this.modalService.dismissAll();        
   this.startToast('success','Se ha guardado el cliente correctamente');
   
          
  },error=>{
    if(error['status'] == '401'){
      // this.router.navigate(['/auth/login']);
      this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
        this.storage.saveToken(data['access_token']); 
        

      });
    }
  let err = JSON.parse(error['error']);
  
    
  });  
  

}


guardarEdicionProducto(rowIndex: any){
  if(this.descripcion == null || this.descripcion == "" || this.descripcion == undefined) {
    this.startToast('warning','Favor de ingresar Descripcion');
    return false;
  }

  if(this.claveproducto == null || this.claveproducto == "" || this.claveproducto == undefined) {
    this.startToast('warning','Favor de ingresar el Codigo del SAT');
     return false;
  } 
  
  if(this.iva == null ||  this.iva == undefined) { 
    this.startToast('warning','Favor de ingresar el IVA');
      return false;
  }

  if(this.unidad == null || this.unidad == "" || this.unidad == undefined) {
    this.startToast('warning','Favor de ingresar la Unidad');
    return false;
  } 
  let data= {
    descripcion:this.descripcion,
    nombreinterno:this.nombreinterno,
    precio:this.precio,
    unidad:this.unidad,
    cuentapredial:this.cuentapredial,
    claveproducto:this.claveproducto,
    noidentificacion:this.noidentificacion,
    claveinterna:this.claveinterna,
    iva:this.iva,
    ivaret:this.ivaret,
    isr:this.isr,
    ieps:this.ieps,
    estatus:this.estatus,
    idusuario: this.idusuario
  }

  this.http.post(this.storage.getapi()+"fact/editarp/" + this.idproducto,data).subscribe(data=>{    
  this.productos[this.prodRowIndex]['descripcion'] = this.descripcion;
  this.productos[this.prodRowIndex]['nombreinterno'] = this.nombreinterno,
  this.productos[this.prodRowIndex]['precio'] = this.precio,
  this.productos[this.prodRowIndex]['estatus'] = this.estatus,
  this.productos[this.prodRowIndex]['unidad'] = this.unidad,
  this.productos[this.prodRowIndex]['cuentapredial'] = this.cuentapredial,
  this.productos[this.prodRowIndex]['claveproducto'] = this.claveproducto,
  this.productos[this.prodRowIndex]['noidentificacion'] = this.noidentificacion,
  this.productos[this.prodRowIndex]['claveinterna'] = this.claveinterna,
  this.productos[this.prodRowIndex]['iva'] = this.iva,
  this.productos[this.prodRowIndex]['ivaret'] = this.ivaret,
  this.productos[this.prodRowIndex]['isr'] = this.isr;
  this.productos[this.prodRowIndex]['ieps'] = this.ieps;

  this.filteredProductos.push({
    descripcion:this.descripcion,
    nombreinterno:this.nombreinterno,
    precio:this.precio,
    unidad:this.unidad,
    cuentapredial:this.cuentapredial,
    claveproducto:this.claveproducto,
    noidentificacion:this.noidentificacion,
    claveinterna:this.claveinterna,
    iva:this.iva,
    ivaret:this.ivaret,
    idproducto:this.idproducto,
    estatus:this.estatus,
    isr:this.isr,
    ieps:this.ieps,
    id: data['id']
  });

  this.productos = [...this.productos]; // De esta forma se actualiza un nuevo registro  en el data table
     this.descripcion = '';
     this.claveinterna = "";
     this.nombreinterno = '';
     this.claveproducto = "";
     this.descripcion = '';
     this.codigosat = '';
     this.unidad = '';
     this.noidentificacion = '';
     this.cuentapredial = '';
     this.iva = '';
     this.ivaret = '';
     this.isr = '';
     this.precio = '';
     this.ieps = '';
     this.prodRowIndex = '';
     this.modalService.dismissAll();        
     this.startToast('success','Se ha guardado el producto correctamente');
   
          
  },error=>{
    if(error['status'] == '401'){
      // this.router.navigate(['/auth/login']);
      this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
        this.storage.saveToken(data['access_token']); 
        

      });
    }
  let err = JSON.parse(error['error']);
  
    
  });  
  

}

editarProducto(row: any,vale: any, content: any,rowIndex: any){  //editar Producto.
  
  this.claveproducto = row["claveproducto"];
  this.nombreinterno = row['nombreinterno'];
  this.claveinterna = row["claveinterna"];
  this.descripcion = row['descripcion'];
  this.precio = row["precio"];
  this.codigosat = row["codigosat"];
  this.unidad = row["unidad"];
  this.noidentificacion = row["noidentificacion"];
  this.cuentapredial = row["cuentapredial"];
  this.iva = row['iva'] === "exento" ? row['iva'] : Number(row['iva']);
  //this.iva = row["iva"];
  this.ivaret = Number(row['ivaret']);
  //this.ivaret = row["ivaret"];
  this.estatus = row['estatus'];
  this.isr = Number(row['isr']);
 // this.isr = row["isr"];
  this.prodRowIndex = rowIndex;
  this.idproducto = row['id'];
  this.idusuario = row['idusuario'];
  this.ieps = row['ieps'];
  this.nuevoproducto = false;
  this.openXlModal(content,'editar');
}

editarCliente(row: any,vale: any, content: any,rowIndex2: any){  //editar cliente.
  

 
  this.razonsocial = row['razonsocial'];
  this.rfc = row['rfc'];
  this.correo = row['correo'];
  this.calle = row['calle'];
  this.entrecalle = row['entrecalle'];
  this.ycalle = row['ycalle'];
  this.noext = row['noext'];
  this.noint = row['noint'];
  this.colonia = row['colonia'];
  this.ciudad = row['ciudad'];
  this.estatus = row['estatus'];
  this.cp = row['cp'];
  this.estado = row['estado'];
  this.clienteRowIndex = rowIndex2;
  this.telefono = row['telefono'];
  this.idcliente = row['id'];
  this.idusuario = row['idusuario'];
  this.nuevocliente = false;

  this.openBasicModal(content,'editar');
}

eliminarProducto(row: any, index: any){               //eliminar producto
  const Alrt = Swal.mixin({//alerta de confiracion
    showConfirmButton: true,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText:'Si',      
    cancelButtonText: 'No'      
  })
  
  Alrt.fire({
    icon: 'warning',
    title: '¿Deseas eliminar este producto?'
  }).then((result)=>{
    if(result.isConfirmed){  
      this.http.post(this.storage.getapi()+"fact/deshabilitarp/"+row['id'],{}).subscribe(data=>{    //elimina el row de la base de datos.
        this.productos.splice(index,1); //elimina el row.
        this.productos = [...this.productos];
        this.startToast('success','Se ha desabilitado el producto correctamente');
      },error=>{
    
      });
    }
    if(result.isDismissed){

    }
  });

}
cerrarModalProductos(){             //Ya que cierras el modal de productos para que los inputs queden vacios.
  this.modalService.dismissAll();
  this.claveinterna = '';
  this.claveproducto = '';
  this.id = '';
  this.estatus = '';
  this.nombreinterno = '';
  this.descripcion = '';
  this.codigosat = '';
  this.unidad = '';
  this.noidentificacion = '';
  this.cuentapredial = '';
  this.iva = '';
  this.ivaret = '';
  this.isr = '';
  this.precio = '';
  this.ieps = '';
} 

  filterClientes(e){
    let value: any = e.currentTarget.value.toLowerCase();  
    const temp = this.filtered.filter(function (d) {
      if(d.razonsocial != '' && d.razonsocial != undefined){
        return d.razonsocial.toLowerCase().indexOf(value) !== -1 || !value;
      }   
      if(d.rfc != null && d.rfc != undefined){     
        return d.rfc.toLowerCase().indexOf(value) !== -1 || !value;
      }
    });    

      // update the rows
      this.clientes = temp;
      // Whenever the filter changes, always go back to the first page
      this.table.offset = 0;
        
    
  }


  filterProductos(e){
    let value: any = e.currentTarget.value.toLowerCase();  
    const temp = this.filteredProductos.filter(function (d) {
      if(d.nombreinterno != '' && d.nombreinterno != undefined){
        return d.nombreinterno.toLowerCase().indexOf(value) !== -1 || !value;
      }   
      if(d.precio != null && d.precio != undefined){     
        return d.precio.toLowerCase().indexOf(value) !== -1 || !value;
      }
      if(d.iva != null && d.iva != undefined){     
        return d.iva.toLowerCase().indexOf(value) !== -1 || !value;
      }
    });    

      // update the rows
      this.productos = temp;
    
      // Whenever the filter changes, always go back to the first page
      this.table.offset = 0;
        
    
  }


  ///////////////Para comprimir agregue estas variables y funciones. ///////////////
  downloadFile(row: any,tabla: any){
    
    let filename = row.filename;
    let formData:FormData = new FormData();
    formData.append('archivo', row.file);
    formData.append('filename', row.filename);
    formData.append('rfc',this.clienteseleccionado);
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

  fetchUsoCFDI(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/usocfdi.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  exportPDFEmitido(row, accion){
   
    
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
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'Nombre: '+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["Nombre"]},{fontSize: 10,text:(activeXML["cfdi:Comprobante"]["$"]["Folio"] === undefined ? activeXML["cfdi:Comprobante"]["$"]["Folio"] +" - " : "" ),alignment:"center",border: [true,true,true,true],color: 'white'}],
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
            [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'Nombre: '+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["Nombre"]},{fontSize: 10,text:(activeXML["cfdi:Comprobante"]["$"]["Serie"] === undefined ? activeXML["cfdi:Comprobante"]["$"]["Serie"]= " --- " : ""),alignment:"center",border: [true,true,true,true],color: 'red'}],
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
           
              if(activeXML["cfdi:Comprobante"]["cfdi:Impuestos"][0]["cfdi:Traslados"][0]["cfdi:Traslado"][ind]["$"]["Importe"] > 0 ) {
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
      det.push({fontSize: 10, colSpan:9, text:'Importe en letra: '+ this.num2letras(activeXML['cfdi:Comprobante']["$"]["Total"]),border: [true,true,true,true]});
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
    
    
    if(accion == 'descargar'){
      pdfMake.createPdf(docDefinition).open();
    }else{  
      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      pdfDocGenerator.getBase64((data) => {
        let formData:FormData = new FormData();
        formData.append('rfc', this.clienteseleccionado);
        formData.append('pdffile', data);
        formData.append('idcfdi',row.id);
        this.http.post(this.storage.getapi()+"fact/enviar",formData).subscribe(data2=>{
          this.startToast('info',"Hemos enviado la factura a la cuenta de correo registrada del cliente");
        },error=>{
          if(error['status'] == '401'){
            // this.router.navigate(['/auth/login']);
            this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
              this.storage.saveToken(data['access_token']); 
              this.exportPDFEmitido(row,accion);
            });
          }
        });
      });
    }
    
    
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

 cuadroAlerta(){
  this.cuadroAlertaCancelacion = true;
  setTimeout(() => { this.cuadroAlertaCancelacion = false}, 5000)
 }
 cancelarFactura(row:any) {
  const Alrt = Swal.mixin({
    showConfirmButton: true,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText:'Si',      
    cancelButtonText: 'No'      
  })
  
  Alrt.fire({
    icon: 'warning',
    title: 'Estas seguro que deseas cancelar la factura?. ¿Deseas continuar?'
  }).then((result)=>{
    if(result.isConfirmed){    
      this.blockUI.start('Cancelando...'); // Start blocking 
      
      this.http.post(this.storage.getapi()+ "fact/cancelar ",{idcfdi: row.id}).subscribe(data=> {
        this.startToast('success',"Su factura se ha cancelado Correctamente!"); 
        row.estado = "Cancelado";
      },error=>{
        if(error['status'] == '401'){
          //this.router.navigate(['/auth/login']);
          this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
            this.storage.saveToken(data['access_token']); 
            this.ngOnInit();
          });
        }
            this.startToast('error',error['error']['mensaje']); 
            
          
        });
   
      
    }
    if(result.isDismissed){
      this.blockUI.stop();
      return;
    }
  });
}


FilterByRep(e){
  let value: any = e.currentTarget.value.toLowerCase(); //Obtienes lo del input
  this.filteredreps = this.reps.filter(items => {  

    let receptor = items.receptor.toLowerCase().includes(value);
      
  //  let receptor = items.folio.includes(value);                //El metodo filter crea un nuevo arreglo con los elementos que cumples la condicion || El metodo filter recorre el arreglo. 
    let folio = items.folio.toString().includes(value); //Aqui se hace una condicion que es "includes" para verificar si el elemento cumple la condicion y regresa TRUE O FALSE.
   
    return folio || receptor; // Internamente hace un array con los elementos que cumplan la condicion.
  });

  }


  //REPS//
  downloadFileRep(row: any,tabla: any){
   
    
      let filename = row.filename;
      let formData:FormData = new FormData();
      formData.append('archivo', row.archivo);
      formData.append('filename', row.filename);
      formData.append('rfc',this.clienteseleccionado);
      
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
  fetchUsoCFDIRep(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/rep.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
    
    
  }

    exportPDFEmitidoRep(row,accion){
     
      
      let parseString = require('xml2js').parseString;
    let activeXML = '';
    parseString(row['archivo'], function (err, result) {
     
     
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
              [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:''},{fontSize: 10,text:'Ingreso (REP)',alignment:"center",border: [true,true,true,true]}]
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
              [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'Nombre: '+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["Nombre"]},{fontSize: 10,text:(activeXML["cfdi:Comprobante"]["$"]["Serie"] != undefined ? activeXML["cfdi:Comprobante"]["$"]["Serie"]+" - " : "")+activeXML["cfdi:Comprobante"]["$"]["Folio"],alignment:"center",border: [true,true,true,true],color: 'red'}],
              [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'RFC: '+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["Rfc"]},{fontSize: 10,text:"Fecha de Emisión",alignment:"center",border: [true,true,true,true],fillColor: '#7aacf7',color:"white"}],
              [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'Régimen Fiscal: '+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["RegimenFiscal"]+" Lugar de expedición: "+activeXML["cfdi:Comprobante"]["$"]["LugarExpedicion"]},{fontSize: 10,text:activeXML["cfdi:Comprobante"]["$"]["Fecha"],alignment:"center",border: [true,true,true,true]}],
              [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'CFDI Relacionado',fillColor: '#7aacf7',color:"white"},{fontSize: 10,text:'Fecha de Certificación',alignment:"center",border: [true,true,true,true],fillColor: '#7aacf7',color:"white"}],
              [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'Tipo relación: '},{fontSize: 10,text:activeXML['cfdi:Comprobante']["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["FechaTimbrado"],alignment:"center",border: [true,true,true,true]}],
              [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:'CFDI Relacionado: '},{fontSize: 10,text:"Tipo de comprobante",alignment:"center",border: [true,true,true,true],fillColor: '#7aacf7',color:"white"}],
              [{text:'',border: [false,false,false,false]},{fontSize: 10,border: [false,false,false,false],text:''},{fontSize: 10,text:'P. Pago',alignment:"center",border: [true,true,true,true]}]
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
            [{fontSize: 10,text:'Receptor Del Comprobante Fiscal',fillColor: '#7aacf7',color:"white"},{fontSize: 10,text:'Folio Fiscal del REP',fillColor: '#7aacf7',color:"white"}],
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
              [{fontSize: 10,text:'Información del recibo eléctronico de pago',border: [true,true,true,true],alignment:"center",fillColor: '#7aacf7',color:"white"}],
            ]
          }
        });
        content.push({
          table: {
            widths: ['25%','25%','25%','25%'],
            // keepWithHeaderRows: 1,
            body: [
              [{fontSize: 10,text:'Monto del pago: $'+formatNumber(activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["Monto"],"en_US","1.2")},
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
        let formateado = activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["$"]["Monto"]+".00";
      
        content.push({
          table: {
            widths: ['100%'],
            // keepWithHeaderRows: 1,
            body: [
              [{fontSize: 7,border: [false,false,false,false],text:'Monto del pago con letra: Son ('+ this.num2letras(formateado) +")"}],
            ]
          }
        });





        content.push({
          table: {
            widths: ['40%','10%','10%','10%','10%','10%','10%'],
            // keepWithHeaderRows: 1,
            body: [
              [{fontSize: 8,text:'Folio fiscal de la factura',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
              {fontSize: 8,text:'Moneda ',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
              {fontSize: 8,text:'Metodo De Pago',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
              {fontSize: 8,text:'Parcialidad',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
              {fontSize: 8,text:'Saldo Anterior',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
              {fontSize: 8,text:'Importe Pagado',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
              {fontSize: 8,text:'Saldo Insoluto',border: [true,true,true,true],fillColor: '#7aacf7',color:"white"},
              ],
            ]
          }
        });
        let concepts = [];
        let det = [];
        for(let y=0;y<activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["pago10:DoctoRelacionado"].length;y++){
          det = [];
          det.push({text: activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["pago10:DoctoRelacionado"][y]["$"]['IdDocumento'],fontSize: 8,border: [true,true,true,true]});
          det.push({text: activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["pago10:DoctoRelacionado"][y]["$"]['MonedaDR'],fontSize: 8,border: [true,true,true,true]});
          det.push({text: activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["pago10:DoctoRelacionado"][y]["$"]['MetodoDePagoDR'],fontSize: 8,border: [true,true,true,true]});
          det.push({text: activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["pago10:DoctoRelacionado"][y]["$"]['NumParcialidad'],fontSize: 8,border: [true,true,true,true]});
          det.push({text: formatNumber(parseFloat(activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["pago10:DoctoRelacionado"][y]["$"]['ImpSaldoAnt']),"en_US","1.2"),fontSize: 8,border: [true,true,true,true]});      
          det.push({text: formatNumber(parseFloat(activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["pago10:DoctoRelacionado"][y]["$"]['ImpPagado']),"en_US","1.2"),fontSize: 8,border: [true,true,true,true]});
          det.push({text: formatNumber(parseFloat(activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["pago10:Pagos"][0]["pago10:Pago"][0]["pago10:DoctoRelacionado"][y]["$"]['ImpSaldoInsoluto']),"en_US","1.2"),fontSize: 8,border: [true,true,true,true]});
          concepts.push(det);
        }
       
     
        content.push({
          table: {
            widths: ['40%','10%','10%','10%','10%','10%','10%'],
            // keepWithHeaderRows: 1,
            body: concepts
          }
        });
      
      
      }
     
      content.push({
        table: {
          widths: ['100%'],
          // keepWithHeaderRows: 1,
          body: [
            [{fontSize: 10,text:'Sello Digital CFDI',margin: [0, 20, 0, 0]}],
            [{fontSize: 8,text:activeXML["cfdi:Comprobante"]["$"]["Sello"]}],
            [{fontSize: 10,text:'Sello Digital del SAT'}],
            [{fontSize: 8,text:activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["SelloSAT"]}],
            [{fontSize: 10,text:'Cadena Original del complemento de certificación digital del SAT'}],
            [{fontSize: 8,text:'||1.1|'+activeXML["cfdi:Comprobante"]["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["UUID"]+
                                '|'+activeXML['cfdi:Comprobante']["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["FechaTimbrado"]+
                                '|'+activeXML["cfdi:Comprobante"]["$"]["Sello"]+
                                '|'+activeXML['cfdi:Comprobante']["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["NoCertificadoSAT"]+"||"
            }],
           
          ]
        },
        layout: 'noBorders'
      });
      let qr2 = '?re='+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["Rfc"]+'&rr='+activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]["Rfc"]+'&tt='+activeXML['cfdi:Comprobante']["$"]["Total"]+'&id='+activeXML['cfdi:Comprobante']["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["UUID"];  let qr = '?re='+activeXML["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["Rfc"]+'&rr='+activeXML["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]["Rfc"]+'&tt='+activeXML['cfdi:Comprobante']["$"]["Total"]+'&id='+activeXML['cfdi:Comprobante']["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["UUID"];
      
      
      content.push({
        table: {
          widths: ['100%'],
          // keepWithHeaderRows: 1,
          body: [
            [{qr: qr2,fit: '180', border: [false,false,false,false], alignment:"center",margin: [0, 20, 0, 0]}
            ]
          ]
        }
      });

      content.push({
        table: {
          widths: ['100%'],
          // keepWithHeaderRows: 1,
          body: [
            [{fontSize: 8, border: [false,false,false,false], alignment:"center",text:'Facturación electrónica por GARANTCONTABLE.COM ',margin: [0, 40, 0, 0]}]
          ]
        }
      });
    
    
      let docDefinition = {        
        pageMargins: [20,20,20,20],
        content: content
      }

      if(accion == 'descargar'){
        pdfMake.createPdf(docDefinition).open();
      }else{  
        const pdfDocGenerator = pdfMake.createPdf(docDefinition);
        pdfDocGenerator.getBase64((data) => {
          let formData:FormData = new FormData();
          formData.append('rfc', this.clienteseleccionado);
          formData.append('pdffile', data);
          formData.append('id',row.id);
          this.http.post(this.storage.getapi()+"fact/enviarPago",formData).subscribe(data2=>{
            
            
            this.startToast('info',"Hemos enviado el pago a la cuenta de correo registrada del cliente");
          },error=>{
            if(error['status'] == '401'){
              // this.router.navigate(['/auth/login']);
              this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
                this.storage.saveToken(data['access_token']); 
                this.exportPDFEmitido(row,accion);
              });
            }
          });
        });
      }

    }


    cuadroAlertaRep(){
      this.cuadroAlertaCancelacionRep = true;
      setTimeout(() => {  this.cuadroAlertaCancelacionRep = false}, 5000)
     }
    
  cancelarRep(row){
   
    const Alrt = Swal.mixin({
      showConfirmButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:'Si',      
      cancelButtonText: 'No'      
    })
    
    Alrt.fire({
      icon: 'warning',
      title: 'Estas seguro que deseas cancelar el Pago?. ¿Deseas continuar?'
    }).then((result)=>{
      if(result.isConfirmed){    
        this.blockUI.start('Cancelando...'); // Start blocking 
        this.http.post(this.storage.getapi()+ "fact/cancelarPago ",{id: row.id}).subscribe(data=> {
          this.startToast('success',"Su REP se ha cancelado Correctamente!"); 
          row.estado = "Cancelada";
        },error=>{
          if(error['status'] == '401'){
            //this.router.navigate(['/auth/login']);
            this.UService.Relogin(this.storage.getUser()['email'],this.storage.getHash()).subscribe(data => {
              this.storage.saveToken(data['access_token']); 
              this.ngOnInit();
            });
          }
              this.startToast('error',error['error']['mensaje']); 
          });
        
      }
      if(result.isDismissed){
        this.blockUI.stop();
        return;
      }
    });

}
}