import { Diccionario } from '../components/common/diccionario';

export class EncuestaCliente {

    key: string;
    mozo: number;
    comida: number;
    restaurante:number;
    mesa:number;
    pedidoKey:string;
    comentario:string;
    
    constructor(key?, mozo?, comida?, restaurante?, mesa?, pedidoKey?, comentario?){
        this.key = key ? key : '';
        this.mozo = mozo ? mozo : 0;
        this.comida = comida ? comida : 0;
        this.restaurante = restaurante ? restaurante : 0;      
        this.mesa = mesa ? mesa : 0;      
        this.pedidoKey = pedidoKey ? pedidoKey : '';      
        this.comentario = comentario ? comentario : '';      

    }

}