import { Producto } from './../../models/productos';
import { BaseService } from './../../services/baseService.service';
import { Diccionario } from '../common/diccionario';
import { Usuario } from './../../models/usuario';
import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { RoutesHandler, MessageHandler, ParamsService } from "../../services";
import { configs } from 'src/app/globalConfigs';
import { FormGroup } from '@angular/forms';
import { CustomValidators } from "../common/validators";
import * as _ from "lodash";


@Component({
  selector: 'empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['empleados.component.scss'],
})

export class EmpleadosComponent implements OnInit {

  public formValidator: FormGroup;
  public loading: boolean;
  public listaItems: Array<any>;
  public showForm: boolean;
  public model = { nombre: '', apellido: '', email: '', pass: '', secondpass: '', dni: '', key: '', rol: '', uid: '' };
  public isEdit: boolean;
  public errormessage = "";
  public roles = new Array();

  constructor(private baseService: BaseService,
    private messageHandler: MessageHandler,
    private autenticationService: AuthenticationService,
    private paramsService: ParamsService) {

  }

  ngOnInit() {
    for (let key in Diccionario.roles) {
      if (key != Diccionario.roles.cliente && key != Diccionario.roles.administrador) {
        this.roles.push({ label: key, value: Diccionario.roles[key] });
      }
    }
    this.listaItems = new Array<any>();
    this.getLista();
    this.setFormValidator();
  }

  addItem() {
    this.isEdit = false;
    this.formValidator.reset();
    this.model = { nombre: '', apellido: '', email: '', pass: '', secondpass: '', dni: '', key: '', rol: '', uid: '' };
    this.showForm = true;
  }

  editClick(item) {
    this.isEdit = true;
    this.showForm = true;
    this.formValidator.reset();
    this.model.nombre = item.nombre;
    this.model.apellido = item.apellido;
    this.model.dni = item.dni;
    this.model.rol = item.rol;
    this.model.key = item.key;
    this.model.uid = item.uid;
  }


  onfocusoutSecondPass(event) {
    if (this.model.pass !== this.model.secondpass) {
      this.errormessage = "Las contraseñas no coinciden"
    } else {
      this.errormessage = "";
    }
  }

  imageLoad(event) {
    console.log("load", event);
  }

  cancelClick() {
    this.showForm = false;
  }

  saveClick() {
    this.loading = true;
    let pedido: any;
    if (this.model.key) {
      //this.editarEmpleado();
    } else {
      this.altaEmpleado();
    }
  }

  /*editarEmpleado(){
    let model = new Usuario(this.model.nombre, this.model.apellido, this.model.dni, false, this.model.rol, this.model.uid);
    this.baseService.updateEntity(configs.apis.usuarios, this.model.key, model)
    .then(response => {
      this.cancelClick();
      this.loading = false;
      this.messageHandler.showSucessMessage("El empleado se edito con exito");
    }, error => {
      console.log(error);
      this.loading = false;
      this.messageHandler.showErrorMessage("Ocurrio un error esitar el empleado");
    })
  }*/

  altaEmpleado() {
    this.autenticationService.addingUser = true;
    this.autenticationService.registerUserAndLogin(this.model.email, this.model.pass)
      .then(response => {
        let cliente = new Usuario(this.model.nombre, this.model.apellido, this.model.dni, false, this.model.rol);
        cliente.uid = response.user.uid;
        this.baseService.addEntity(configs.apis.usuarios, cliente)
          .then(response => {
            this.autenticationService.addingUser = false;
            this.autenticationService.singIn(this.paramsService.email, this.paramsService.pass);
            this.loading = false;
            this.messageHandler.showSucessMessage("Se agregó el empleado correctamente");
            this.cancelClick();
          }, error => {
            this.autenticationService.addingUser = false;
            this.autenticationService.singIn(this.paramsService.email, this.paramsService.pass);
            this.autenticationService.deleteUserLogged()
              .then(response => {
                this.loading = false;
                this.messageHandler.showErrorMessage("Ocurrió un error al agregar el empleado");
                //CHEQUEAR ESTO CUANDO ES ALTA POR EMPLEADO
              });
          })
      })
  }

  private getLista() {
    this.loading = true;
    this.baseService.getList(configs.apis.usuarios).subscribe(response => {
      this.listaItems = _.filter(response, item => {
        return item.payload.val().rol != Diccionario.roles.cliente
      }).map(item => {
        let datos = item.payload.val();
        datos['key'] = item.key;
        return datos;
      });
      this.loading = false;
    })
  }

  private setFormValidator() {
    this.formValidator = new FormGroup({
      'email': CustomValidators.getRequiredEmailValidator(),
      'pass': CustomValidators.getPassStringValidator(),
      'secondpass': CustomValidators.getPassStringValidator(),
      'name': CustomValidators.getSmallStringValidator(),
      'lastname': CustomValidators.getSmallStringValidator(),
      'dni': CustomValidators.getPositiveIntegerNumber(),
      'rol': CustomValidators.getSmallStringValidator(),
    });
  }

}