import { Diccionario } from './../components/common/diccionario';
export class Usuario {

    uid: string;
    nombre:string;
    apellido:string;
    dni:number;
    email:string;
    rol:string;
    anonimo:boolean;

    constructor(nombre, apellido, dni, anonimo, email, rol?, uid?){
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.anonimo = anonimo;
        this.rol = rol ? rol : Diccionario.roles.cliente
        this.email = email ? email : '';
        this.uid = uid ? uid : '';
    }

}