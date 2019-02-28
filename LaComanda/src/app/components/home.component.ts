import { ParamsService } from 'src/app/services';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { RoutesHandler, MessageHandler } from "../services";
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';
import { Diccionario } from './common/diccionario';
import { Usuario } from './../models/usuario';
import { AuthenticationService } from './../services/authentication.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['home.component.scss'],
})

export class HomeComponent implements OnInit {

  public loading: boolean;
  public isLogged: boolean;
  public userName: string;
  public modules: Array<any>;

  constructor(private authenticationService: AuthenticationService,
    public dialog: MatDialog,
    private messageHandler: MessageHandler,
    private router: Router,
    private paramsService: ParamsService) {
    this.authenticationService.sessionChange.subscribe((user: Usuario) => this.initPage());
  }

  ngOnInit() {
    this.isLogged = false;
    this.loading = true;
    this.initPage();
  }

  loginClick() {
    let dialogRef = this.dialog.open(LoginComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'register') {
        this.openRegisterForm();
      }
    });
  }

  moduleClick(moduleItem) {
    this.router.navigate([moduleItem.path]);
    //this.router.navigate([moduleItem.path]);
  }

  logoutClick() {
    this.messageHandler.openConfirmDialog("¿Está seguro que desea salir?").subscribe(result => {
      if(this.paramsService.accept){
        this.authenticationService.logOut();
        this.router.navigate(['./']);
      }
    });

  }

  private openRegisterForm() {
    let dialogRef = this.dialog.open(RegisterComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      this.initPage();
    });

  }

  private initPage() {
    if (this.authenticationService.sessionCheck) this.loading = false;
    if (this.authenticationService.isLogged()) {
      this.isLogged = true;
      this.userName = this.authenticationService.getEmail();
      this.displayModules();
    } else {
      this.isLogged = false;
      this.modules = [];
    }
  }

  private displayModules() {
    switch (this.authenticationService.getUser().rol) {
      case Diccionario.roles.cliente:
        this.modules = Diccionario.clienteModules;
        break;
      case Diccionario.roles.mozo:
        this.modules = Diccionario.mozoModules;
        break;
      case Diccionario.roles.bartener:
        this.modules = Diccionario.bartenderModules;
        break;
      case Diccionario.roles.cocinero:
        this.modules = Diccionario.cocineroModules;
        break;
      case Diccionario.roles.administrador:
        this.modules = Diccionario.administradorModules;
        break;
      case Diccionario.roles.socio:
        this.modules = Diccionario.socioModules;
        break;
        case Diccionario.roles.cervezero:
        this.modules = Diccionario.cerveceroModules;
        break;
      default:
        this.modules = [];
        break;

    }

  }

}

