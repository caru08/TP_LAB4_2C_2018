import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class RoutesHandler {

  constructor(private router: Router,
              private route: ActivatedRoute
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

  constructor(
  ) {}

  canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):any{
    /*if(this.loginService.sessionCheck){
      return this.loginService.getSessionLogged();
    } else {
      return new Observable<boolean>((subscriber:Subscriber<any>)=>{
        this.loginService.sessionChange.subscribe((session:Session)=>{
          subscriber.next(session.logged);
        })
      })
    }*/
  }

  canActivateChild(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):boolean {
  /*  var hasPermission = this.rolesService.hasPermisionsToModule(route.url[0].path, route.url[1] ? route.url[1].path : '');
    if(!hasPermission){
      this.snackBar.open(this.translateService.translate('ERROR.INSUFFICIENT_PERMISSIONS'), '', {duration: 4000});
    }
    return hasPermission;
    */
   return true;
  }

}
