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
import { exit } from 'process';
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
  selector: 'app-nomina',
  templateUrl: './nomina.component.html',
  styleUrls: ['./nomina.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NominaComponent implements OnInit {
  @BlockUI('contramodal') contramodal: NgBlockUI;
  @BlockUI('perfildiv') perfildiv: NgBlockUI;
  @BlockUI('susModal') susModal: NgBlockUI;
  @BlockUI("block-item") blockUI;
  @BlockUI('subirNomina') subNomina: NgBlockUI;
  rows: any = [{ Receptor: "Mariano Recio Parra", Fecha: "24/03", Total: 200, Estado: "Activo", Folio: "2030AS", }];
  columnsemi: any = [{ name: 'numEmpleado' }, { name: 'nombre' }, { name: 'fechaIngreso' }, { name: "rfc" }, { name: 'curp' }, { name: 'numSeguridadSocial' }, { name: 'departamento' }, { name: 'puesto' }, { name: 'estado' }, { name: 'pais' }, { name: 'periodicidadPago' },
  { name: 'regimenContratacion' }, { name: 'tipoContrato' }, { name: 'tipoJornada' }, { name: 'claseRiesgo' }, { name: 'tipoNomina' }, { name: 'formaPago' }, { name: 'metodoPago' }, { name: "accion" }];
  //SELECTS
  periodicidadPagoItems: any = [{ id: "01", name: "Diario" }, { id: "02", name: "Semanal" }, { id: "03", name: "Catorcenal" }, { id: "04", name: "Quincenal" }, { id: "05", name: "Mensual" }, { id: "06", name: "Bimestral" }, { id: "07", name: "Unidad Obra" }, { id: "08", name: "Comision" }, { id: "09", name: "Precio Alzado" }, { id: "10", name: "Decenal" }, { id: "99", name: "Otra Periodicidad" }];
  tipoContratoItems: any = [{ id: "01", name: "Contrato de trabajo por tiempo indeterminado" }, { id: "02", name: "Contrato de trabajo para obra determinada" }, { id: "03", name: "Contrato de trabajo por tiempo determinado" }, { id: "04", name: "Contrato de trabajo por temporada" }, { id: "05", name: "Contrato de trabajo sujeto a prueba" }, { id: "06", name: "Contrato de trabajo con capacitacion inicial" },
  { id: "07", name: "Modalidad de contratacion por pago de hora laborada" }, { id: "08", name: "Modalidad de trabajo por comision laboral" }, { id: "09", name: "Modalidades de contratacion donde no existe relacion de trabajo" }, { id: "10", name: "Jubilacion,pension,retiro" }, { id: "99", name: "Otro contrato" },];
  tipoJornadaItems: any = [{ id: "01", name: "Diurna" }, { id: "02", name: "Nocturna" }, { id: "03", name: "Mixta" }, { id: "04", name: "Por hora" }, { id: "05", name: "Reducida" }, { id: "06", name: "Continuada" }, { id: "07", name: "Partida" }, { id: "08", name: "Por turnos" }, { id: "99", name: "Otra Jornada" }];
  formasDePagoItems: any = [{ id: "01", name: "Efectivo" }, { id: "02", name: "Cheque Nominativo" }, { id: "03", name: "Transferencia electrónica de fondos" }, { id: "04", name: "Tarjeta de crédito" }, { id: "05", name: "	Monedero electrónico" }, { id: "06", name: "	Dinero electrónico" }, { id: "08", name: "	Vales de despensa" }, { id: "12", name: "	Dación en pago" }, { id: "13", name: "	Pago por subrogación" },
  { id: "14", name: "	Pago por consignación" }, { id: "15", name: "	Condonación" }, { id: "17", name: "	Compensación" }, { id: "23", name: "	Novación" }, { id: "24", name: "	Confusión" }, { id: "25", name: "	Remisión de deuda" }, { id: "26", name: "	Prescripción o caducidad" }, { id: "27", name: "	A satisfacción del acreedor" }, { id: "28", name: "	Tarjeta de débito" }, { id: "29", name: "	Tarjeta de servicios" },
  { id: "30", name: "Aplicación de anticipos" }, { id: "99", name: "	Por definir" }];
  metododepagoitems: any = [{ id: "PUE", name: "Pago en una sola exhibición" }, { id: "PPD", name: "Pago en parcialidades o diferido" }];
  tipoDeNominaItems: any = [{ id: "O", name: "Nómina ordinaria " }, { id: "E", name: "Nómina extraordinaria" }];
  sindicalizadoItems: any = [{ id: 0, name: "Si" }, { id: 1, name: "No" }];
  sindicalizado: any;
  regimenItems: any = [{ id: "02", name: "Sueldos" }, { id: "03", name: "Jubilados" }, { id: "04", name: "Pensionados" }, { id: "05", name: "Asimilados Miembros Sociedades Cooperativas Produccion" }, { id: "06", name: "Asimilados Miembros Sociedades Asociaciones Civiles" },
  { id: "07", name: "Asimilados Miembros de Consejos" }, { id: "08", name: "Asimilados Comisionistas" }, { id: "09", name: "Asimilados Honorarios" }, { id: "10", name: "Asimilados Acciones" }, { id: "11", name: "Asimilados Otros" }, { id: "12", name: "Jubilados o Pensionados" },
  { id: "13", name: "Indemnizacion o Separacion" }, { id: "99", name: "Otros Regimen" }];

  claseriesgoItems: any = [{ id: "1", name: "Clase I" }, { id: "2", name: "Clase II" }, { id: "3", name: "Clase III" }, { id: "4", name: "Clase IV" }, { id: "99", name: "NO APLICA" }];
  entidadItems: any = [{ id: "01", name: "Aguascalientes" }, { id: "02", name: "Baja California" }, { id: "03", name: "Baja California Sur" }, { id: "04", name: "Campeche" }, { id: "05", name: "Coahuila de Zaragoza" }, { id: "06", name: "Colima" },
  { id: "07", name: "Chiapas" }, { id: "08", name: "Chihuahua" }, { id: "09", name: "CDMX" }, { id: "10", name: "Durango" }, { id: "11", name: "Guanajuato" }, { id: "12", name: "Guerrero" }, { id: "13", name: "Hidalgo" },
  { id: "14", name: "Jalisco" }, { id: "15", name: "México" }, { id: "16", name: "Michoacán de Ocampo" }, { id: "17", name: "	Morelos" }, { id: "18", name: "Nayarit" }, { id: "19", name: "Nuevo León" },
  { id: "20", name: "Oaxaca" }, { id: "21", name: "	Puebla" }, { id: "22", name: "Querétaro" }, { id: "23", name: "Quintana Roo" }, { id: "24", name: "	San Luis Potosí" }, { id: "25", name: "Sinaloa" }, { id: "26", name: "Sonora" },
  { id: "27", name: "	Tabasco" }, { id: "28", name: "Tamaulipas" }, { id: "29", name: "Tlaxcala" }, { id: "30", name: "Veracruz de Ignacio de la Llave" }, { id: "31", name: "Yucatán" }, { id: "32", name: "Zacatecas" }];
  claseriesgo: any;
  entidad: any
  //Data-Table
  limite: any = 10;
  //inputVars
  registropatronal: any;
  numEmpleado: any;
  nombre: any;
  entidadfederativa: any;
  fechaingreso: any;
  rfcTrabajador: any;
  nombres: any;
  pais: any;
  curp: any;
  numSeguridadSocial: any;
  departamento: any;
  puesto: any;
  periodicidadPago: any;
  tipoJornada: any;
  tipoContrato: any;
  tipoNomina: any;
  isOn: any;
  contrasena: any;
  formadepago: any;
  metododepago: any;
  razonsocial: any;
  apellidos: any;
  rfc: any;
  regimen: any;
  regimenfiscal: any;
  estadoTrabajador: any;
  descripcion: any;
  //Others
  loadingIndicator: any;
  ColumnMode: any;
  clienteseleccionado: any;
  user: any;
  nombreCompleto: any;
  defaultNavActiveId: any;
  cuadroAlertaB: any;
  finRelacion: any;
  nuevoTrabajadorBoolean: any;
  guardarTrabajadorOn: any;
  nuevoTrabajadorOn: any;
  edicionOn: any;
  textButton: any;
  guardarEditarOn: any;
  editarOn: any;
  newfilename: any;
  newfile: any;
  idPatron: any;
  nominas: any;
  entidadfederativaPatron: any;
  empleados: any;
  patronGuardado: any;
  clickBotonEditar: any;
  idTrabajador: any;
  estado: any;
  idusuario: any;
  estaDesactivado: any;
  //MODAL
  nombreModal: any;
  numEmpleadoModal: any;
  fechaIngresoModal: any;
  rfcModal: any;
  curpModal: any;
  nssModal: any;
  departamentoModal: any
  puestoModal: any;

  paisModal: any;
  entidadModal: any;
  claseRiesgoModal: any;
  regimenModal: any;
  tipoContratoModal: any;
  sindicalizadoModal: any;
  tipoNominaModal: any;
  formadepagoModal: any;
  tipoJornadaModal: any;
  periodicidadModal: any;
  quienve: any;
  rol: any;
  rowIndexx: any;
  constructor(private bser: BlockUIService, private modalService: NgbModal, private blockUIService: BlockUIService, private datepipe: DatePipe, private storage: TokenStorageService, private http: HttpClient, private UService: UsuariosService, private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.quienve = this.storage.getUser()['tipo'];
    this.rol = this.storage.getUser()['rolid'];
    this.cuadroAlerta()
    this.user = this.storage.getUser();
    if (this.user['tipo'] == 'cliente') {
      this.clienteseleccionado = this.user.rfc;
    } else {
      this.clienteseleccionado = this.storage.getUltimoCliente();
    }


    this.editarOn = true;
    this.http.get(this.storage.getapi() + "nom/listas/" + this.clienteseleccionado).subscribe(data => {


      //NOMINAS//
      this.nominas = [];
      for (let x = 0; x < data['nominas'].length; x++) {
        this.nominas.push({
          archivo: data['nominas'][x]['archivo'],
          descripcion: data['nominas'][x]['descripcion'],
          id: data['nominas'][x]['id'],
        });
      }


      //EMPLEADOS//
      this.empleados = [];
      for (let x = 0; x < data['empleados'].length; x++) {
        this.empleados.push({
          nombre: data['empleados'][x]['nombre'],
          iniciolaboral: this.datepipe.transform(data['empleados'][x]['iniciolaboral'], "dd/MM/yyyy"),
          estado: data['empleados'][x]['activo'],
          curp: data['empleados'][x]['curp'],
          rfc: data['empleados'][x]['rfc'],
          departamento: data['empleados'][x]['departamento'],
          entidad: data['empleados'][x]['entidadfederativa'],
          formadepago: data['empleados'][x]['formadepago'],
          id: data['empleados'][x]['id'],
          idusuario: data['empleados'][x]['idusuario'],
          numempleado: data['empleados'][x]['numempleado'],
          numeross: data['empleados'][x]['numeross'],
          pais: data['empleados'][x]['pais'],
          periodicidad: data['empleados'][x]['periodicidad'],
          puesto: data['empleados'][x]['puesto'],
          regimen: data['empleados'][x]['regimencontratacion'],
          sindicalizado: data['empleados'][x]['sindicalizado'],
          tipodecontrato: data['empleados'][x]['tipodecontrato'],
          tipodejornada: data['empleados'][x]['tipodejornada'],
          tipodenomina: data['empleados'][x]['tipodenomina'],
          claseriesgo: data['empleados'][x]['clasederiesgo'],
          nominaOn: false,
          nominaOff: ""
        })
        if (this.empleados[x].estado === 1) {
          this.empleados[x].estado = "Activo"
        }else if(this.empleados[x].estado === 0) {
          this.empleados[x].estado = "Inactivo"
          this.empleados[x].nominaOff = "empleadoInactivo";
          this.empleados[x].nominaOn = true;
        }else if(this.empleados[x].estado === 2) {
          this.empleados[x].estado = "Baja"
          this.empleados[x].nominaOff = "empleadoInactivo";
          this.empleados[x].nominaOn = true;
        }
      }
      //PATRON//
      this.registropatronal = data['patron'][0]['registropatronal'];
      this.entidadfederativaPatron = data['patron'][0]['entidad'];
      this.contrasena = data['patron'][0]['contra'];
      this.descripcion = data['patron'][0]['comentario'];
      this.idPatron = data['patron'][0]['id'];


    });





    this.http.get(this.storage.getapi() + "config/users/getData/" + this.clienteseleccionado).subscribe(data => {

      this.nuevoTrabajadorBoolean = true;
      this.textButton = "Guardar Trabajador";

      this.cuadroAlerta();

      if (data['users'][0]['regimen'] === "601") {
        this.regimenfiscal = "Persona Moral";
      } else if (data['users'][0]['regimen'] === "606") {
        this.regimenfiscal = "Arrendamiento";
      } else if (data['users'][0]['regimen'] === "625") {
        this.regimenfiscal = "Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas";
      } else if (data['users'][0]['regimen'] === "621") {
        this.regimenfiscal = "Régimen de incorporación fiscal";
      } else if (data['users'][0]['regimen'] === "612") {
        this.regimenfiscal = "Persona física con actividad empresarial o profesional";
      }

      this.nombres = data['users'][0]['nombres']
      this.razonsocial = data['users'][0]['razonsocial']
      this.apellidos = data['users'][0]['apellidos']
      this.rfc = data['users'][0]['rfc']
      this.curp = (data['users'][0]['curp'] ? null : "")
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


  handleFileInputD(event: any) {
    if (event.target.files.length) {
      let fileName = event.target.files[0].name;
      this.newfilename = event.target.files[0].name;
      this.newfile = event.target.files[0];

    }
  }

  GuardarArchivo() {
    if (this.newfile === undefined) {
      this.startToast('warning', 'Favor de seleccionar el archivo');
      return false;
    }

    let formData: FormData = new FormData();
    formData.append('rfc', this.rfc);
    formData.append('descripcion', this.newfilename);
    formData.append('archivo', this.newfile);
    this.subNomina.start('Subiendo Nomina...');
    this.http.post(this.storage.getapi() + "nom/agregarNom", formData).subscribe(data => {

      this.subNomina.stop();
      this.startToast('success', 'Se ha guardado la Nomina');

      this.nominas.push({
        archivo: this.newfile,
        descripcion: this.newfilename,
      })
      this.nominas = [...this.nominas];
      this.ngOnInit();
    });

  }

  guardarTrabajador() {
    if (this.clickBotonEditar === true) {

      if (this.numEmpleado === undefined) {
        this.startToast('warning', 'Favor de ingresar El Numero de empleado');
        return false;
      }
      if (this.nombre === undefined) {
        this.startToast('warning', 'Favor de ingresar El nombre completo del trabajador');
        return false;
      }
      if (this.fechaingreso === undefined) {
        this.startToast('warning', 'Favor de ingresar La fecha de ingreso');
        return false;
      }
      if (this.rfcTrabajador === undefined) {
        this.startToast('warning', 'Favor de ingresar El RFC del trabajador');
        return false;
      }
      if (this.curp === undefined) {
        this.startToast('warning', 'Favor de ingresar El curp del trabajador');
        return false;
      }
      if (this.numSeguridadSocial === undefined) {
        this.startToast('warning', 'Favor de ingresar El Numero de seguridad social');
        return false;
      }
      if (this.departamento === undefined) {
        this.startToast('warning', 'Favor de ingresar El departamento');
        return false;
      }

      this.nuevoTrabajadorOn = false;
      this.guardarTrabajadorOn = false;
      this.nuevoTrabajadorBoolean = true;
      this.edicionOn = false;
      let data = {
        rfc: this.rfc,
        numempleado: this.numEmpleado,
        nombre: this.nombre,
        iniciolaboral: this.fechaingreso,
        rfcemp: this.rfcTrabajador,
        curp: this.curp,
        numeross: this.numSeguridadSocial,
        departamento: this.departamento,
        puesto: this.puesto,
        entidadfederativa: this.entidadfederativa,
        pais: this.pais,
        periodicidad: this.periodicidadPago,
        regimencontratacion: this.regimen,
        tipodecontrato: this.tipoContrato,
        tipodejornada: this.tipoJornada,
        clasederiesgo: this.claseriesgo,
        tipodenomina: this.tipoNomina,
        formadepago: this.formadepago,
        sindicalizado: this.sindicalizado,
        finRelacion: this.finRelacion
      }
      this.http.post(this.storage.getapi() + "nom/editarEmp/" + this.idTrabajador, data).subscribe(data => {
        if(this.finRelacion != undefined && this.finRelacion != ''){
          this.startToast('Success', 'El trabajador se ha dado de baja correctamente.');
        }else{
          this.startToast('success', 'El trabajador se ha actualizado correctamente.');
        }
        this.ngOnInit();
        this.empleados = [...this.empleados];
        this.rfc = "";
        this.numEmpleado = "";
        this.nombre = "";
        this.fechaingreso = "";
        this.rfcTrabajador = "";
        this.curp = "";
        this.numSeguridadSocial = "";
        this.departamento = "";
        this.puesto = "";
        this.entidadfederativa = "";
        this.pais = "";
        this.periodicidadPago = "";
        this.regimen = "";
        this.tipoContrato = "";
        this.tipoJornada = "";
        this.claseriesgo = "";
        this.tipoNomina = "";
        this.formadepago = "";
        this.sindicalizado = "";
        this.claseriesgo = "";
        this.finRelacion = "";
      });

    } else {


      if (this.numEmpleado === undefined) {
        this.startToast('warning', 'Favor de ingresar El Numero de empleado');
        return false;
      }
      if (this.nombre === undefined) {
        this.startToast('warning', 'Favor de ingresar El nombre completo del trabajador');
        return false;
      }
      if (this.fechaingreso === undefined) {
        this.startToast('warning', 'Favor de ingresar La fecha de ingreso');
        return false;
      }
      if (this.rfcTrabajador === undefined) {
        this.startToast('warning', 'Favor de ingresar El RFC del trabajador');
        return false;
      }
      if (this.curp === undefined) {
        this.startToast('warning', 'Favor de ingresar El curp del trabajador');
        return false;
      }
      if (this.numSeguridadSocial === undefined) {
        this.startToast('warning', 'Favor de ingresar El Numero de seguridad social');
        return false;
      }
      if (this.departamento === undefined) {
        this.startToast('warning', 'Favor de ingresar El departamento');
        return false;
      }

      this.nuevoTrabajadorOn = false;
      this.guardarTrabajadorOn = false;
      this.nuevoTrabajadorBoolean = true;
      this.edicionOn = false;

      let data = {
        rfc: this.rfc,
        numempleado: this.numEmpleado,
        nombre: this.nombre,
        iniciolaboral: this.fechaingreso,
        rfcemp: this.rfcTrabajador,
        curp: this.curp,
        numeross: this.numSeguridadSocial,
        departamento: this.departamento,
        puesto: this.puesto,
        entidadfederativa: this.entidadfederativa,
        pais: this.pais,
        periodicidad: this.periodicidadPago,
        regimencontratacion: this.regimen,
        tipodecontrato: this.tipoContrato,
        tipodejornada: this.tipoJornada,
        clasederiesgo: this.claseriesgo,
        tipodenomina: this.tipoNomina,
        formadepago: this.formadepago,
        sindicalizado: this.sindicalizado

      }
      this.http.post(this.storage.getapi() + "nom/agregarEmp", data).subscribe(data => {
        this.startToast('success', 'El trabajador se ha agregado correctamente.');
        this.ngOnInit();
        this.empleados = [...this.empleados];
        this.rfc = "";
        this.numEmpleado = "";
        this.nombre = "";
        this.fechaingreso = "";
        this.rfcTrabajador = "";
        this.curp = "";
        this.numSeguridadSocial = "";
        this.departamento = "";
        this.puesto = "";
        this.entidadfederativa = "";
        this.pais = "";
        this.periodicidadPago = "";
        this.regimen = "";
        this.tipoContrato = "";
        this.tipoJornada = "";
        this.claseriesgo = "";
        this.tipoNomina = "";
        this.formadepago = "";
        this.sindicalizado = "";
        this.claseriesgo = "";
      }, error => {
        if (error['status'] == '401') {
          // this.router.navigate(['/auth/login']);
          this.UService.Relogin(this.storage.getUser()['email'], this.storage.getHash()).subscribe(data => {
            this.storage.saveToken(data['access_token']);
            this.ngOnInit();
          });
        }

        this.startToast('error', error['error']['message']);
      });


    }
  }

  DescargarNomina(row: any) {
    let data = {
      rfc: this.rfc,
      archivo: row.descripcion
    }
    this.http.post(this.storage.getapi() + "nom/descargar", data, { responseType: 'arraybuffer' }).subscribe(data => {
      const blob = new Blob([data], { type: 'application/octet-stream' });
      saveAs(blob, row.archivo);
      this.startToast('success', 'Se ha Descargado la Nomina');
    });
  }

  BorrarNomina(row: any, rowIndex: any) {
    let data = {
      rfc: this.clienteseleccionado,
      id: row.id
    }

    const Alrt = Swal.mixin({//alerta de confiracion
      showConfirmButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    })

    Alrt.fire({
      icon: 'warning',
      title: '¿Deseas eliminar esta Nomina?'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.post(this.storage.getapi() + "nom/eliminarNom", data).subscribe(data => {


          this.nominas.splice(rowIndex, 1);
          this.nominas = [...this.nominas];
          this.startToast('success', 'Se ha eliminado la Nomina');
        });
      }
      if (result.isDismissed) {

      }
    });
  }

  EditarTrabajador(row: any, rowIndex: any) {


    this.idTrabajador = row.id;
    this.clickBotonEditar = true;
    this.edicionOn = true;
    this.nuevoTrabajadorOn = true;
    this.nuevoTrabajadorBoolean = false;
    this.guardarTrabajadorOn = true;


    this.nombre = this.empleados[rowIndex]['nombre']
    this.fechaingreso = this.empleados[rowIndex]['iniciolaboral']
    this.estado = this.empleados[rowIndex]['activo']
    this.curp = this.empleados[rowIndex]['curp']
    this.rfcTrabajador = this.empleados[rowIndex]['rfc']
    this.departamento = this.empleados[rowIndex]['departamento']
    this.entidadfederativa = this.empleados[rowIndex]['entidad']
    this.formadepago = this.empleados[rowIndex]['formadepago']
    this.idTrabajador = this.empleados[rowIndex]['id']
    this.numEmpleado = this.empleados[rowIndex]['numempleado']
    this.numSeguridadSocial = this.empleados[rowIndex]['numeross']
    this.pais = this.empleados[rowIndex]['pais']
    this.periodicidadPago = this.empleados[rowIndex]['periodicidad']
    this.puesto = this.empleados[rowIndex]['puesto']
    this.regimen = this.empleados[rowIndex]['regimen']
    this.sindicalizado = this.empleados[rowIndex]['sindicalizado']
    this.tipoContrato = this.empleados[rowIndex]['tipodecontrato']
    this.tipoJornada = this.empleados[rowIndex]['tipodejornada']
    this.tipoNomina = this.empleados[rowIndex]['tipodenomina']
    this.claseriesgo = this.empleados[rowIndex]['claseriesgo']



    if (this.empleados[row.id].estado === 1) {
      this.empleados[row.id].estado = "Activo"
    }


  }

  CancelarP() {
    this.editarOn = true;
    this.guardarEditarOn = false;
  }

  EditarP() {
    this.guardarEditarOn = true;
    this.editarOn = false;


  }

  GuardarP() {
    this.editarOn = true;
    this.guardarEditarOn = false;


    if (this.idPatron === undefined) {
      let data = {
        rfc: this.rfc,
        registropatronal: this.registropatronal,
        entidad: this.entidadfederativaPatron,
        contra: this.contrasena,
        comentario: this.descripcion
      }

      this.http.post(this.storage.getapi() + "nom/agregarPat", data).subscribe(data => {
        this.startToast('success', 'Se ha guardado el Patron');
      });
    } else {
      let data = {
        rfc: this.rfc,
        registropatronal: this.registropatronal,
        entidad: this.entidadfederativaPatron,
        contra: this.contrasena,
        comentario: this.descripcion
      }
      this.http.post(this.storage.getapi() + "nom/editarPat/" + this.idPatron, data).subscribe(data => {
        this.startToast('success', 'Se ha editado el Patron');
      });
    }

  }
  openFileBrowserD(event: any) {


    event.preventDefault();
    let element: HTMLElement = document.querySelector("#fileUploadInputExampleD") as HTMLElement;
    element.click()
  }

  desactivarNomina(row) {
    if (row.nominaOn === false) { //SI EL CHECKED ES TRUE SALE ESTA CONFIRMACION
      const Alrt = Swal.mixin({
        showConfirmButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
      })

      Alrt.fire({
        icon: 'warning',
        title: "Advertencia, al seleccionar este check box, desactivas el servicio de nóminas para este trabajador."
      }).then((result) => {
        if (result.isConfirmed) {
          this.blockUI.start('Desactivando Nomina...');
          let data = {
            id: row.id,
            status: 2
          }
          this.http.post(this.storage.getapi() + "nom/eliminarEmp", data).subscribe(data => {
            this.startToast('success', 'Se ha desactivado el empleado');
            row.estado = "Inactivo"
            row.nominaOff = "empleadoInactivo";
            row.nominaOn = true;
          });
        }
        if (result.isDismissed) {
          row.nominaOn = false;
          row.estado = "Activo"
          this.blockUI.stop();
          return;
        }
      });
    } else { //SI EL CHECKED ES FALSE SALE ESTA CONFIRMACION
      const Alrt = Swal.mixin({
        showConfirmButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
      })
      Alrt.fire({
        icon: 'warning',
        title: "Advertencia, al seleccionar este check box, activas el servicio de nóminas para este trabajador."
      }).then((result) => {
        if (result.isConfirmed) {
          this.blockUI.start('Desactivando Nominas...');
          row.nominaOn = false;
          row.nominaOff = "";
          row.estado = "Activo"
        }
        if (result.isDismissed) {
          row.nominaOn = true;
          row.estado = "Inactivo"
          this.blockUI.stop();
          return;
        }
      });
    }
  }

  DesactivarEmpleado(row: any, rowIndex: any) {
    this.rowIndexx = rowIndex;
    let data = {
      id: row.id,
      status: 0
    }
    
    const Alrt = Swal.mixin({//alerta de confiracion
      showConfirmButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    })

    Alrt.fire({
      icon: 'warning',
      title: '¿Deseas eliminar este empleado?'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.post(this.storage.getapi() + "nom/eliminarEmp", data).subscribe(data => {
          this.startToast('success', 'Se ha eliminado el empleado correctamente.');
          this.empleados.splice(this.rowIndexx, 1);
          this.empleados = [...this.empleados];
          this.rowIndexx = '';
        });
      }
      if (result.isDismissed) {

      }
    });



  }
  nuevoTrabajador() {
    this.nuevoTrabajadorOn = true;
    this.nuevoTrabajadorBoolean = false;
    this.guardarTrabajadorOn = true;
    this.pais = "México";
  }

  cuadroAlerta() {
    this.cuadroAlertaB = true;
    setTimeout(() => { this.cuadroAlertaB = false }, 5000)
  }
  openLgModal(content, row) {
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      this.nombre = ""
      this.numEmpleado = "";
      this.fechaingreso = "";
      this.rfcTrabajador = "";
      this.curp = "";
      this.numSeguridadSocial = "";
      this.departamento = "";

      this.pais = "";
      this.estadoTrabajador = "";

    }).catch((res) => { });



    //"Sin Informacion" si no tiene texto en la variable;


    if (row.rfc === null || row.rfc === 'null' || row.rfc === "" || row.rfc === undefined) {
      row.rfc = "Sin Informacion";
    }
    if (row.puesto === null || row.puesto === 'null' || row.puesto === "" || row.puesto === undefined) {
      row.puesto = "Sin Informacion";
    }
    if (row.curp === null || row.curp === 'null' || row.curp === "" || row.curp === undefined) {
      row.curp = "Sin Informacion";
    }
    if (row.nombre === null || row.nombre === 'null' || row.nombre === "" || row.nombre === undefined) {
      row.nombre = "Sin Informacion";
    }
    if (row.numSeguridadSocial === null || row.numSeguridadSocial === 'null' || row.numSeguridadSocial === "" || row.numSeguridadSocial === undefined) {
      row.numSeguridadSocial = "Sin Informacion";
    }
    if (row.pais === null || row.pais === 'null' || row.pais === "" || row.pais === undefined) {
      row.pais = "Sin Informacion";
    }
    if (row.departamento === null || row.departamento === 'null' || row.departamento === "" || row.departamento === undefined) {
      row.departamento = "Sin Informacion";
    }

    this.nombreModal = row.nombre
    this.numEmpleadoModal = row.numempleado;
    this.fechaIngresoModal = row.iniciolaboral;
    this.rfcModal = row.rfc;
    this.curpModal = row.curp;
    this.nssModal = row.numeross;
    this.departamentoModal = row.departamento;
    this.puestoModal = row.puesto;
    this.paisModal = row.pais;
    this.estadoTrabajador = row.estado;

    for (let x = 0; x < this.entidadItems.length; x++) {
      if (this.entidadItems[x].id === row.entidad) {
        this.entidadModal = this.entidadItems[x].name;
      }
    }

    if (row.entidad === null || row.entidad === 'null' || row.entidad === "" || row.entidad === undefined) {
      this.entidadModal = "Sin Informacion";

    }

    for (let x = 0; x < this.claseriesgoItems.length; x++) {
      if (this.claseriesgoItems[x].id === row.claseriesgo) {

        this.claseriesgo = this.claseriesgoItems[x].name;
      }
    }

    if (row.claseriesgo === null || row.claseriesgo === 'null' || row.claseriesgo === "" || row.claseriesgo === undefined) {
      this.claseriesgo = "Sin Informacion";

    }

    for (let x = 0; x < this.regimenItems.length; x++) {
      if (this.regimenItems[x].id === row.regimen) {

        this.regimen = this.regimenItems[x].name;
      }
    }
    if (row.regimen === null || row.regimen === 'null' || row.regimen === "" || row.regimen === undefined) {
      this.regimen = "Sin Informacion";

    }

    for (let x = 0; x < this.tipoContratoItems.length; x++) {
      if (this.tipoContratoItems[x].id === row.tipodecontrato) {

        this.tipoContrato = this.tipoContratoItems[x].name;
      }
    }

    if (row.tipodecontrato === null || row.tipodecontrato === 'null' || row.tipodecontrato === "" || row.tipodecontrato === undefined) {
      this.tipoContrato = "Sin Informacion";

    }

    for (let x = 0; x < this.sindicalizadoItems.length; x++) {
      if (this.sindicalizadoItems[x].id === row.sindicalizado) {

        this.sindicalizado = this.sindicalizadoItems[x].name;
      }
    }

    if (row.sindicalizado === null || row.sindicalizado === 'null' || row.sindicalizado === "" || row.sindicalizado === undefined) {
      this.sindicalizado = "Sin Informacion";

    }

    for (let x = 0; x < this.tipoDeNominaItems.length; x++) {
      if (this.tipoDeNominaItems[x].id === row.tipodenomina) {

        this.tipoNomina = this.tipoDeNominaItems[x].name;
      }
    }
    if (row.tipodenomina === null || row.tipodenomina === 'null' || row.tipodenomina === "" || row.tipodenomina === undefined) {
      this.tipoNomina = "Sin Informacion";

    }

    for (let x = 0; x < this.formasDePagoItems.length; x++) {
      if (this.formasDePagoItems[x].id === row.formadepago) {

        this.formadepago = this.formasDePagoItems[x].name;
      }
    }

    if (row.formadepago === null || row.formadepago === 'null' || row.formadepago === "" || row.formadepago === undefined) {
      this.formadepago = "Sin Informacion";

    }

    for (let x = 0; x < this.tipoJornadaItems.length; x++) {
      if (this.tipoJornadaItems[x].id === row.tipodejornada) {

        this.tipoJornada = this.tipoJornadaItems[x].name;
      }
    }
    if (row.tipodejornada === null || row.tipodejornada === 'null' || row.tipodejornada === "" || row.tipodejornada === undefined) {
      this.tipoJornada = "Sin Informacion";

    }

    for (let x = 0; x < this.periodicidadPagoItems.length; x++) {
      if (this.periodicidadPagoItems[x].id === row.periodicidad) {

        this.periodicidadPago = this.periodicidadPagoItems[x].name;
      }
    }
    if (row.periodicidad === null || row.periodicidad === 'null' || row.periodicidad === "" || row.periodicidad === undefined) {
      this.periodicidadPago = "Sin Informacion";

    }
  }

}
