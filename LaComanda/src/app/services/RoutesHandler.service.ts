import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';
import { Diccionario } from '../components/common/diccionario';

@Injectable()
export class RoutesHandler {

  constructor(private router: Router,
    private route: ActivatedRoute,

  ) {
  }

  public getRouter() {
    return this.router;
  }

  public getRoute() {
    return this.route;
  }

  public getUrl() {
    return this.router.url;
  }

}

@Injectable()
export class MainGuard implements CanActivate, CanActivateChild {

  constructor(private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {

    var routeSanp = route;
    if (this.authenticationService.sessionCheck) {
      if(this.authenticationService.isLogged()){
        let path = routeSanp.url[0].path;
        return this.hasPermission(path, this.authenticationService.getUser().rol);
      }else{
        return false;
      }      
    } else {
      return new Observable<boolean>((subscriber: Subscriber<any>) => {
        this.authenticationService.sessionChange.subscribe((session: any) => {
          if (this.authenticationService.isLogged()) {
            let path = routeSanp.url[0].path;
            let path2 = routeSanp.url[1] ? routeSanp.url[1].path : ''
            let can = this.hasPermission(path, session.rol)
            subscriber.next(can);
          } else {
            subscriber.next(this.authenticationService.isLogged());
          }

        })
      })
    }

  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    /*  var hasPermission = this.rolesService.hasPermisionsToModule(route.url[0].path, route.url[1] ? route.url[1].path : '');
      if(!hasPermission){
        this.snackBar.open(this.translateService.translate('ERROR.INSUFFICIENT_PERMISSIONS'), '', {duration: 4000});
      }
      return hasPermission;
      */
    debugger;
    return true;
  }

  private hasPermission(path, userrol) {
    let modules = [];
    let exists = false;
    switch (userrol) {
      case Diccionario.roles.administrador:
        modules = Diccionario.administradorModules;
        break;
      case Diccionario.roles.bartener:
        modules = Diccionario.bartenderModules;
        break;
      case Diccionario.roles.cervezero:
        modules = Diccionario.cerveceroModules;
        break;
      case Diccionario.roles.cliente:
        modules = Diccionario.clienteModules;
        break;
      case Diccionario.roles.cocinero:
        modules = Diccionario.cocineroModules;
        break;
      case Diccionario.roles.mozo:
        modules = Diccionario.mozoModules;
        break;
      case Diccionario.roles.socio:
        modules = Diccionario.socioModules;
        break;
    }
    let findPath = '/'+ path;
    modules.forEach(module =>{
      if(module.path == findPath){
        exists = true;
        return;
      }
    })    
    return exists;

  }

}
