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


@Component({
  selector: 'bebidas',
  templateUrl: './bebidas.component.html',
  styleUrls: ['bebidas.component.scss'],
})

export class BebibasComponent implements OnInit {

  public formValidator: FormGroup;
  public loading: boolean;
  public listaItems: any;
  public showForm: boolean;
  public model: Producto;


  constructor(private baseService: BaseService,
    private messageHandler: MessageHandler) {

  }

  ngOnInit() {
    this.getBebidas();
    this.setFormValidator();
  }

  addBebida() {
    this.model = new Producto();
    this.model.tipo = Diccionario.tipoProductos.bebida;
    this.showForm = true;
  }

  onFileChanged(event) {
    console.log("change", event);
    var file: File = event.target.files[0];
    var myReader: FileReader = new FileReader();
    var resize = false;

    myReader.onloadend = (e: any) => {
      var tempImg = new Image();
      tempImg.src =  e.target.result;// myReader.result;
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
    this.baseService.addEntity(configs.apis.productos, this.model).then(response => {
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
    this.baseService.getListByProperty(configs.apis.productos, 'tipo', Diccionario.tipoProductos.bebida).subscribe(response => {
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
      'descripcion': CustomValidators.getSmallStringValidator(),
      'precio': CustomValidators.getPositiveIntegerNumber(),
      'tiempoElaboracion': CustomValidators.getPositiveIntegerNumber()
    });
  }

}