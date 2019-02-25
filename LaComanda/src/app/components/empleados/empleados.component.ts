import { Producto } from './../../models/productos';
import { BaseService } from './../../services/baseService.service';
import { Diccionario } from '../common/diccionario';
import { Usuario } from './../../models/usuario';
import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { RoutesHandler, MessageHandler } from "../../services";
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
    private autenticationService: AuthenticationService) {

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
   
      this.altaEmpleado();
    
  }

  altaEmpleado() {
    this.autenticationService.createUser(this.model.email, this.model.pass)
      .subscribe(response => {
        var lala = this.autenticationService.getEmail();
        let cliente = new Usuario(this.model.nombre, this.model.apellido, this.model.dni, false, this.model.email, this.model.rol);
        cliente.uid = response.user.uid;
        this.baseService.addEntity(configs.apis.usuarios, cliente)
          .then(response => {
            this.loading = false;
            this.messageHandler.showSucessMessage("Se agregó el empleado correctamente");
            this.cancelClick();
          }, error => {
            this.autenticationService.singIn(this.autenticationService.getLoggedEmail(), this.autenticationService.getPass());
            this.autenticationService.deleteUserLogged()
              .then(response => {
                this.loading = false;
                this.messageHandler.showErrorMessage("Ocurrió un error al agregar el empleado");
              });
          })
      }, error => {
        this.loading = false;
        this.messageHandler.showErrorMessage("Ocurrió un error al agregar el empleado. ", error);
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