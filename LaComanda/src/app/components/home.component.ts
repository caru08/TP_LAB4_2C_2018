import { BaseService } from './../services/baseService.service';
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
import { configs } from '../globalConfigs';
import { Tools } from './common/tools';

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
    private paramsService: ParamsService,
    private baseService: BaseService) {
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
  }

  buttonMenuClick(){
    this.router.navigate(['./']);
  }

  logoutClick() {
    this.messageHandler.openConfirmDialog("¿Está seguro que desea salir?").subscribe(result => {
      if(this.paramsService.accept){
        this.authenticationService.logOut();
        this.router.navigate(['./']);
      }
    });
  }


  cargarDatos(){
    let codigo = Tools.generateRandomString();
    //mozo dos /mesa 4 /bartender dos y uno
   /* let pedido = {
      "cliente": "clienteuno@email.com",
      "codigo": "OlmEG",
      "estado": "cerrado",
      "fecha": "3/2/2019 13:00",
      "fechaEntrega": "3/2/2019 13:09",
      "foto": "",
      "key": "",
      "mesa": "hZC8L",
      "mozo": "JD3IRZMxAUU5D95ZJpkRF5gZWQu1",
      "productos": [{
        "empleado": "lElsl4ao88Y4I2N3CZcZPt57jlx2",
        "estado": "listo",
        "key": "0",
        "nombre": "Cerveza  Artesanal Stout",
        "precio": 80,
        "tiempoElaboracion": 1,
        "tiempoEmpleado": 1,
        "tipo": "cerveza"
      }, {
        "empleado": "lElsl4ao88Y4I2N3CZcZPt57jlx2",
        "estado": "listo",
        "key": "1",
        "nombre": "Cerveza Artesanal Honney",
        "precio": 80,
        "tiempoElaboracion": 1,
        "tiempoEmpleado": 1,
        "tipo": "cerveza"
      }, {
        "empleado": "gASPZgU3azaLYuRrrAcF6a8Wd412",
        "estado": "listo",
        "key": "2",
        "nombre": "Cerveza Artesanal Ipa",
        "precio": 80,
        "tiempoElaboracion": 1,
        "tiempoEmpleado": 5,
        "tipo": "cerveza"
      }, {
        "empleado": "lElsl4ao88Y4I2N3CZcZPt57jlx2",
        "estado": "listo",
        "key": "3",
        "nombre": "Cerveza Artesanal Ipa",
        "precio": 80,
        "tiempoElaboracion": 1,
        "tiempoEmpleado": 1,
        "tipo": "cerveza"
      }, {
        "empleado": "gASPZgU3azaLYuRrrAcF6a8Wd412",
        "estado": "listo",
        "key": "4",
        "nombre": "Cerveza Artesanal Ipa",
        "precio": 80,
        "tiempoElaboracion": 1,
        "tiempoEmpleado": 1,
        "tipo": "cerveza"
      }, {
        "empleado": "gASPZgU3azaLYuRrrAcF6a8Wd412",
        "estado": "listo",
        "key": "5",
        "nombre": "Cerveza Artesanal Ipa",
        "precio": 80,
        "tiempoElaboracion": 1,
        "tiempoEmpleado": 1,
        "tipo": "cerveza"
      }]
    }*/
    let pedido = {
      "cliente": "clientedos@email.com",
      "codigo": "NU26e",
      "estado": "cerrado",
      "fecha": "10/2/2019 15:50",
      "fechaEntrega": "10/2/2019 16:55",
      "foto": "",
      "key": "-LZpRL1pzCwVQnpxkVOw",
      "mesa": "ep5je",
      "mozo": "JD3IRZMxAUU5D95ZJpkRF5gZWQu1",
      "productos": [{
        "empleado": "4xUWOOZ6AjZRrKoI7hZasZXGWij2",
        "estado": "listo",
        "key": "0",
        "nombre": "Imperial Rubia",
        "precio": 90,
        "tiempoElaboracion": 1,
        "tiempoEmpleado": 1,
        "tipo": "cerveza"
      }, {
        "empleado": "4xUWOOZ6AjZRrKoI7hZasZXGWij2",
        "estado": "listo",
        "key": "2",
        "nombre": "Heineken",
        "precio": 90,
        "tiempoElaboracion": 1,
        "tiempoEmpleado": 1,
        "tipo": "cerveza"
      }, {
        "empleado": "u8QnMD6wRfWixNnf8eayOmhpdhu1",
        "estado": "listo",
        "key": "4",
        "nombre": "Pollo grille con Fritas",
        "precio": 200,
        "tiempoElaboracion": 10,
        "tiempoEmpleado": 10,
        "tipo": "comida"
      }, {
        "empleado": "u8QnMD6wRfWixNnf8eayOmhpdhu1",
        "estado": "listo",
        "key": "5",
        "nombre": "Fideos con Tuco",
        "precio": 150,
        "tiempoElaboracion": 15,
        "tiempoEmpleado": 10,
        "tipo": "comida"
      }, {
        "empleado": "u8QnMD6wRfWixNnf8eayOmhpdhu1",
        "estado": "listo",
        "key": "6",
        "nombre": "Volcán de Chocolate ",
        "precio": 150,
        "tiempoElaboracion": 10,
        "tiempoEmpleado": 15,
        "tipo": "postre"
      }, {
        "empleado": "u8QnMD6wRfWixNnf8eayOmhpdhu1",
        "estado": "listo",
        "key": "7",
        "nombre": "Volcán de Chocolate ",
        "precio": 150,
        "tiempoElaboracion": 10,
        "tiempoEmpleado": 10,
        "tipo": "postre"
      }]
    }

    pedido.codigo = codigo;
  /*  this.baseService.getListByProperty(configs.apis.pedidos, 'key', '-LZpRL1pzCwVQnpxkVOw')
    .subscribe(res =>{
      debugger
      let datos = res[0].payload.val();
      let json = JSON.stringify(datos);
    })
    */
   
    this.baseService.addEntity(configs.apis.pedidos, pedido)
    .then(res => {

     })
     

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

