import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { configs } from '../globalConfigs';
import { Observable, Subject } from 'rxjs';
import { BaseService } from './baseService.service';
import { ParamsService } from './params.service';
import { Usuario } from '../models/usuario';


@Injectable()
export class AuthenticationService{

    public sessionChange: Subject<any> = new Subject();
    public sessionCheck: boolean;
    public addingUser:boolean;

    constructor(private MiAuth:AngularFireAuth,
        private baseService: BaseService,
        private paramsService: ParamsService,
        public afDB: AngularFireDatabase){
            this.MiAuth.authState.subscribe(user => {
                if(this.addingUser) return;
                if(user){
                    this.logInFromDataBase();
                    this.getUserData(user.uid);
                }else{
                    this.sessionChange.next(null);
                }
            });
    }

    

    registerUserAndLogin(email:string, pass:string){
        return this.MiAuth.auth.createUserWithEmailAndPassword(email, pass)
    }

    registerAnonymous(){
        return this.MiAuth.auth.signInAnonymously();
    }

    singIn(email:string, pass:string){
        return this.MiAuth.auth.signInWithEmailAndPassword(email, pass);
    }

    getEmail(){
        return  this.MiAuth.auth.currentUser.email;
    }

    getUID(){
        return this.MiAuth.auth.currentUser.uid;
    }

    isLogged():boolean {
        return this.MiAuth.auth.currentUser ? true : false;
    }

    logOut(){
        this.paramsService.setUser(null);
        this.MiAuth.auth.signOut();
        this.logoutFromDatabase();        
    }

    deleteUserLogged(){
        var user = this.MiAuth.auth.currentUser;
        return user.delete();
    }

    public logInFromDataBase(){
        this.afDB.database.goOnline();
    }
    
    public logoutFromDatabase() {
        this.afDB.database.goOffline();
    }

    sendVerification(){
        return this.MiAuth.auth.currentUser.sendEmailVerification();
    }
     getVerification(){
        return this.MiAuth.auth.currentUser.emailVerified;
    }

    private getUserData(uid){
        this.baseService.getEntityByUId(uid, configs.apis.usuarios)
        .subscribe(response =>{
            this.sessionCheck = true;
            if(response[0]){
                let model:any = response[0].payload.val();
                let usuario = new Usuario(model.nombre, model.apellido, model.dni, model.anonimo, model.rol);
                usuario.uid = model.uid;
                this.paramsService.setUser(usuario);
                this.sessionChange.next(usuario);
            }        
        })
    }
}
