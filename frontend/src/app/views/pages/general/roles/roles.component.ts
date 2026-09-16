import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../../../core/JWT/usuarios.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from 'src/app/core/JWT/token-storage.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { ColumnMode,SelectionType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  user: any;
  id: any;
  roles: any;
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  selected: any = [];
  columns: any = [{ name: 'ID' }, { name: 'Rol' }, {name:'Descripción'}, {name:'Acciones'}];
  constructor(private datepipe: DatePipe,private storage: TokenStorageService,private http: HttpClient,private UService: UsuariosService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.user = this.storage.getUser();
    this.http.get(this.storage.getapi()+'admin/roles').subscribe(data => {
      this.roles = [];
      let datos = data['result'];
      for(let x=0;x<datos.length;x++){
        this.roles.push({
          id: datos[x]['id'],
          rol: datos[x]['nombre'],
          descripcion: datos[x]['descripcion'],
          acciones: (datos[x]['no_editable'] == 0 ? true : false)
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

  AddRol(){debugger;
    this.router.navigate['/general/roles/newrol/'];
  }

  onSelect({ selected }) {
    this.roles['acciones'] = true;
  }

  delete(rolid: any){

  }

}
