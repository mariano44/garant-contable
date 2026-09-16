import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot,ActivatedRoute } from '@angular/router';
import { TokenStorageService } from '../JWT/token-storage.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class AuthGuard implements CanActivate {
  user: any;
  constructor(private http: HttpClient,private router: Router, private storage: TokenStorageService,private Actroute: ActivatedRoute) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
    if (this.storage.getToken() != '' && this.storage.getToken() != null) {
      this.user = this.storage.getUser();
      return true;
    }

    if(window.location.href.indexOf('recover') > -1){
      let splitted = window.location.href.split('/');
      let token = splitted[4];
      let email = splitted[5];
      this.router.navigate(['/auth/recover/'+token+'/'+email], { });
      return true;
    }
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;    
    
    // not logged in so redirect to login page with the return url
    
  }
}