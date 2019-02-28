import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable, Query } from '@angular/core';


@Injectable()
export class BaseService {

    constructor(public db: AngularFireDatabase) {
    }

    public getKey(ruta: string) {
        return this.db.database.ref().child(ruta).push().key;
    }

    public addEntity(ruta: string, data) { //then
       return this.db.list<any>(ruta).push(data);
       /* return this.db.database.ref().child(ruta + key)
            .update(data);*/
    }

    public updateEntity(ruta, key, data) { //then
        return this.db.list<any>(ruta).update(key, data);
        //return this.db.database.ref().child(ruta + key).update(data);
    }

    public deleteEntity(ruta, key){
        return this.db.list<any>(ruta + key).remove();
    }

    public getList(path) { //subscribe
        return this.db.list<any>(path).snapshotChanges()
    }

    public getListByProperty(path, propertyName, propertyValue){ //subscribe
        return this.db.list(path, ref => ref.orderByChild(propertyName).equalTo(propertyValue)).snapshotChanges();
    }

    public getEntityById(id, path) {
        return this.db.list(path, ref => ref.orderByChild('id').equalTo(id))
    }

    public getEntityByUId(id, path) { //subscribe
       return this.db.list(path, ref => ref.orderByChild('uid').equalTo(id)).snapshotChanges();
    }

    public getEntityByKey(key, path) {
        return this.db.list(path, ref => ref.orderByChild('key').equalTo(key)).snapshotChanges();
    }

}