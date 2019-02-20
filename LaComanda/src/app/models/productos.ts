import { Diccionario } from './../components/common/diccionario';
export class Producto {

    key: string;
    nombre:string;
    descripcion:string;
    precio:number;
    tipo:string;
    tiempoElaboracion:number;
    foto:any;

    constructor(key?, nombre?, descripcion?, precio?, tipo?, tiempoElaboracion?, foto?){
        this.key = key ? key : '';
        this.nombre = nombre ? nombre : '';
        this.descripcion = descripcion ? descripcion : '';
        this.precio = precio ? precio : 0;
        this.tipo = tipo ? tipo : '';
        this.tiempoElaboracion = tiempoElaboracion ? tiempoElaboracion : 0;
        this.foto = foto ? foto: '';
    }

}