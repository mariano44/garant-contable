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
  selector: 'app-rep',
  templateUrl: './rep.component.html',
  styleUrls: ['./rep.component.scss']
})
export class RepComponent implements OnInit {
  @BlockUI('sellarPago') emiSello: NgBlockUI;
  fechaemision: any;
  monto: any;
  formadepago: any;
  rfcbanco: any;
  cuentaordenante: any;
  bancoemisor: any;
  cuenta: any;
  folioconsecutivo: any;
  folioconsecutivoMostrar: any;
  monedaItems: any = [{ name: "MXN", id: 1 }, { name: "DOLAR", id: 2 }];
  tipocambio: any = 1;
  clienteseleccionado: any;
  clientes: any;
  cfdisget: any;
  cfdis: any;
  pagado: any;
  cliente: any;
  seleccionado: any;
  id: any;
  idcliente: any;
  cp: any;
  fechapago: any;
  pagadoStop: any;
  user: any;
  formasDePagoItems: any = [{ id: "01", name: "Efectivo" }, { id: "02", name: "Cheque Nominativo" }, { id: "03", name: "Transferencia electrónica de fondos" }, { id: "04", name: "Tarjeta de crédito" }, { id: "05", name: "	Monedero electrónico" }, { id: "06", name: "	Dinero electrónico" }, { id: "08", name: "	Vales de despensa" }, { id: "12", name: "	Dación en pago" }, { id: "13", name: "	Pago por subrogación" },
  { id: "14", name: "	Pago por consignación" }, { id: "15", name: "	Condonación" }, { id: "17", name: "	Compensación" }, { id: "23", name: "	Novación" }, { id: "24", name: "	Confusión" }, { id: "25", name: "	Remisión de deuda" }, { id: "26", name: "	Prescripción o caducidad" }, { id: "27", name: "	A satisfacción del acreedor" }, { id: "28", name: "	Tarjeta de débito" }, { id: "29", name: "	Tarjeta de servicios" },
  { id: "30", name: "Aplicación de anticipos" }, { id: "99", name: "	Por definir" }];
  constructor(private bser: BlockUIService, private modalService: NgbModal, private blockUIService: BlockUIService, private datepipe: DatePipe, private storage: TokenStorageService, private http: HttpClient, private UService: UsuariosService, private router: Router, private route: ActivatedRoute,) { }
  activeSellar: boolean = false;
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.user = this.storage.getUser();
    if (this.user['tipo'] == 'cliente') {
      this.clienteseleccionado = this.user.rfc;
    } else {
      this.clienteseleccionado = this.storage.getUltimoCliente();
    }

    this.cfdis = [];
    this.http.get(this.storage.getapi() + "config/users/getData/" + this.clienteseleccionado).subscribe(data => {


      this.cp = data['users'][0]['codigopostalperfil']
    });


    this.http.get(this.storage.getapi() + "fact/folio/" + this.clienteseleccionado).subscribe(data => { //AGREGAR FOLIO CONSECUTIVO
      this.folioconsecutivo = data;
      this.folioconsecutivo = this.folioconsecutivo.folio;
      this.folioconsecutivoMostrar = "P-" + this.folioconsecutivo;
    }
      , error => {
        if (error['status'] == '401') {
          // this.router.navigate(['/auth/login']);
          this.UService.Relogin(this.storage.getUser()['email'], this.storage.getHash()).subscribe(data => {
            this.storage.saveToken(data['access_token']);
            this.ngOnInit();
          });
        }
      });

