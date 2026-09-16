import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { RecoverComponent } from './recover/recover.component';
import { CambiarcontraseniaComponent } from './cambiarcontrasenia/cambiarcontrasenia.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'recover',
        component: RecoverComponent
      },
      {
        path: 'cambiarcontrasenia',
        component: CambiarcontraseniaComponent
      },
      {
        path: 'recover/:token/:email',
        component: RecoverComponent
      }
    ]
  },
]

@NgModule({
  declarations: [LoginComponent, RegisterComponent, AuthComponent, RecoverComponent,CambiarcontraseniaComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    NgxMaskModule.forRoot({ validation: true}),
    SweetAlert2Module.forRoot()    
  ]
})
export class AuthModule { }
