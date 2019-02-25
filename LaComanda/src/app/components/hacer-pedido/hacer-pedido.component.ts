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
        this.getMesas();
    }

    addItem(item) {
        this.productos = this.productos.concat([item]);
    }

    removeItem(item) {
        let collection = Tools.deepCopy(this.productos);
        var index = -1;
        for (var i = 0; i < this.productos.length; i++) {
            if (item.nombre == this.productos[i].nombre) {
                index = i;
                break;
            }
        }
        if (index > -1) {
            collection.splice(index, 1);
            this.productos = collection;
        }
    }

    getTotal() {
        let total = 0;
        this.productos.forEach(producto => {
            total += producto.precio;
        });
        return total;
    }

    saveClick() {
        this.loading = true;
        this.pedido.mapDataToServer(this.productos);
        this.pedido.mozo = this.autenticationService.getUID();
        this.baseService.addEntity(configs.apis.pedidos, this.pedido)
            .then(response => {
                this.loading = false;
                this.codigoProducto = this.pedido.codigo;
                this.messageHandler.showSucessMessage("El pedido se agregó con éxito");
                this.pedido = new Pedido();
                this.productos = new Array<Producto>();
            }, error => {
                this.loading = false;
                this.messageHandler.showErrorMessage("Error al agregar el pedido");
            })
    }

    cerrarCodigo() {
        this.codigoProducto = "";
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

            this.loading = false;
        })
    }

    private getMesas() {
        this.baseService.getList(configs.apis.mesas).subscribe(response => {
            this.mesas = response.map(comida => {
                let datos: any = comida.payload.val()
                return new Mesa(comida.key, datos.codigo, datos.nombre, datos.estado);
            });
        })
    }



}