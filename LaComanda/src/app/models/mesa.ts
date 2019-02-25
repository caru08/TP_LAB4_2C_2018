import { Diccionario } from '../components/common/diccionario';
export class Mesa {

    key: string;
    codigo: string;
    nombre:string;
    estado:string;
    foto: string;
    
    constructor(key?, codigo?, nombre?, estado?, foto?){
        this.key = key ? key : '';
        this.codigo = codigo ? codigo : '';
        this.nombre = nombre ? nombre : '';
        this.estado = estado ? estado : '';      
        this.foto = foto ? foto : '';      
    }

}