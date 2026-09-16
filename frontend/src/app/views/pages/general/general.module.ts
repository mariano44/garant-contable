import { NgModule } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { FeahterIconModule } from '../../../core/feather-icon/feather-icon.module';
import { NgbAccordionModule, NgbDropdownModule, NgbNavModule, NgbTooltipModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { GeneralComponent } from './general.component';
import { BlankComponent } from './blank/blank.component';
import { FaqComponent } from './faq/faq.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { ProfileComponent } from './profile/profile.component';
import { PricingComponent } from './pricing/pricing.component';
import { TimelineComponent } from './timeline/timeline.component';
import { Routes, RouterModule } from '@angular/router';
import { PerfilComponent } from './perfil/perfil.component';
import { SellosComponent } from './sellos/sellos.component';
import { PlanesComponent } from './planes/planes.component';
import { BlockUI, BlockUIModule } from 'ng-block-ui';

import { ReportesComponent } from './reportes/reportes.component';
import { ChartsModule } from 'ng2-charts';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NewRolComponent } from './roles/newrol/newrol.component';
import { RoleditComponent } from './roles/roledit/roledit.component';
import { NewplanComponent } from './planes/newplan/newplan.component';
import { EditplanComponent } from './planes/editplan/editplan.component';
import { NewuserComponent } from './users/newuser/newuser.component';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: 'https://httpbin.org/post',
  maxFilesize: 150,
  acceptedFiles: 'text/xml',
  addRemoveLinks: true,
  dictDefaultMessage: 'Da click o arrastra tus archivos XML aquí.',
  dictRemoveFile: 'Quitar XML'
};
import { UpcfdisComponent } from './upcfdis/upcfdis.component';
import { ClasificarComponent } from './clasificar/clasificar.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { AsignadosComponent } from './asignados/asignados.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { FacturacionComponent } from './facturacion/facturacion.component';
import { NuevafacturaComponent } from './nuevafactura/nuevafactura.component';
import { NominaComponent } from './nomina/nomina.component';
import { RepComponent } from './rep/rep.component';
import { NewclienteComponent } from './newcliente/newcliente.component';


const routes: Routes = [
  {
    path: '',
    component: GeneralComponent,
    children: [
      {
        path: 'perfil/:id',
        component: PerfilComponent
      },
      {
        path: 'sellos/:id',
        component: SellosComponent
      },
      {
        path: 'reportes',
        component: ReportesComponent
      },
      {
        path: 'facturacion',
        component: FacturacionComponent
      },

      {
        path: 'nuevafactura',
        component: NuevafacturaComponent
      },
      {
      path: 'rep',
        component: RepComponent
      },
      {
        path: 'nomina',
        component: NominaComponent
      },
      
      {
        path: 'users',
        component: UsersComponent
      },
      {
        path: 'roles',
        component: RolesComponent
      },
      {
        path: 'planes',
        component: PlanesComponent
      },
      {
        path: 'roles/newrol',
        component: NewRolComponent
      },
      {
        path: 'roles/roledit/:id',
        component: RoleditComponent
      },
      {
        path: 'planes/newplan',
        component: NewplanComponent
      },
      {
        path: 'planes/editplan/:id',
        component: EditplanComponent
      },
      {
        path: 'newcliente',
        component: NewclienteComponent
      },
      {
        path: 'users/newuser',
        component: NewuserComponent
      },
      {
        path: 'upcfdis',
        component: UpcfdisComponent
      },
      {
        path: 'clasificar',
        component: ClasificarComponent
      },
      {
        path: 'asignados',
        component: AsignadosComponent
      },
      {
        path: 'documentos',
        component: DocumentosComponent
      }
    ]
  }
]

@NgModule({
  declarations: [GeneralComponent,
                 BlankComponent,
                 FacturacionComponent,
                 FaqComponent,
                 InvoiceComponent,
                 ProfileComponent,
                 PricingComponent,
                 TimelineComponent,
                 PerfilComponent,
                 SellosComponent,
                 PlanesComponent,
                 ReportesComponent,
                 UsersComponent,
                 RolesComponent,
                 NewRolComponent,
                 RoleditComponent,
                 NewplanComponent,
                 EditplanComponent,
                 NewuserComponent,
                 UpcfdisComponent,
                 ClasificarComponent,
                 AsignadosComponent,
                 DocumentosComponent, FacturacionComponent, NuevafacturaComponent, NominaComponent, RepComponent, NewclienteComponent, ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FeahterIconModule,
    NgbAccordionModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgbTooltipModule,
    FormsModule,
    BlockUIModule.forRoot(),
    NgxMaskModule.forRoot({ validation: true}),
    NgbNavModule,
    ChartsModule, // Ng2-charts,
    NgxDatatableModule.forRoot({
      messages: {
        emptyMessage: 'No hay registros que mostrar', // Message to show when array is presented, but contains no values
        totalMessage: 'Total', // Footer total message
        selectedMessage: 'Seleccionado' // Footer selected message
      }
    }),
    NgbModule,
    NgSelectModule,
    NgApexchartsModule, // Ng-ApexCharts
    DropzoneModule // Ngx-dropzone-wrapper
  ],
  providers: [DatePipe,{
    provide: DROPZONE_CONFIG,
    useValue: DEFAULT_DROPZONE_CONFIG
  }, // Ngx-dropzone-wrapper
]
})
export class GeneralModule { }
