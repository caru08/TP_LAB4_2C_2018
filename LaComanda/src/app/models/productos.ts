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

export class ProductoPedido {
    
    key: string;
    nombre:string;
    precio:number;
    tipo:string;
    tiempoElaboracion:number;
    foto:any;
    estado:string;
    tiempoEmpleado:number;
    empleado:string;

    constructor(key?, nombre?, precio?, tipo?, tiempoElaboracion?, estado?, tiempoEmpleado?, empleado?){
        this.key = key ? key : '';
        this.nombre = nombre ? nombre : '';
        this.precio = precio ? precio : 0;
        this.tipo = tipo ? tipo : '';
        this.tiempoElaboracion = tiempoElaboracion ? tiempoElaboracion : 0;
        this.estado = estado ? estado : '';
        this.tiempoEmpleado = tiempoEmpleado ? tiempoEmpleado : '';        
        this.empleado = empleado ? empleado : '';
    }

}