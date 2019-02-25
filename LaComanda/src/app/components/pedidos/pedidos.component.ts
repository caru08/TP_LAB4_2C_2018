import { MatDialog } from '@angular/material';
import { Diccionario } from './../common/diccionario';
import { Observable, Subscriber } from 'rxjs';
import { Mesa } from './../../models/mesa';
import { Pedido } from './../../models/pedido';
import { Producto, ProductoPedido } from './../../models/productos';
import { BaseService } from './../../services/baseService.service';
import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { MessageHandler } from "../../services";
import { configs } from 'src/app/globalConfigs';
import { FormGroup } from '@angular/forms';
import * as _ from "lodash";
import { Tools } from '../common/tools';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
    selector: 'pedidos',
    templateUrl: './pedidos.component.html',
    styleUrls: ['pedidos.component.scss'],
})

export class PedidosComponent implements OnInit {

    public loading: boolean;
    public pedidos = new Array<Pedido>();
    public pedidosProductos = new Array<ProductoPedido>();
    public staticEstadoPedidos:any;
    public staticEstadoProductos:any;
    public estadosPedidos = {
        cuentaSolicitada: 'Cuenta Solicitada',
        enPreparacion: 'En Preparación',
        listo: 'Listo'
    }
    public estadoProductos = {
        pedido: 'Pedido',
        enPreparacion: 'En Preparación',
        listo: 'Listo'
    };
    public showSetTime:boolean;
    public tiempoEmpleado:number;

    constructor(private baseService: BaseService,
        private messageHandler: MessageHandler,
        private autenticationService: AuthenticationService,
        private dialog: MatDialog) {
            this.staticEstadoPedidos = Diccionario.estadoPedidos;
            this.staticEstadoProductos = Diccionario.estadoProductos;

    }

    ngOnInit() {
        this.pedidos = new Array<Pedido>();
        switch (this.autenticationService.getUser().rol) {
            case Diccionario.roles.mozo:
                this.getPedidosMozo();
                break;
            case Diccionario.roles.cocinero:
                this.getPedidosCocinero();
                break;

        }
    }

    pasarAEnPreparacion(item){
        item.showSetTime = true;
        this.tiempoEmpleado = 0;        
    }

    confirmarTiempoElaboracion(item){
        this.loading = true;
        item.estado = Diccionario.estadoProductos.enPreparacion;
        item.empleado = this.autenticationService.getUID();
        item.tiempoEmpleado = this.tiempoEmpleado;
        this.guardarProducto(item);
    }

    cancelarTiempoElaboracion(item){
        item.showSetTime = false;        
    }

    pasarAListo(item){

    }

    getPedidosMozo() {
        this.loading = true;
        this.baseService.getListByProperty(configs.apis.pedidos, 'mozo', this.autenticationService.getUID())
            .subscribe(response => {
                this.pedidos = new Array<Pedido>();
                let pedidos = response.map(pedido => {
                    let datos: any = pedido.payload.val()
                    return new Pedido(pedido.key, datos.mesa, datos.estado, datos.productos, datos.mozo, datos.codigo);
                })
                this.pedidos = pedidos;
                this.loading = false;
            })
    }

    getPedidosCocinero() {
        this.loading = true;
        this.baseService.getListByProperty(configs.apis.pedidos, 'estado', Diccionario.estadoPedidos.enPreparacion)
            .subscribe(response => {
                this.pedidosProductos = new Array<ProductoPedido>();
                let pedidos = response.map(pedido => {
                    let datos: any = pedido.payload.val()
                    return new Pedido(pedido.key, datos.mesa, datos.estado, datos.productos, datos.mozo, datos.codigo);
                })
                pedidos.forEach(pedido => {
                    for (let key in pedido.productos) {
                        if ((pedido.productos[key].tipo == Diccionario.tipoProductos.comida || pedido.productos[key].tipo == Diccionario.tipoProductos.postre)
                            && pedido.productos[key].estado != Diccionario.estadoProductos.listo) {
                            if (pedido.productos[key].empleado == '' || pedido.productos[key].empleado == this.autenticationService.getUID()) {
                                let datos = pedido.productos[key];
                                let productoPedido = new ProductoPedido(key, datos.nombre, datos.precio, datos.tipo, datos.tiempoElaboracion, datos.estado, datos.tiempoEmpleado);
                                productoPedido['showSetTime'] = false;
                                productoPedido['pedidoKey'] = pedido.key;
                                this.pedidosProductos.push(productoPedido);
                            }
                        }
                    }
                })
                this.loading = false;
            })
    }

    guardarProducto(item){
        let model = Tools.deepCopy(item);
        delete model.showSetTime;
        delete model.pedidoKey;
        this.baseService.updateEntity(configs.apis.pedidos + item.pedidoKey + '/' + configs.apis.productos, item.key, model)
        .then(response => {
            this.loading = false;
            item.showSetTime = false;
            this.messageHandler.showSucessMessage("El producto fue tomado con éxito");
        }, error => {
            console.log(error);
            item.estado = Diccionario.estadoProductos.pedido;
            this.loading = false;            
            item.tiempoEmpleado = 0;
            this.messageHandler.showErrorMessage("Ocurrió un error al tomar el pedido");
        })
    }

  


}