import { Diccionario } from './../components/common/diccionario';
export class Usuario {

    uid: string;
    nombre:string;
    apellido:string;
    dni:number;
    mail:string;
    rol:string;
    anonimo:boolean;

    constructor(nombre, apellido, dni, anonimo, rol?){
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.anonimo = anonimo;
        this.rol = rol ? rol : Diccionario.roles.cliente
    }

}