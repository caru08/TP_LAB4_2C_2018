export class Cliente {

    uid: string;
    nombre:string;
    apellido:string;
    dni:number;
    mail:string;
    rol:string = "cliente";
    anonimo:boolean;

    constructor(nombre, apellido, dni, anonimo){
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.anonimo = anonimo;
    }

}