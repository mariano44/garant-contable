import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../../../core/JWT/usuarios.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from 'src/app/core/JWT/token-storage.service';
import { DatePipe, getLocaleTimeFormat } from '@angular/common';
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
import { disableDebugTools } from '@angular/platform-browser';
import { typeSourceSpan } from '@angular/compiler';

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
  selector: 'app-nuevafactura',
  templateUrl: './nuevafactura.component.html',
  styleUrls: ['./nuevafactura.component.scss']
})
export class NuevafacturaComponent implements OnInit {
  @BlockUI('emitirFactura') emiFactura: NgBlockUI;
  //Clientes
  razonsocial: any;
  rfc: any;
  correo: any;
  calle: any;
  noext: any;
  noint: any;
  entrecalle: any;
  ycalle: any;
  colonia: any;
  ciudad: any;
  cp: any;
  estado: any;
  telefono: any;
  idcliente: any;
  idusuario: any;
  estatus: any;
  productoseleccionado: any;
  user: any;
  users: any;
  filtered: any;
  filteredProductos: any;
  filteredFacturas: any;
  //PRODUCTOS
  ivaItems: any = [16, 8, 0, "exento"];
  ivaretItems: any = [10.6667, 6, 5.33, 4, 3];
  isrItems: any = [10];
  //Otros
  people: any;
  cliente: any;
  productos: any;
  clienteseleccionado: any;
  tipodefactura: any = "I";
  tipodefacturaitems: any = [{ id: "I", name: "Ingreso" }, { id: "E", name: "Egreso" }];
  formadepago: any;
  formasDePagoItems: any = [{ id: "01", name: "Efectivo" }, { id: "02", name: "Cheque Nominativo" }, { id: "03", name: "Transferencia electrónica de fondos" }, { id: "04", name: "Tarjeta de crédito" }, { id: "05", name: "	Monedero electrónico" }, { id: "06", name: "	Dinero electrónico" }, { id: "08", name: "	Vales de despensa" }, { id: "12", name: "	Dación en pago" }, { id: "13", name: "	Pago por subrogación" },
  { id: "14", name: "	Pago por consignación" }, { id: "15", name: "	Condonación" }, { id: "17", name: "	Compensación" }, { id: "23", name: "	Novación" }, { id: "24", name: "	Confusión" }, { id: "25", name: "	Remisión de deuda" }, { id: "26", name: "	Prescripción o caducidad" }, { id: "27", name: "	A satisfacción del acreedor" }, { id: "28", name: "	Tarjeta de débito" }, { id: "29", name: "	Tarjeta de servicios" },
  { id: "30", name: "Aplicación de anticipos" }, { id: "99", name: "	Por definir" }];
  metododepago: any;
  metododepagoitems: any = [{ id: "PUE", name: "Pago en una sola exhibición" }, { id: "PPD", name: "Pago en parcialidades o diferido" }];
  usocdfi: any = "G03";
  cdfiItem: any = [{ id: "G01", name: "	Adquisición de mercancías." }, { id: "G02", name: "Devoluciones, descuentos o bonificaciones." }, { id: "G03", name: "Gastos en general." }, { id: "I01", name: "Construcciones." }, { id: "I02", name: "	Mobiliario y equipo de oficina por inversiones." }, { id: "I03", name: "	Equipo de transporte." }, { id: "I04", name: "	Equipo de cómputo y accesorios." }, { id: "I05", name: "	Dados, troqueles, moldes, matrices y herramental" },
  { id: "I06", name: "	Comunicaciones telefónicas" }, { id: "I07", name: "	Comunicaciones satelitales" }, { id: "I08", name: "	Otra maquinaria y equipo" }, { id: "D01", name: "	Honorarios médicos, dentales y gastos hospitalarios" }, { id: "D02", name: "	Gastos médicos por incapacidad o discapacidad" },
  { id: "D03", name: "	Gastos funerales" }, { id: "D04", name: "	Donativos" }, { id: "D05", name: "	Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación)" }, { id: "D06", name: "	Aportaciones voluntarias al SAR" }, { id: "D07", name: "	Primas por seguros de gastos médicos" },
  { id: "D08", name: "	Gastos de transportación escolar obligatoria" }, { id: "D09", name: "Depósitos en cuentas para el ahorro,primas que tengan como base planes de pensiones" }, { id: "D10", name: "	Pagos por servicios educativos (colegiaturas)" }, { id: "P01", name: "	Por definir" }];

