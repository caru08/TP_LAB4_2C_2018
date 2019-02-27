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
    fecha: string;
    foto: string;
    cliente: string;
    

    constructor(key?, mesa?, estado?, productos?, mozo?, codigo?, fecha?, foto?, cliente?){
        this.key = key ? key : '';
        this.mesa = mesa ? mesa : '';
        this.estado = estado ? estado : '';
        this.mozo = mozo ? mozo : '';
        this.codigo = codigo ? codigo : '';
        this.productos = productos ? productos : new Array<ProductoPedido>();       
        this.fecha = fecha ? fecha : '';
        this.foto = foto ? foto : '';
        this.cliente = cliente ? cliente : '';
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

    mapProductos(productos){
        this.productos = new Array<ProductoPedido>();
        productos.forEach(producto => {
            let productoPedido = new ProductoPedido(producto.key, producto.nombre, producto.precio, producto.tipo, producto.tiempoElaboracion, 
                Diccionario.estadoProductos.pedido, producto.tiempoEmpleado)
            this.productos.push(productoPedido);
        });
    }

}