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
    selector: 'hacer-pedido',
    templateUrl: './hacer-pedido.component.html',
    styleUrls: ['hacer-pedido.component.scss'],
})

export class HacerPedidoComponent implements OnInit {

    public formValidator: FormGroup;
    public loading: boolean;
    public listaItems: Array<any>;
    public showForm: boolean;
    public bebidasList = new Array();
    public comidasList = new Array();
    public postresList = new Array();
    public pedido = {clienteUid : '', clienteName: '', productos: []};

    constructor(private baseService: BaseService,
        private messageHandler: MessageHandler,
        private autenticationService: AuthenticationService,
        private paramsService: ParamsService) {
    }

    ngOnInit() {
        this.getProductos();
    }

    addItem(item){
        this.pedido.productos.push(item);
    }

    removeItem(item){
        debugger;
        var index = this.pedido.productos.indexOf(item);
        if (index > -1) {
            this.pedido.productos.splice(index, 1);
        }
    }

    private getProductos() {
        debugger;
        this.loading = true;
        this.baseService.getList(configs.apis.productos).subscribe(response => {
            let todosLosProductos = response.map(comida => {
                let datos: any = comida.payload.val()
                return new Producto(comida.key, datos.nombre, datos.descripcion, datos.precio, datos.tipo, datos.tiempoElaboracion, datos.foto);
            });
            this.bebidasList = _.filter(todosLosProductos, producto => {
                return producto.tipo == Diccionario.tipoProductos.bebida
            });
            this.comidasList = _.filter(todosLosProductos, producto => {
                return producto.tipo == Diccionario.tipoProductos.comida
            });
            this.postresList = _.filter(todosLosProductos, producto => {
                return producto.tipo == Diccionario.tipoProductos.postre
            });

            this.loading = false;
        })
    }

}