  unidadItems: any = [{ id: -1, name: "Selecciona una unidad" }, { id: "H87", name: "H87-Pieza" }, { id: "EA", name: "EA-Elemento" }, { id: "E48", name: "E48-Unidad de servicio" }, { id: "ACT", name: "ACT-Actividad" }, { id: "KGM", name: "KGM-Kilogramo" }, { id: "E51", name: "E51-Trabajo" }, { id: "A9", name: "A9-Tarifa" }, { id: "MTR", name: "MTR-Metro" }, { id: "AB", name: "AB-Paquete a granel" },
  { id: "BB", name: "BB-Caja base" }, { id: "KT", name: "KT-Kit" }, { id: "SET", name: "SET-Conjunto" }, { id: "LTR", name: "LTR-Litro" }, { id: "XBX", name: "XBX-Caja" }, { id: "MON", name: "MON-Mes" }, { id: "HUR", name: "HUR-Hora" },
  { id: "MTK", name: "MTK-Metro Cuadrado" }, { id: "11", name: "11-Equipos" }, { id: "MGM", name: "MGM-Kilogramo" }, { id: "XPK", name: "XPK-Paquete" }, { id: "XKI", name: "XKI-Conjunto de piezas" }, { id: "AS", name: "AS-Variedad" },
  { id: "GRM", name: "GRM-Gramo" }, { id: "PR", name: "PR-Par" }, { id: "DPC", name: "DPC-Docena de Piezas" }, { id: "xun", name: "xun-Unidad" }, { id: "DAY", name: "DAY-Dia" }, { id: "XLT", name: "XLT-Lote" }, { id: "10", name: "10-Grupos" }, { id: "MLT", name: "MLT-Mililitro" }, { id: "E54", name: "E54-Viaje" }];

