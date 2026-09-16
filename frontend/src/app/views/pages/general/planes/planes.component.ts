import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../../../core/JWT/usuarios.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from 'src/app/core/JWT/token-storage.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { ColumnMode,SelectionType } from '@swimlane/ngx-datatable';
import { DecimalPipe,formatNumber } from '@angular/common';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.scss']
})
export class PlanesComponent implements OnInit {

  user: any;
  id: any;
  planes: any;
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  selected: any = [];
  columns: any = [{ name: 'ID' }, { name: 'Plan' }, {name:'Tarifa'}, {name:'Acciones'}];
  constructor(private datepipe: DatePipe,private storage: TokenStorageService,private http: HttpClient,private UService: UsuariosService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.user = this.storage.getUser();
    this.http.get(this.storage.getapi()+'admin/planes').subscribe(data => {
      this.planes = [];
      let datos = data['result'];
      for(let x=0;x<datos.length;x++){
        this.planes.push({
          id: datos[x]['id'],
          plan: datos[x]['nombre'],
          costo: formatNumber(datos[x]['costo'],"en_US",'1.0'),
          acciones: false
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
  }

  delete(rolid: any){

  }

}
