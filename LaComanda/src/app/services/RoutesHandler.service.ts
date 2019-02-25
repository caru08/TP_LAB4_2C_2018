import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';

@Injectable()
export class RoutesHandler {

  constructor(private router: Router,
              private route: ActivatedRoute,
            
  ) {
  }

  public getRouter() {
    return this.router;
  }

  public getRoute(){
    return this.route;
  }

  public getUrl(){
    return this.router.url;
  }

}

@Injectable()
export class MainGuard implements CanActivate, CanActivateChild {

  constructor(private authenticationService: AuthenticationService
  ) {}

  canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):any{
    if(this.authenticationService.sessionCheck){
      return this.authenticationService.isLogged();
    } else {
      return new Observable<boolean>((subscriber:Subscriber<any>)=>{
        this.authenticationService.sessionChange.subscribe((session:any)=>{
          subscriber.next(this.authenticationService.isLogged());
        })
      })
    }
  
  }

  canActivateChild(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):boolean {
  /*  var hasPermission = this.rolesService.hasPermisionsToModule(route.url[0].path, route.url[1] ? route.url[1].path : '');
    if(!hasPermission){
      this.snackBar.open(this.translateService.translate('ERROR.INSUFFICIENT_PERMISSIONS'), '', {duration: 4000});
    }
    return hasPermission;
    */
   debugger;
   return true;
  }

}
