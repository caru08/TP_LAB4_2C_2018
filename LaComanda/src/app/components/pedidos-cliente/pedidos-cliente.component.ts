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

    public codigoMesa: string;
    public codigoPedido: string;
    public estadosPedidos = {
        cuentaSolicitada: 'Cuenta Solicitada',
        enPreparacion: 'En Preparación',
        listo: 'Listo para servir',
        entregado: 'Entregado',
        cerrado: 'Cerrado',
        cancelado: 'Cancelado'
    };
    public staticEstadoPedidos: any;
    public pedido = new Pedido();
    public tiempoDemora: string;
    public sinPedido: string;
    public mostrarEncuesta: boolean;
    public encuestaCompletada: boolean;

    constructor(private baseService: BaseService,
        private messageHandler: MessageHandler,
        private autenticationService: AuthenticationService,
        private dialog: MatDialog) {
        this.staticEstadoPedidos = Diccionario.estadoPedidos;
    }

    ngOnInit() {
    }

    consultarPedido() {
        this.baseService.getListByProperty(configs.apis.pedidos, 'codigo', this.codigoPedido)
            .subscribe(response => {
                this.mostrarEncuesta = false;
                if (response[0]) {
                    this.sinPedido = "";
                    let datos: any = response[0].payload.val();
                    let pedido = new Pedido(response[0].key, datos.mesa, datos.estado, datos.productos, datos.mozo, 
                        datos.codigo, datos.fecha, datos.foto, datos.cliente, datos.fechaEntrega);
                    pedido.mapProductos(pedido.productos)
                    this.pedido = pedido;
                    this.consultarPorEncuesta();
                    if (this.pedido.estado == Diccionario.estadoPedidos.enPreparacion) {
                        this.getTiempoDemora();
                    }
                } else {
                    this.sinPedido = "No se encontró un pedido con ese código"
                }
            }, error => {
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

    completarEncuesta() {
        this.mostrarEncuesta = true;
    }

    pedirCuenta() {
        this.pedido.estado = Diccionario.estadoPedidos.cuentaSolicitada;
        this.baseService.updateEntity(configs.apis.pedidos, this.pedido.key, this.pedido)
            .then(response => {
                this.messageHandler.showSucessMessage("La cuenta fue solicitada");
            }, error => {
                this.messageHandler.showErrorMessage("Ocurrió un error al pedir la cuenta")
            })
        this.actualizarEstadoMesa();

    }

    encuestaCerrada(data) {
        this.encuestaCompletada = data ? true : false;
        this.mostrarEncuesta = false;
    }

    private getTiempoDemora() {
        this.tiempoDemora = "";
        let fechaPedido = this.pedido.fecha;
        Tools.parseStringDateTimeToDateTime(fechaPedido);
        var demoraMinutos = 0;
        this.pedido.productos.forEach(producto => {
            demoraMinutos += producto.tiempoEmpleado ? producto.tiempoEmpleado : producto.tiempoElaboracion;
        })
        var horas = 0;
        var minutos = 0;
        while (demoraMinutos > 60) {
            horas++;
            demoraMinutos = demoraMinutos - 60;
        }
        minutos = demoraMinutos;
        this.tiempoDemora = "El pedido estará listo en: ";
        this.tiempoDemora += horas ? horas > 1 ? horas + " horas y " + minutos + " minutos"
            : horas + " hora y " + minutos + " minutos"
            : minutos + " minutos";
    }

    private consultarPorEncuesta() {
        this.baseService.getListByProperty(configs.apis.encuestaCliente, 'pedidoKey', this.pedido.key)
            .subscribe(response => {
                if (response[0]) {
                    this.encuestaCompletada = true;
                } else {
                    this.encuestaCompletada = false;
                }
            })
    }

    private actualizarEstadoMesa() {
        var update = false;
        this.baseService.getListByProperty(configs.apis.mesas, 'codigo', this.pedido.mesa)
            .subscribe(response => {
                if (response[0]) {
                    if (update) return;
                    let datos: any = response[0].payload.val();
                    let mesa = new Mesa(response[0].key, datos.codigo, datos.nombre, datos.estado, datos.foto);
                    mesa.estado = Diccionario.estadoMesas.clientePagando;
                    this.baseService.updateEntity(configs.apis.mesas, mesa.key, mesa);
                    update = true;
                }
            })
    }

}