    this.http.get(this.storage.getapi() + "fact/listas/" + this.clienteseleccionado).subscribe(data => {
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

  OnchangeCliente(e) {
    let idcliente = e.id
    this.idcliente = idcliente;

    this.http.get(this.storage.getapi() + "fact/cfdisppd/" + idcliente).subscribe(data => {
      this.cfdisget = [];

      for (let x = 0; x < data['cfdis'].length; x++) {

        this.cfdisget.push({
          idcfdi: data['cfdis'][x]['id'],
          uuidp: data['cfdis'][x]['uuid'],
          impanterior: data['cfdis'][x]['total'] * 1,
          mensualidad: data['cfdis'][x]['mensualidad'],
          seleccionado: this.seleccionado,
          imppagado: 0.00,
          impinsoluto: 0.00,
          impinsolutovista: ""

        });
      }
    }
      , error => {
        if (error['status'] == '401') {
          // this.router.navigate(['/auth/login']);
          this.UService.Relogin(this.storage.getUser()['email'], this.storage.getHash()).subscribe(data => {
            this.storage.saveToken(data['access_token']);
            this.ngOnInit();
          });
        }
      });
  }

  onChangePagado(e, i) {
    this.monto = 0;
    for (let x = 0; x < this.cfdisget.length; x++) {
      if (this.cfdisget[x].seleccionado === true) {
        if (this.cfdisget[x].pagado > this.cfdisget[x].impanterior) {
          this.cfdisget[x].pagado = this.cfdisget[x].impanterior;

        }
        this.monto += this.cfdisget[x].pagado * 1;
        this.cfdisget[x].imppagado = this.cfdisget[x].pagado * 1;

      }
    }

    this.cfdisget[i].impinsoluto = this.cfdisget[i].impanterior - this.cfdisget[i].pagado;
    this.cfdisget[i].impinsolutovista = formatNumber(this.cfdisget[i].impinsoluto, "en_US", "1.2");
    this.monto = formatNumber(this.monto,"en_US",'1.2');
  }

  parseDate() {
    let fecha = this.fechaemision.split("-");
    let year = fecha[0];
    let month = fecha[1];
    let day = fecha[2]

    this.fechapago = { year, month, day }
  }

  onChangeSeleccionado(e, i) {
    if (e.target.checked === true) {
      this.cfdis.push({
        imppagado: this.cfdisget[i].imppagado
      });
    }
  }

  sellarPago() {
    if (this.cliente === undefined || this.cliente === null || this.cliente === "") {
      this.startToast('warning', 'Favor de seleccionar el Cliente');
      return false;
    }

    if (this.fechaemision === undefined || this.fechaemision === null || this.fechaemision === "") {
      this.startToast('warning', 'Favor de seleccionar la Fecha de Emision');
      return false;
    }

    if (this.formadepago === undefined || this.formadepago === null || this.formadepago === "") {
      this.startToast('warning', 'Favor de seleccionar la Forma de Pago');
      return false;
    }

    let seleccionados = [];
    for (let x = 0; x < this.cfdisget.length; x++) {
      if (this.cfdisget[x].seleccionado === true) {
        seleccionados.push({
          idcfdi: this.cfdisget[x].idcfdi,
          impanterior: this.cfdisget[x].impanterior,
          impinsoluto: this.cfdisget[x].impinsoluto,
          imppagado: this.cfdisget[x].imppagado,
          mensualidad: this.cfdisget[x].mensualidad,
          uuidp: this.cfdisget[x].uuidp,
        });

      }
    }

    this.parseDate()

    let data = {
      rfc: this.clienteseleccionado,
      fechapago: this.fechapago,
      fdp: this.formadepago,
      monto: this.monto,
      cp: this.cp,
      tipocambio: this.tipocambio,
      rfcbanco: this.rfcbanco,
      cuentaordenante: this.cuentaordenante,
      bancoemisor: this.bancoemisor,
      cuenta: this.cuenta,
      folio: this.folioconsecutivo,
      cfdis: seleccionados,
      idcliente: this.idcliente
    }
    this.activeSellar = true;

    this.emiSello.start('Sellando Pago...');
    this.http.post(this.storage.getapi() + "fact/sellarPago", data).subscribe(data => { //Post al back para meterlo a la base de datos.
      this.startToast('success', 'Se ha sellado el pago');
      this.emiSello.stop();
      seleccionados.splice(0, seleccionados.length);
      this.fechaemision = "";
      this.tipocambio = "";
      this.formadepago = "";
      this.monto = 0.00;
      this.cliente = undefined;
      this.cfdisget = [];
      [...this.cfdisget];


    }, error => {
      if (error['status'] == '401') {
        // this.router.navigate(['/auth/login']);
        this.UService.Relogin(this.storage.getUser()['email'], this.storage.getHash()).subscribe(data => {
          this.storage.saveToken(data['access_token']);
          this.ngOnInit();
        });
      }
      this.emiSello.stop();
      this.startToast('error', error['error']['mensaje']);
      this.activeSellar = false;
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

  limpiaFacturas(){
    this.cfdisget = [];
  }
}
