import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Diccionario } from './../components/common/diccionario';
import { ProductoPedido } from './productos';
import { Tools } from '../components/common/tools';

export class Pedido {

    key: string;
    codigo:string;
    mesa:string;
    estado:string;
    mozo: string;
    productos:ProductoPedido[];

    constructor(key?, mesa?, estado?, productos?, mozo?, codigo?){
        this.key = key ? key : '';
        this.mesa = mesa ? mesa : '';
        this.estado = estado ? estado : '';
        this.mozo = mozo ? mozo : '';
        this.codigo = codigo ? codigo : '';
        this.productos = productos ? productos : new Array<ProductoPedido>();       
    }

    mapDataToServer(productos){
        this.productos = new Array<ProductoPedido>();
        productos.forEach(producto => {
            let productoPedido = new ProductoPedido(producto.key, producto.nombre, producto.precio, producto.tipo, producto.tiempoElaboracion, Diccionario.estadoProductos.pedido, 0)
            this.productos.push(productoPedido);
        });
        this.estado = Diccionario.estadoPedidos.enPreparacion;
        this.codigo = Tools.generateRandomString();
    }

}