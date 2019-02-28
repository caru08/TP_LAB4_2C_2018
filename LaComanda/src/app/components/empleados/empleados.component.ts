import { ParamsService } from './../../services/params.service';
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
import { Tools } from '../common/tools';


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
  public model = { nombre: '', apellido: '', email: '', pass: '', secondpass: '', dni: '', key: '', rol: '', uid: '', estado: '' };
  public isEdit: boolean;
  public errormessage = "";
  public roles = new Array();
  public labeldEstadosUsuarios: any;

  constructor(private baseService: BaseService,
    private messageHandler: MessageHandler,
    private autenticationService: AuthenticationService,
    private paramsService: ParamsService) {
    this.labeldEstadosUsuarios = Diccionario.labeldEstadosUsuarios;

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
    this.formValidator.controls['pass'].enable();
    this.formValidator.controls['secondpass'].enable();
    this.formValidator.controls['email'].enable();
    this.model = { nombre: '', apellido: '', email: '', pass: '', secondpass: '', dni: '', key: '', rol: '', uid: '', estado: Diccionario.estadosUsuarios.activo };
    this.showForm = true;
  }

  editClick(item) {
    if (item.email == this.autenticationService.getEmail()) {
      this.messageHandler.showErrorMessage("No se puede editar el usuario de la actual sesión");
      return;
    }
    this.isEdit = true;
    this.showForm = true;
    this.formValidator.reset();
    this.formValidator.controls['pass'].disable();
    this.formValidator.controls['secondpass'].disable();
    this.formValidator.controls['email'].disable();
    this.model.nombre = item.nombre;
    this.model.apellido = item.apellido;
    this.model.email = item.email;
    this.model.dni = item.dni;
    this.model.rol = item.rol;
    this.model.key = item.key;
    this.model.uid = item.uid;
    this.model.pass = item.pass;
    this.model.estado = item.estado;
  }


  onfocusoutSecondPass(event) {
    if (this.model.pass !== this.model.secondpass) {
      this.errormessage = "Las contraseñas no coinciden"
    } else {
      this.errormessage = "";
    }
  }

  cancelClick() {
    this.showForm = false;
  }

  deleteClick(item) {
    if (item.email == this.autenticationService.getEmail()) {
      this.messageHandler.showErrorMessage("No se puede eliminar el usuario de la actual sesión");
      return;
    }
   
    this.messageHandler.openConfirmDialog("¿Está seguro que desea eliminar el empleado?").subscribe(result => {
      if(this.paramsService.accept){
        this.loading = true;
        this.autenticationService.deleteUser(item.email, item.pass)
          .subscribe(response => {
            this.baseService.deleteEntity(configs.apis.usuarios, item.key)
              .then(response => {
                this.loading = false;
                this.messageHandler.showSucessMessage("El empleado fue eliminado");
              }, error => {
                this.loading = false;
                this.messageHandler.showErrorMessage("Ocurrio un error al eliminar el empleado");
              })
          });
      } else {
        this.loading = false;
      }
    });
  }

  deshabilitarEmpleado() {
    this.messageHandler.openConfirmDialog("¿Está seguro que desea deshabilitar el empleado?").subscribe(result => {
      if(this.paramsService.accept){
        this.model.estado = Diccionario.estadosUsuarios.suspendido;
        this.edicionEmpleado("El empleado fue deshabilitado", "Ocurrió un error al deshabilitad el empleado");
      }      
    });
  }

  habilitarCuenta() {
    this.messageHandler.openConfirmDialog("¿Está seguro que desea habilitar el empleado?")
    .subscribe(result => {
      if(this.paramsService.accept){
        this.model.estado = Diccionario.estadosUsuarios.activo;
        this.edicionEmpleado("El empleado fue habilitado", "Ocurrió un error al habilitar el empleado");
      }
    });
  }

  saveClick() {
    if (this.isEdit) {
      this.edicionEmpleado("El empleado se editó correctamente", "Ocurrió un error al editar el empleado");
    } else {
      this.altaEmpleado();
    }
  }

  altaEmpleado() {
    try {
      this.loading = true;
      this.autenticationService.createUser(this.model.email, this.model.pass)
        .subscribe(response => {
          if (response.code) {
            this.loading = false;
            this.messageHandler.showErrorMessage("Ocurrió un error al agregar el empleado. ", response);
            return
          }
          let cliente = new Usuario(this.model.nombre, this.model.apellido, this.model.dni, false, this.model.email,
            this.model.rol, response.user.uid, Diccionario.estadosUsuarios.activo, this.model.pass);
          this.baseService.addEntity(configs.apis.usuarios, cliente)
            .then(response => {
              this.loading = false;
              this.messageHandler.showSucessMessage("Se agregó el empleado correctamente");
              this.cancelClick();
            }, error => {
              this.loading = false;
              this.messageHandler.showSucessMessage("Ocurrió un error al agregar el empleado");
            })
        }, error => {
          this.loading = false;
          this.messageHandler.showErrorMessage("Ocurrió un error al agregar el empleado. ", error);
        })
    } catch (error) {
      this.loading = false;
      this.messageHandler.showErrorMessage("Ocurrio un error al agregar el empleado", error);
    }
  }

  edicionEmpleado(msjSuccess, msjError) {
    let model = Tools.deepCopy(this.model);
    delete model['secondpass'];
    this.loading = true;
    this.baseService.updateEntity(configs.apis.usuarios, this.model.key, model)
      .then(response => {
        this.loading = false;
        this.messageHandler.showSucessMessage(msjSuccess);
        this.cancelClick();
      }, error => {

        this.loading = false;
        this.messageHandler.showErrorMessage(msjError);

      })
  }

  private getLista() {
    this.loading = true;
    this.baseService.getList(configs.apis.usuarios).subscribe(response => {
      let lista = _.filter(response, item => {
        return item.payload.val().rol != Diccionario.roles.cliente && item.payload.val().rol != Diccionario.roles.administrador
      }).map(item => {
        let datos = item.payload.val();
        datos['key'] = item.key;
        return datos;
      });
      this.listaItems = lista;
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