  monedaItems: any = [{ id: "MXN", name: "Peso mexicano" }, { id: "USD", name: "Dolar" }];
  moneda: any = "MXN";
  codigopostal: any;
  tipodecambio: any = 1;
  numerodepedido: any;
  foliointerno: any;
  importeret: any;
  mostrarimporteret;
  fechadeadmision: any = [];
  index: any;
  i: any;
  data: any;
  claveinterna: any;
  claveproducto: any;
  id: any;
  descripcion: any;
  nombreinterno: any;
  precio: any;
  codigosat: any;
  unidad: any;
  noidentificacion: any;
  cuentapredial: any;
  iva: any;
  subtotal: any;
  descuentos: any;
  total: any;
  totaliva16: any;
  mostrarivatotal16: any;
  totaliva8: any;
  mostrarivatotal8: any;
  totaliva0: any = false;
  ivaret: any;
  mostrarimporteisr: any;
  tasaisr: any;
  isr: any;
  ieps: any;
  importeieps: any;
  basicModalCloseResult: string = '';
  ivas: any = [];
  mostrarImportIva: any;
  isCollapsed: boolean = true;
  idproducto: any = 0;
  x: any;
  importesivas: any = [];
  cantidad: any;
  descuento: any;
  ivaretCut: any;
  clientes: any;
  totalCut: any;
  showisr: boolean = false;
  showivaret: boolean = false;
  showiva8: boolean = false;
  showiva16: boolean = false;
  showieps: boolean = false;
  iva8: any;
  mostrarimporteieps: any;
  iepstotal: any;
  ivaexento: any;
  totalivaexento: any;
  conceptos: any = [{ importe: 0.00, concepto: "", idproducto: "", cantidad: 1, claveproducto: '', exento: '', claveunidad: '', unidad: '', valorunitario: 0.00, subtotal: 0.00, tasaieps: 0.00, impieps: 0.00, tasaiva: 0.00, impiva: 0.00, tasaret: 0.00, impret: 0.00, tasaisr: 0.00, impisr: 0.00, descuento: 0.00, total: 0.00, mostrarTotal: 0.00, mostrarivaret: 0.00, mostrariva: 0.00, mostrarisr: 0.00, mostrarieps: 0.00 }];
  activeTimbrar: boolean = false;
  constructor(private bser: BlockUIService, private modalService: NgbModal, private blockUIService: BlockUIService, private datepipe: DatePipe, private storage: TokenStorageService, private http: HttpClient, private UService: UsuariosService, private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit(): void {

    this.validacionFecha();
    this.router.navigate['/general/roles'];//PENDIENTE

    this.user = this.storage.getUser();
    if (this.user['tipo'] == 'cliente') {
      this.clienteseleccionado = this.user.rfc;
    } else {
      this.clienteseleccionado = this.storage.getUltimoCliente();
    }



    this.http.get(this.storage.getapi() + "config/users/getData/" + this.clienteseleccionado).subscribe(data => {


      this.codigopostal = data['users'][0]['codigopostalperfil']

    }, error => {
      if (error['status'] == '401') {
        // this.router.navigate(['/auth/login']);
        this.UService.Relogin(this.storage.getUser()['email'], this.storage.getHash()).subscribe(data => {
          this.storage.saveToken(data['access_token']);
          this.ngOnInit();
        });
      }
    });

    this.http.get(this.storage.getapi() + "fact/listas/" + this.clienteseleccionado).subscribe(data => {  //Aqui se meten los datos del back a las variables.
      this.clientes = [];
      for (let x = 0; x < data['clientes'].length; x++) {
        if (data['clientes'][x]['estatus'] == 1) {
          this.clientes.push({
            id: data['clientes'][x]['id'],
            razonsocial: data['clientes'][x]['razonsocial'],
            correo: data['clientes'][x]['email'],
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
      for (let x = 0; x < data['productos'].length; x++) {
        this.productos.push({
          id: data["productos"][x]['id'],
          name: data["productos"][x]['nombreinterno'],
          claveinterna: data["productos"][x]['claveinterna'],
          claveproducto: data["productos"][x]['claveproducto'],
          claveunidad: data["productos"][x]['unidad'],
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
          unidad: data["productos"][x]['unidad'],
          ieps: data["productos"][x]['ieps']
        });
      }

      this.filteredProductos = [];
      for (let x = 0; x < data['productos'].length; x++) {
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
          unidad: data["productos"][x]['unidad'],
          ieps: data["productos"][x]['ieps']
        });
      }
      this.filtered = [];
      for (let x = 0; x < data['clientes'].length; x++) {
        if (data['clientes'][x]['estatus'] == 1) {
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


    }, error => {
      if (error['status'] == '401') {
        // this.router.navigate(['/auth/login']);
        this.UService.Relogin(this.storage.getUser()['email'], this.storage.getHash()).subscribe(data => {
          this.storage.saveToken(data['access_token']);
          this.ngOnInit();
        });
      }
    });
  }
  openBasicModal(content) {
    this.modalService.open(content, {}).result.then((result) => {
      this.basicModalCloseResult = "Modal closed" + result
    }).catch((res) => { });
  }
  openXlModal(content) {
    this.modalService.open(content, { size: 'xl' }).result.then((result) => {

    }).catch((res) => { });
  }

  setCP(e) {
    debugger;
    let codigop = e;
    if (e.cp == null) {
      this.codigopostal = 81200
    } else {
      this.codigopostal = e.cp;
    }
  }

  guardarCliente() {  //guardar los datos.
    if (this.rfc == null || this.rfc == "" || this.rfc == undefined) {
      this.startToast('warning', 'Favor de ingresar RFC');
      return false;
    }

    if (this.razonsocial == null || this.razonsocial == "" || this.razonsocial == undefined) {
      this.startToast('warning', 'Favor de ingresar la Razon Social');
      return false;
    }


    let data = {
      razonsocial: this.razonsocial,
      rfccliente: this.rfc,
      correo: this.correo,
      calle: this.calle,
      entrecalle: this.entrecalle,
      ycalle: this.ycalle,
      noext: this.noext,
      noint: this.noint,
      colonia: this.colonia,
      ciudad: this.ciudad,
      cp: this.cp,
      estado: this.estado,
      telefono: this.telefono,
      idcliente: this.idcliente
    }



    this.http.post(this.storage.getapi() + "fact/addc/" + this.clienteseleccionado, data).subscribe(data => {    //Post al back para meterlo a la base de datos.
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
        idcliente: this.idcliente,
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
      this.startToast('success', 'Se ha guardado el cliente correctamente');
    }, error => {
      if (error['status'] == '401') {
        // this.router.navigate(['/auth/login']);
        this.UService.Relogin(this.storage.getUser()['email'], this.storage.getHash()).subscribe(data => {
          this.storage.saveToken(data['access_token']);
        });
      }
      let err = error['error']['message'];
      this.startToast('error', err);
    });

  }

  cerrarModalClientes() {             //Ya que cierras el modal de clientes para que los inputs queden vacios.
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

  guardarProducto() {

    if (this.descripcion == null || this.descripcion == "" || this.descripcion == undefined) {
      this.startToast('warning', 'Favor de ingresar Descripcion');
      return false;
    }

    if (this.claveproducto == null || this.claveproducto == "" || this.claveproducto == undefined) {
      this.startToast('warning', 'Favor de ingresar el Codigo del SAT');
      return false;
    }

    if (this.iva == null || this.iva == undefined) {
      this.startToast('warning', 'Favor de ingresar el IVA');
      return false;
    }
    if (this.unidad == null || this.unidad == "" || this.unidad == undefined) {
      this.startToast('warning', 'Favor de ingresar la Unidad');
      return false;
    }

    let data = {
      descripcion: this.descripcion,
      nombreinterno: this.nombreinterno,
      precio: this.precio,
      unidad: this.unidad,
      cuentapredial: this.cuentapredial,
      claveproducto: this.claveproducto,
      noidentificacion: this.noidentificacion,
      claveinterna: this.claveinterna,
      iva: this.iva,
      ivaret: this.ivaret,
      isr: this.isr,
      ieps: this.ieps,
      estatus: this.estatus

    }



    this.http.post(this.storage.getapi() + "fact/addp/" + this.clienteseleccionado, data).subscribe(data => {
      this.productos.push({
        descripcion: this.descripcion,
        nombreinterno: this.nombreinterno,
        precio: this.precio,
        unidad: this.unidad,
        name: this.nombreinterno,
        cuentapredial: this.cuentapredial,
        claveproducto: this.claveproducto,
        noidentificacion: this.noidentificacion,
        claveinterna: this.claveinterna,
        iva: this.iva,
        ivaret: this.ivaret,
        idproducto: this.idproducto,
        estatus: this.estatus,
        isr: this.isr,
        ieps: this.ieps,
        id: data['id']
      });



      this.ngOnInit()
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
      this.startToast('success', 'Se ha guardado el producto correctamente');


    }, error => {
      if (error['status'] == '401') {
        // this.router.navigate(['/auth/login']);
        this.UService.Relogin(this.storage.getUser()['email'], this.storage.getHash()).subscribe(data => {
          this.storage.saveToken(data['access_token']);


        });
      }
      let err = JSON.parse(error['error']);


    });


  }

  formaDePago() {
    if (this.formadepago === "99") {
      this.metododepagoitems = [{ id: "PPD", name: "Pago en parcialidades o diferido" }];
      this.metododepago = "PPD";
    } else {
      this.metododepagoitems = [{ id: "PUE", name: "Pago en una sola exhibición" }, { id: "PPD", name: "Pago en parcialidades o diferido" }];
      this.metododepago = [{ id: "PPD", name: "Pago en parcialidades o diferido" }];
    }
  }



  cerrarModalProductos() {             //Ya que cierras el modal de productos para que los inputs queden vacios.
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

  indexConcepto(i: any, productoEvent: any) {  //Indice de Concepto
    this.conceptos[i].valorunitario = productoEvent.precio;
    this.conceptos[i].claveproducto = (productoEvent.claveproducto == undefined || productoEvent.claveproducto.length < 8 ? '01010101' : productoEvent.claveproducto);
    this.conceptos[i].claveunidad = (productoEvent.claveunidad == undefined ? 'E48' : productoEvent.claveunidad);
    this.conceptos[i].unidad = (productoEvent.claveunidad == undefined ? 'E48' : productoEvent.claveunidad);
    this.conceptos[i].tasaiva = productoEvent.iva;
    this.conceptos[i].subtotal = (productoEvent.precio * this.conceptos[i].cantidad);
    this.conceptos[i].importe = this.conceptos[i].subtotal;
    if (Number(productoEvent.ieps) > 0) {
      this.ieps = Number(productoEvent.ieps);
    }
    //PENDIENTE ESTO





    this.tasaisr = Number(productoEvent.isr);
    this.conceptos[i].concepto = productoEvent.nombreinterno;


    if (this.conceptos[i].tasaiva === "exento") {
      this.conceptos[i].tasaiva = 0.00;
      this.conceptos[i].impiva = 0.00;
      this.conceptos[i].exento = "exento";
    } else {
      this.conceptos[i].impiva = (productoEvent.precio * this.conceptos[i].cantidad) * (productoEvent.iva / 100);
    }

    if (Number(productoEvent.ieps) != null) {
      this.conceptos[i].tasaieps = Number(productoEvent.ieps);
      this.conceptos[i].impieps = (productoEvent.precio * this.conceptos[i].cantidad) * (productoEvent.ieps / 100);
      this.conceptos[i].mostrarieps = formatNumber(this.conceptos[i].impieps, "en_US", "1.2");

    } else {
      this.conceptos[i].tasaieps = 0;
      this.conceptos[i].impieps = 0.00;
    }

    this.conceptos[i].tasaiva = productoEvent.iva;
    if (productoEvent.ivaret != null && productoEvent.ivaret != 0) {
      this.conceptos[i].tasaret = productoEvent.ivaret;

      let ivaret_ = parseFloat((productoEvent.ivaret / 100).toFixed(6));
      this.conceptos[i].impret = (productoEvent.precio * this.conceptos[i].cantidad) * ivaret_;
      this.conceptos[i].impret = parseFloat(this.conceptos[i].impret.toFixed(2));
      this.conceptos[i].mostrarivaret = formatNumber(this.conceptos[i].impret, "en_US", "1.2");
    } else {
      this.conceptos[i].tasaret = 0;
      this.conceptos[i].mostrarivaret = 0.00;
    }

    if (productoEvent.isr != null && productoEvent.isr != 0) {
      this.conceptos[i].tasaisr = productoEvent.isr;
      this.conceptos[i].impisr = (productoEvent.precio * this.conceptos[i].cantidad) * (productoEvent.isr / 100);
      this.conceptos[i].mostrarisr = formatNumber(this.conceptos[i].impisr, "en_US", "1.2");
    } else {
      this.conceptos[i].tasaisr = 0;
      this.conceptos[i].mostrarisr = 0.00;
    }


    this.conceptos[i].mostrariva = formatNumber(this.conceptos[i].impiva, "en_US", "1.2");


    this.aplicarDescuento(i);
    this.calcularTotales();
  }

  onChangeCantidad(indiceCant: any) { //Indice de Cantidad.
    this.conceptos[indiceCant].subtotal = (this.conceptos[indiceCant].valorunitario * this.conceptos[indiceCant].cantidad);
    this.conceptos[indiceCant].importe = this.conceptos[indiceCant].subtotal;
    let ivaret_ = parseFloat((this.conceptos[indiceCant].tasaret / 100).toFixed(6));




    if (this.conceptos[indiceCant].tasaiva === "exento") {
      this.conceptos[indiceCant].tasaiva = 0.00;
      this.conceptos[indiceCant].impiva = 0.00;
      this.conceptos[indiceCant].exento = "exento";
    } else {
      this.conceptos[indiceCant].impiva = (this.conceptos[indiceCant].valorunitario * this.conceptos[indiceCant].cantidad) * (this.conceptos[indiceCant].tasaiva);
    }





    if (Number(this.conceptos[indiceCant].tasaieps) != null) {
      this.conceptos[indiceCant].tasaieps = Number(this.conceptos[indiceCant].tasaieps);
      this.conceptos[indiceCant].impieps = (this.conceptos[indiceCant].valorunitario * this.conceptos[indiceCant].cantidad) * (this.conceptos[indiceCant].tasaieps / 100);
      this.conceptos[indiceCant].mostrarieps = formatNumber(this.conceptos[indiceCant].impieps, "en_US", "1.2");

    } else {
      this.conceptos[indiceCant].tasaieps = 0;
      this.conceptos[indiceCant].impieps = 0.00;
    }



    if (this.conceptos[indiceCant].tasaret != null && this.conceptos[indiceCant].tasaret != 0) {
      this.conceptos[indiceCant].impret = this.conceptos[indiceCant].subtotal * ivaret_;
      this.conceptos[indiceCant].impret = parseFloat(this.conceptos[indiceCant].impret.toFixed(2));
      this.conceptos[indiceCant].mostrarivaret = formatNumber(this.conceptos[indiceCant].impret, "en_US", "1.2");
    } else {
      this.conceptos[indiceCant].impret = 0;
      this.conceptos[indiceCant].mostrarivaret = 0.00;
    }


    if (this.conceptos[indiceCant].tasaisr != null && this.conceptos[indiceCant].tasaisr != 0) {
      this.conceptos[indiceCant].impisr = this.conceptos[indiceCant].subtotal * (this.conceptos[indiceCant].tasaisr / 100);
      this.conceptos[indiceCant].mostrarisr = formatNumber(this.conceptos[indiceCant].impisr, "en_US", "1.2");
    } else {
      this.conceptos[indiceCant].impisr = 0;
      this.conceptos[indiceCant].mostrarisr = 0.00;
    }

    this.conceptos[indiceCant].impiva = this.conceptos[indiceCant].subtotal * (this.conceptos[indiceCant].tasaiva / 100);
    this.conceptos[indiceCant].mostrariva = formatNumber(this.conceptos[indiceCant].impiva, "en_US", "1.2");
    this.aplicarDescuento(indiceCant);
    this.calcularTotales();
  }

  onChangeDescuento(indiceDesc: any) {
    this.conceptos[indiceDesc].subtotal = (this.conceptos[indiceDesc].valorunitario * this.conceptos[indiceDesc].cantidad);
    this.conceptos[indiceDesc].importe = this.conceptos[indiceDesc].subtotal;

    this.conceptos[indiceDesc].mostrariva = formatNumber(this.conceptos[indiceDesc].impiva, "en_US", "1.2");
    let ivaret_ = parseFloat((this.conceptos[indiceDesc].tasaret / 100).toFixed(6));


    if (this.conceptos[indiceDesc].tasaiva === "exento") {
      this.conceptos[indiceDesc].tasaiva = 0.00;
      this.conceptos[indiceDesc].impiva = 0.00;
      this.conceptos[indiceDesc].exento = "exento";
    } else {
      this.conceptos[indiceDesc].impiva = (this.conceptos[indiceDesc].valorunitario * this.conceptos[indiceDesc].cantidad) * (this.conceptos[indiceDesc].tasaiva);
    }



    if (Number(this.conceptos[indiceDesc].tasaieps) != null) {
      this.conceptos[indiceDesc].tasaieps = Number(this.conceptos[indiceDesc].tasaieps);
      this.conceptos[indiceDesc].impieps = (this.conceptos[indiceDesc].valorunitario * this.conceptos[indiceDesc].cantidad) * (this.conceptos[indiceDesc].tasaieps / 100);
      this.conceptos[indiceDesc].mostrarieps = formatNumber(this.conceptos[indiceDesc].impieps, "en_US", "1.2");

    } else {
      this.conceptos[indiceDesc].tasaieps = 0;
      this.conceptos[indiceDesc].impieps = 0.00;
    }

    if (this.conceptos[indiceDesc].tasaret != null && this.conceptos[indiceDesc].tasaret != 0) {
      this.conceptos[indiceDesc].impret = this.conceptos[indiceDesc].subtotal * ivaret_;
      this.conceptos[indiceDesc].impret = parseFloat(this.conceptos[indiceDesc].impret.toFixed(2));
      this.conceptos[indiceDesc].mostrarivaret = formatNumber(this.conceptos[indiceDesc].impret, "en_US", "1.2");
    } else {
      this.conceptos[indiceDesc].impret = 0;
      this.conceptos[indiceDesc].mostrarivaret = 0.00;
    }

    if (this.conceptos[indiceDesc].tasaisr != null && this.conceptos[indiceDesc].tasaisr != 0) {
      this.conceptos[indiceDesc].impisr = this.conceptos[indiceDesc].subtotal * (this.conceptos[indiceDesc].tasaisr / 100);
      this.conceptos[indiceDesc].mostrarisr = formatNumber(this.conceptos[indiceDesc].impisr, "en_US", "1.2");
    } else {
      this.conceptos[indiceDesc].impisr = 0;
      this.conceptos[indiceDesc].mostrarisr = 0.00;
    }


    this.aplicarDescuento(indiceDesc);
    this.calcularTotales();
  }

  aplicarDescuento(indice: any) { //Aplicar descuento al concepto con indice:any
    if (this.conceptos[indice].descuento >= 0) {


      if (this.conceptos[indice].tasaiva === "exento") {
        this.conceptos[indice].tasaiva = 0.00;
        this.conceptos[indice].impiva = 0.00;
        this.conceptos[indice].exento = "exento";
      } else {
        this.conceptos[indice].impiva = (this.conceptos[indice].valorunitario * this.conceptos[indice].cantidad) * (this.conceptos[indice].tasaiva);
      }

      this.conceptos[indice].subtotal = (this.conceptos[indice].valorunitario * this.conceptos[indice].cantidad) - this.conceptos[indice].descuento;
      this.conceptos[indice].importe = this.conceptos[indice].subtotal;
      this.conceptos[indice].impiva = this.conceptos[indice].subtotal * (this.conceptos[indice].tasaiva / 100);
      this.conceptos[indice].mostrariva = formatNumber(this.conceptos[indice].impiva, "en_US", "1.2");
      let ivaret_ = parseFloat((this.conceptos[indice].tasaret / 100).toFixed(6));



      if (Number(this.conceptos[indice].tasaieps) != null) {
        this.conceptos[indice].tasaieps = Number(this.conceptos[indice].tasaieps);
        this.conceptos[indice].impieps = (this.conceptos[indice].valorunitario * this.conceptos[indice].cantidad) * (this.conceptos[indice].tasaieps / 100);
        this.conceptos[indice].mostrarieps = formatNumber(this.conceptos[indice].impieps, "en_US", "1.2");
      } else {
        this.conceptos[indice].tasaieps = 0;
        this.conceptos[indice].impieps = 0.00;
      }


      if (this.conceptos[indice].tasaret != null && this.conceptos[indice].tasaret != 0) {
        this.conceptos[indice].impret = this.conceptos[indice].subtotal * ivaret_;
        this.conceptos[indice].impret = parseFloat(this.conceptos[indice].impret.toFixed(2));
        this.conceptos[indice].mostrarivaret = formatNumber(this.conceptos[indice].impret, "en_US", "1.2");
      } else {
        this.conceptos[indice].impret = 0;
        this.conceptos[indice].mostrarivaret = 0.00;
      }

      if (this.conceptos[indice].tasaisr != null && this.conceptos[indice].tasaisr != 0) {
        this.conceptos[indice].impisr = this.conceptos[indice].subtotal * (this.conceptos[indice].tasaisr / 100);
        this.conceptos[indice].mostrarisr = formatNumber(this.conceptos[indice].impisr, "en_US", "1.2");
      } else {
        this.conceptos[indice].impisr = 0;
        this.conceptos[indice].mostrarisr = 0.00;
      }

      this.conceptos[indice].total = (((this.conceptos[indice].subtotal) + (this.conceptos[indice].impiva + (this.conceptos[indice].impieps))) - this.conceptos[indice].impret) - this.conceptos[indice].impisr;
      this.conceptos[indice].mostrarTotal = formatNumber(this.conceptos[indice].total, "en_US", "1.2");

      this.calcularTotales();
    } else {

      if (this.conceptos[indice].tasaiva === "exento") {
        this.conceptos[indice].tasaiva = 0.00;
        this.conceptos[indice].impiva = 0.00;
        this.conceptos[indice].exento = "exento";
      } else {
        this.conceptos[indice].impiva = (this.conceptos[indice].valorunitario * this.conceptos[indice].cantidad) * (this.conceptos[indice].tasaiva);
      }


      if (Number(this.conceptos[indice].tasaieps) != null) {
        this.conceptos[indice].tasaieps = Number(this.conceptos[indice].tasaieps);
        this.conceptos[indice].impieps = (this.conceptos[indice].valorunitario * this.conceptos[indice].cantidad) * (this.conceptos[indice].tasaieps / 100);
        this.conceptos[indice].mostrarieps = formatNumber(this.conceptos[indice].impieps, "en_US", "1.2");
      } else {
        this.conceptos[indice].tasaieps = 0;
        this.conceptos[indice].impieps = 0.00;
      }

      if (this.conceptos[indice].tasaret != null && this.conceptos[indice].tasaret != 0) {
        this.conceptos[indice].mostrarivaret = formatNumber(parseFloat(this.conceptos[indice].impret), "en_US", "1.2");
      } else {
        this.conceptos[indice].impret = 0;
        this.conceptos[indice].mostrarivaret = 0.00;
      }

      if (this.conceptos[indice].tasaisr != null && this.conceptos[indice].tasaisr != 0) {
        this.conceptos[indice].impisr = this.conceptos[indice].subtotal * (this.conceptos[indice].tasaisr / 100);
        this.conceptos[indice].mostrarisr = formatNumber(this.conceptos[indice].impisr, "en_US", "1.2");
      } else {
        this.conceptos[indice].impisr = 0;
        this.conceptos[indice].mostrarisr = 0.00;
      }

      this.conceptos[indice].total = (((this.conceptos[indice].subtotal) + (this.conceptos[indice].impiva) + (this.conceptos[indice].impieps)) - this.conceptos[indice].impret) - this.conceptos[indice].impisr;
      this.conceptos[indice].mostrarTotal = formatNumber(parseFloat(this.conceptos[indice].total), "en_US", "1.2");
      this.calcularTotales();
    }


  }

  AgregarConcepto() {
    this.conceptos.push({
      concepto: "",
      idproducto: "",
      cantidad: 1,
      claveproducto: '',
      claveunidad: '',
      unidad: '',
      importe: 0.00,
      valorunitario: 0.00,
      subtotal: 0.00,
      tasaieps: 0.00,
      impieps: 0.00,
      tasaiva: 0.00,
      impiva: 0.00,
      tasaret: 0.00,
      impret: 0.00,
      tasaisr: 0.00,
      impisr: 0.00,
      descuento: 0.00,
      total: 0.00,
      mostrarTotal: 0.00,
      mostrarivaret: 0.00,
      mostrariva: 0.00,
      mostrarisr: 0.00
    });

  }

  eliminarConcepto(indice: any) {
    this.conceptos.splice(indice, 1);  //Elimina el Array del indice que le de.
    this.calcularTotales();
  }


  calcularTotales() {
    this.subtotal = 0;
    this.iva = 0;
    this.isr = 0;
    this.importeieps = 0;
    this.descuentos = 0;
    this.total = 0;
    this.mostrarimporteret = 0;
    this.importeret = 0;
    this.mostrarimporteisr = 0;
    this.mostrarimporteieps = 0;
    this.iepstotal = 0;
    for (let x = 0; x < this.conceptos.length; x++) {
      this.subtotal += this.conceptos[x].subtotal;
      this.iva += this.conceptos[x].impiva;
      this.mostrarimporteret += this.conceptos[x].impret;
      this.importeret += this.conceptos[x].impret;
      this.isr += this.conceptos[x].impisr;
      this.mostrarimporteisr += this.conceptos[x].impisr;
      this.descuentos += this.conceptos[x].descuento;
      this.total += parseFloat(this.conceptos[x].total);
      this.iepstotal += this.conceptos[x].impieps;
      this.mostrarimporteieps += this.conceptos[x].impieps;
      this.importeieps += this.conceptos[x].impieps;
    }


    this.mostrarimporteieps = formatNumber(this.mostrarimporteieps, "en_US", "1.2");
    this.subtotal = formatNumber(this.subtotal, "en_US", "1.2");
    this.iva = formatNumber(this.iva, "en_US", "1.2");
    this.mostrarImportIva = this.iva;
    this.mostrarimporteret = (this.mostrarimporteret > 0 ? formatNumber(this.mostrarimporteret, "en_US", "1.2") : 0.00);
    this.showivaret = (this.mostrarimporteret > 0 ? true : false);
    this.mostrarimporteisr = (this.mostrarimporteisr > 0 ? formatNumber(this.mostrarimporteisr, "en_US", "1.2") : 0.00);
    this.showisr = (this.mostrarimporteisr > 0 ? true : false);
    this.descuentos = (this.descuento = 0 ? formatNumber(this.descuento, "en_US", "1.2") : 0.00);

    this.total = formatNumber(this.total, "en_US", "1.2");
    let iva16 = this.conceptos.filter(x => x.tasaiva === "16");
    this.totaliva16 = iva16.reduce((prev, actual) => prev + actual.impiva, 0);




    let iva8 = this.conceptos.filter(x => x.tasaiva === "8");
    this.ivaexento = this.conceptos.filter(x => x.tasaiva === "exento");

    this.totaliva8 = iva8.reduce((prev, actual) => prev + actual.impiva, 0);
    let iva0 = this.conceptos.filter(x => x.tasaiva === "0");
    this.totaliva0 = iva0.length > 0 ? true : false;
    this.mostrarivatotal16 = formatNumber(this.totaliva16, "en_US", "1.2");
    this.mostrarivatotal8 = formatNumber(this.totaliva8, "en_US", "1.2");

  }
  validacionFecha() {
    let diaHoy = new Date();
    let fechaYear = diaHoy.getFullYear();
    let fechaMes = diaHoy.getUTCMonth() + 1;
    let fechaDia = diaHoy.getDate();

    this.fechadeadmision = { year: fechaYear, month: fechaMes, day: fechaDia };

  }

  emitirFactura() {
    if (this.metododepago === undefined || this.metododepago === null) {
      this.startToast('warning', 'Favor de seleccionar el metodo de pago');
      return false;
    }

    if (this.tipodefactura === undefined || this.tipodefactura === null) {
      this.startToast('warning', 'Favor de seleccionar el Tipo de Factura');
      return false;
    }
    if (this.formadepago === undefined || this.formadepago === null) {
      this.startToast('warning', 'Favor de seleccionar la Forma de Pago');
      return false;
    }
    if (this.usocdfi === undefined || this.usocdfi === null) {
      this.startToast('warning', 'Favor de seleccionar el uso CDFI');
      return false;
    }
    if (this.tipodecambio === 1 && this.moneda === "USD") {
      this.startToast('warning', 'Favor de ingresar el tipo de cambio');
      return false;
    }
    if (this.codigopostal === undefined || this.codigopostal === null) {
      this.codigopostal = "81200";
    }
    if (this.importeieps === NaN || this.importeieps === undefined || this.importeieps === null) {
      this.importeieps = 0;
    }

    if (this.fechadeadmision === NaN || this.fechadeadmision === undefined || this.fechadeadmision === null) {
      this.validacionFecha();
    }
    if (this.cliente === undefined || this.cliente === null) {
      this.startToast('warning', 'Favor de seleccionar el Cliente');
      return false;
    }
    

    this.ivas = [];
    this.importesivas = [];


    for (let x = 0; x < this.conceptos.length; x++) {
      if (this.conceptos[x].exento === 'exento') {
        this.ivas.push({
          tasa: 'exento'
        });
        this.importesivas.push({
          total: 0
        })
      }
    }


    if (this.totaliva16 > 0) {
      this.ivas.push({
        tasa: 16
      })
      this.importesivas.push({
        total: this.totaliva16
      })
    }
    if (this.totaliva8 > 0) {
      this.ivas.push({

        tasa: 8
      })
      this.importesivas.push({
        total: this.totaliva8
      })
    }
    if (this.totaliva0 > 0) {
      this.ivas.push({
        tasa: 0
      })
      this.importesivas.push({

        total: 0
      })
    }

    let data = {
      rfc: this.clienteseleccionado,
      idcliente: this.cliente,
      foliointerno: this.foliointerno,
      tipo: this.tipodefactura,
      formadepago: this.formadepago,
      metododepago: this.metododepago,
      usocfdi: this.usocdfi,
      moneda: this.moneda,
      tipocambio: this.tipodecambio,
      fechaemision: this.fechadeadmision,
      cp: this.codigopostal,
      subtotal: this.subtotal,
      importeiva: this.importesivas,
      descuento: this.descuentos,
      total: this.total,
      prueba: 1,
      tasaiva: this.ivas,
      tasaret: 0.00,
      importeret: this.importeret,
      tasaieps: this.ieps,
      importeieps: this.importeieps,
      tasaisr: this.tasaisr,
      importeisr: this.isr,
      conceptos: this.conceptos,

    };
    this.activeTimbrar = true;
    this.emiFactura.start('Emitiendo Factura...');


    this.http.post(this.storage.getapi() + "fact/timbrar", data).subscribe(data => {
      if (data['status'] != 400) {
        this.startToast('success', 'Se ha timbrado correctamente');
        this.emiFactura.stop();
        this.router.navigate(['/general/facturacion']);
      } else {
        this.startToast('error', data['mensaje']);
        this.emiFactura.stop();
      }

    }, error => {
      if (error['status'] == '401') {
        // this.router.navigate(['/auth/login']);
        this.UService.Relogin(this.storage.getUser()['email'], this.storage.getHash()).subscribe(data => {
          this.storage.saveToken(data['access_token']);
          this.ngOnInit();
        });
      }
      this.startToast('error', error['msg']);
      this.activeTimbrar = false;
    });
  }

  startToast(type: any, message: any) {
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