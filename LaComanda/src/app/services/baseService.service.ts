import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';

@Injectable()
export class BaseService {

    constructor(public db:AngularFireDatabase){
    }

    public getKey(ruta:string){
        return this.db.database.ref().child(ruta).push().key;
    }
        
    public addEntity(ruta:string, data){ //then
        let key = this.getKey(ruta);
        return this.db.database.ref().child(ruta + key)
        .update(data);
    }

    public updateEntity(ruta, key, data){ //then
        return this.db.database.ref().child(ruta + key)
        .update(data);
    }

    public obtenerLista(path) { //subscribe
        return  this.db.list<any>(path).valueChanges()
    }

    public getEntityById(id, path){
       return this.db.list('path', ref => ref.orderByChild('id').equalTo(id))        
    }

}