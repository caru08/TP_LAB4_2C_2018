import { Diccionario } from './../components/common/diccionario';
export class Usuario {

    uid: string;
    nombre:string;
    apellido:string;
    dni:number;
    email:string;
    rol:string;
    anonimo:boolean;
    estado: string;
    pass:string;

    constructor(nombre?, apellido?, dni?, anonimo?, email?, rol?, uid?, estado?, pass?){
        this.nombre = nombre ? nombre : '';
        this.apellido = apellido ? apellido : '';
        this.dni = dni ? dni : null;
        this.anonimo = anonimo ? anonimo : false;
        this.email = email ? email : '';
        this.rol = rol ? rol : Diccionario.roles.cliente;
        this.uid = uid ? uid : '';
        this.estado = estado ? estado : Diccionario.estadosUsuarios.activo;
        this.pass = pass ? pass: '';
    }

}