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
import { Tools } from '../common/tools';


@Component({
  selector: 'cervezas',
  templateUrl: './cervezas.component.html',
  styleUrls: ['cervezas.component.scss'],
})

export class CervezasComponent implements OnInit {

  public formValidator: FormGroup;
  public loading: boolean;
  public listaItems: any;
  public showForm: boolean;
  public model: Producto;


  constructor(private baseService: BaseService,
    private messageHandler: MessageHandler) {

  }

  ngOnInit() {
    this.listaItems = new Array<any>();
    this.getBebidas();
    this.setFormValidator();
  }

  addBebida() {
    this.formValidator.reset();
    this.model = new Producto();
    this.model.tipo = Diccionario.tipoProductos.cerveza;
    this.showForm = true;
  }

  editClick(item) {
    this.showForm = true;
    this.formValidator.reset();
    this.model = Tools.deepCopy(item);
  }

  onFileChanged(event) {
    console.log("change", event);
    var file: File = event.target.files[0];
    var myReader: FileReader = new FileReader();
    var resize = false;

    myReader.onloadend = (e: any) => {
      var tempImg = new Image();
      tempImg.src = e.target.result;// myReader.result;
      tempImg.onload = () => {
        var MAX_WIDTH = 200;
        var MAX_HEIGHT = 150;
        var canvas = document.createElement('canvas');
        canvas.width = MAX_WIDTH;
        canvas.height = MAX_HEIGHT;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(tempImg, 0, 0, MAX_WIDTH, MAX_HEIGHT);
        var dataURL = canvas.toDataURL("image/jpeg");
        this.model.foto = dataURL;
      }
    }
    myReader.readAsDataURL(file);
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
      pedido = this.baseService.updateEntity(configs.apis.productos, this.model.key, this.model);
    } else {
      pedido = this.baseService.addEntity(configs.apis.productos, this.model);
    }
    pedido.then(response => {
      this.cancelClick();
      this.loading = false;
      this.messageHandler.showSucessMessage("La bebida se agregó correctamente");
    }, error => {
      console.log(error);
      this.loading = false;
      this.messageHandler.showErrorMessage("Ocurrio un error al guardar la bebida");
    })

  }

  private getBebidas() {
    this.loading = true;
    this.baseService.getListByProperty(configs.apis.productos, 'tipo', Diccionario.tipoProductos.cerveza).subscribe(response => {
      this.listaItems = response.map(bebida => {
        let datos: any = bebida.payload.val()
        return new Producto(bebida.key, datos.nombre, datos.descripcion, datos.precio, datos.tipo, datos.tiempoElaboracion, datos.foto);
      });
      this.loading = false;
    })
  }

  private setFormValidator() {
    this.formValidator = new FormGroup({
      'nombre': CustomValidators.getSmallStringValidator(),
      'descripcion': CustomValidators.getLongStringValidator(),
      'precio': CustomValidators.getPositiveIntegerNumber(),
      'tiempoElaboracion': CustomValidators.getPositiveIntegerNumber()
    });
  }

}