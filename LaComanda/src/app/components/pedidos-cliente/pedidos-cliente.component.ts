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
import * as _ from "lodash";
import { Tools } from '../common/tools';

@Component({
    selector: 'pedidos-cliente',
    templateUrl: './pedidos-cliente.component.html',
    styleUrls: ['pedidos-cliente.component.scss'],
})

export class PedidosClienteComponent implements OnInit {

    public codigoMesa:string;
    public codigoPedido:string;
    public estadosPedidos = {
        cuentaSolicitada: 'Cuenta Solicitada',
        enPreparacion: 'En Preparación',
        listo: 'Listo para servir',
        entregado: 'Entregado',
        cerrado: 'Cerrado'
    };
    public staticEstadoPedidos: any;
    public pedido = new Pedido();
    public tiempoDemora:string;

    constructor(private baseService: BaseService,
        private messageHandler: MessageHandler,
        private autenticationService: AuthenticationService,
        private dialog: MatDialog) {
            this.staticEstadoPedidos = Diccionario.estadoPedidos;
    }

    ngOnInit(){

    }

    consultarPedido(){
        this.baseService.getListByProperty(configs.apis.pedidos, 'codigo', this.codigoPedido)
        .subscribe(response => {
            if(response[0]){
                let datos:any = response[0].payload.val();
                let pedido = new Pedido(response[0].key, datos.mesa, datos.estado, datos.productos, datos.mozo, datos.codigo, datos.fecha);
                pedido.mapProductos(pedido.productos)
                this.pedido = pedido;
                //setear tiempo demora
            }
        }, error =>{
            this.messageHandler.showErrorMessage("Ocurrió un error al consultar el pedido");
        })
    }

    getTotal() {
        let total = 0;
        this.pedido.productos.forEach(producto => {
            total += producto.precio;
        });
        return total;
    }

    pedirCuenta(){
        this.pedido.estado = Diccionario.estadoPedidos.cuentaSolicitada;
        this.baseService.updateEntity(configs.apis.pedidos, this.pedido.key, this.pedido)
        .then(response => {
            this.messageHandler.showSucessMessage("La cuenta fue solicitada");
        }, error => {
            this.messageHandler.showErrorMessage("Ocurrió un error al pedir la cuenta")
        })
    }

}