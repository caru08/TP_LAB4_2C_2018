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
    public staticEstadoPedidos: any;
    public staticEstadoProductos: any;
    public estadosPedidos = {
        cuentaSolicitada: 'Cuenta Solicitada',
        enPreparacion: 'En Preparación',
        listo: 'Listo para servir',
        entregado: 'Entregado',
        cerrado: 'Cerrado'
    }
    public estadoProductos = {
        pedido: 'Pedido',
        enPreparacion: 'En Preparación',
        listo: 'Listo'
    };
    public showSetTime: boolean;
    public tiempoEmpleado: number;
    public showNoHayProductos: boolean;
    public isSocio: boolean;

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
            case Diccionario.roles.bartener:
                this.getPedidosBartender();
                break;
            case Diccionario.roles.socio:
                this.isSocio = true;
                this.getPedidosSocio();
                break;

        }
    }

    pasarAEnPreparacion(item) {
        item.showSetTime = true;
        this.tiempoEmpleado = item.tiempoElaboracion;
    }

    confirmarTiempoElaboracion(item) {
        this.loading = true;
        item.estado = Diccionario.estadoProductos.enPreparacion;
        item.empleado = this.autenticationService.getUID();
        item.tiempoEmpleado = this.tiempoEmpleado;
        this.guardarProducto(item, "El producto fue tomado con éxito", "Ocurrió un error al tomar el pedido");
    }

    cancelarTiempoElaboracion(item) {
        item.showSetTime = false;
    }

    pasarAListo(item) {
        item.estado = Diccionario.estadoProductos.listo;
        this.guardarProducto(item, "El producto fue marcado como 'LISTO'", "Ocurrió un error al marca el producto como 'LISTO'");
    }

    pasarAEntregado(item) {
        item.estado = Diccionario.estadoPedidos.entregado;
        this.baseService.updateEntity(configs.apis.pedidos, item.key, item)
            .then(response => {
                this.messageHandler.showSucessMessage("El pedido fue actualizado como 'Entregado'")
            }, error => {
                this.messageHandler.showErrorMessage("Ocurrió un error al marcar el pedido como 'Entregado'")
            })
    }

    cerrarPedido(item) {
        item.estado = Diccionario.estadoPedidos.cerrado;
        this.baseService.updateEntity(configs.apis.pedidos, item.key, item)
            .then(response => {
                this.messageHandler.showSucessMessage("El pedido fue Cerrado")
            }, error => {
                this.messageHandler.showErrorMessage("Ocurrió un error al cerrar el pedido")
            })
    }

    private getPedidosMozo() {
        this.loading = true;
        this.baseService.getListByProperty(configs.apis.pedidos, 'mozo', this.autenticationService.getUID())
            .subscribe(response => {
                this.pedidos = new Array<Pedido>();
                let pedidos = response.map(pedido => {
                    let datos: any = pedido.payload.val()
                    return new Pedido(pedido.key, datos.mesa, datos.estado, datos.productos, datos.mozo, datos.codigo, datos.fecha);
                })
                this.checkPedidosEstado(pedidos);
                this.pedidos = pedidos;
                this.showNoHayProductos = this.pedidos.length ? false : true;
                this.loading = false;
            })
    }

    private getPedidosCocinero() {
        this.loading = true;
        this.baseService.getListByProperty(configs.apis.pedidos, 'estado', Diccionario.estadoPedidos.enPreparacion)
            .subscribe(response => {
                this.pedidosProductos = new Array<ProductoPedido>();
                let pedidos = response.map(pedido => {
                    let datos: any = pedido.payload.val()
                    return new Pedido(pedido.key, datos.mesa, datos.estado, datos.productos, datos.mozo, datos.codigo);
                })
                this.checkPedidosEstado(pedidos);
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
                this.showNoHayProductos = this.pedidosProductos.length ? false : true;
                this.loading = false;
            })
    }

    private getPedidosBartender() {
        this.loading = true;
        this.baseService.getListByProperty(configs.apis.pedidos, 'estado', Diccionario.estadoPedidos.enPreparacion)
            .subscribe(response => {
                this.pedidosProductos = new Array<ProductoPedido>();
                let pedidos = response.map(pedido => {
                    let datos: any = pedido.payload.val()
                    return new Pedido(pedido.key, datos.mesa, datos.estado, datos.productos, datos.mozo, datos.codigo, datos.fecha);
                })
                this.checkPedidosEstado(pedidos);
                pedidos.forEach(pedido => {
                    for (let key in pedido.productos) {
                        if (pedido.productos[key].tipo == Diccionario.tipoProductos.bebida && pedido.productos[key].estado != Diccionario.estadoProductos.listo) {
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
                this.showNoHayProductos = this.pedidosProductos.length ? false : true;
                this.loading = false;
            })
    }

    private getPedidosSocio() {
        this.loading = true;
        this.baseService.getList(configs.apis.pedidos)
            .subscribe(response => {
                let pedidos = _.filter(response, pedido => {
                    if (pedido.payload.val().estado !== Diccionario.estadoPedidos.cerrado) {
                        return pedido;
                    }
                })
                this.pedidos = pedidos.map(pedido => {
                    let datos: any = pedido.payload.val()
                    return new Pedido(pedido.key, datos.mesa, datos.estado, datos.productos, datos.mozo, datos.codigo, datos.fecha);
                })
                this.loading = false;
            })
    }

    private guardarProducto(item, mensajeExito, mensajeError) {
        let model = Tools.deepCopy(item);
        delete model.showSetTime;
        delete model.pedidoKey;
        this.baseService.updateEntity(configs.apis.pedidos + item.pedidoKey + '/' + configs.apis.productos, item.key, model)
            .then(response => {
                this.loading = false;
                item.showSetTime = false;
                this.messageHandler.showSucessMessage(mensajeExito);
            }, error => {
                console.log(error);
                item.estado = Diccionario.estadoProductos.pedido;
                this.loading = false;
                item.tiempoEmpleado = 0;
                this.messageHandler.showErrorMessage(mensajeError);
            })
    }

    private checkPedidosEstado(pedidos) {
        pedidos.forEach(pedido => {
            if (pedido.estado !== Diccionario.estadoPedidos.listo && pedido.estado !== Diccionario.estadoPedidos.entregado) {
                let pedidoListo = true;
                for (let key in pedido.productos) {
                    if (pedido.productos[key].estado !== Diccionario.estadoProductos.listo) {
                        pedidoListo = false;
                    }
                }
                if (pedidoListo) {
                    pedido.estado = Diccionario.estadoPedidos.listo;
                    this.baseService.updateEntity(configs.apis.pedidos, pedido.key, pedido)
                        .then(response => {
                        }, error => {
                        })
                }
            }
        });
    }



}