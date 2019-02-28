import { Observable, Subscriber } from 'rxjs';
import { Mesa } from './../../models/mesa';
import { Pedido } from './../../models/pedido';
import { Producto } from './../../models/productos';
import { BaseService } from './../../services/baseService.service';
import { Diccionario } from '../common/diccionario';
import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { MessageHandler } from "../../services";
import { configs } from 'src/app/globalConfigs';
import { FormGroup } from '@angular/forms';
import * as _ from "lodash";
import { Tools } from '../common/tools';


@Component({
    selector: 'menu',
    templateUrl: './menu.component.html',
    styleUrls: ['menu.component.scss'],
})

export class MenuComponent implements OnInit {

    public formValidator: FormGroup;
    public loading: boolean;
    public listaItems: Array<any>;
    public showForm: boolean;
    public bebidasList = new Array();
    public comidasList = new Array();
    public postresList = new Array();
    public cervezasList = new Array();
    public pedido = new Pedido();
    public productos = new Array<Producto>();
    public mesas = new Array<Mesa>();
    public codigoProducto: string = "";

    constructor(private baseService: BaseService,
        private messageHandler: MessageHandler,
        private autenticationService: AuthenticationService) {
    }

    ngOnInit() {
        this.pedido = new Pedido();
        this.getProductos();
    }    

    private getProductos() {
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
            this.cervezasList = _.filter(todosLosProductos, producto => {
                return producto.tipo == Diccionario.tipoProductos.cerveza
            });

            this.loading = false;
        })
    }

 

  



}