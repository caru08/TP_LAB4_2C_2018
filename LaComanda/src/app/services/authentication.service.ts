import { AngularFireModule } from 'angularfire2'
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { configs } from '../globalConfigs';
import { Observable, Subject, Subscriber } from 'rxjs';
import { BaseService } from './baseService.service';
import { Usuario } from '../models/usuario';
import * as firebase from 'firebase';

@Injectable()
export class AuthenticationService {

    public sessionChange: Subject<any> = new Subject();
    public sessionCheck: boolean;

    private user: any;
    private pass: any;
    private email: any;

    constructor(private MiAuth: AngularFireAuth,
        private af: AngularFireModule,
        private baseService: BaseService,
        public afDB: AngularFireDatabase) {
        this.MiAuth.authState.subscribe(user => {
            if (user) {
                this.logInFromDataBase();
                this.getUserData(user.uid);
            } else {
                this.sessionChange.next(null);
            }
        });
    }

    registerUserAndLogin(email: string, pass: string) {
        return this.MiAuth.auth.createUserWithEmailAndPassword(email, pass)
    }

    registerAnonymous() {
        return this.MiAuth.auth.signInAnonymously();
    }

    createUser(email: string, pass: string) {
        var config = configs.firebaseConfig;
        var secondaryApp = firebase.initializeApp(config, "Secondary");

        return new Observable<any>((subscriber: Subscriber<any>) => {
            secondaryApp.auth().createUserWithEmailAndPassword(email, pass).then(function (firebaseUser) {
                secondaryApp.auth().signOut();
                subscriber.next(firebaseUser);
            })
        })
    }

    singIn(email: string, pass: string) {
        return this.MiAuth.auth.signInWithEmailAndPassword(email, pass);
    }

    getEmail() {
        return this.MiAuth.auth.currentUser.email;
    }

    getUID() {
        return this.MiAuth.auth.currentUser.uid;
    }

    setUser(user) {
        this.user = user;
    }

    setEmailPass(email, pass) {
        this.email = email;
        this.pass = pass;
    }

    getUser(): Usuario {
        return this.user;
    }

    getPass() {
        return this.pass;
    }

    getLoggedEmail() {
        return this.email;
    }

    isLogged(): boolean {
        return this.MiAuth.auth.currentUser ? true : false;
    }

    logOut() {
        this.setUser(null);
        this.setEmailPass('', '');
        this.MiAuth.auth.signOut();
        this.logoutFromDatabase();
    }

    deleteUserLogged() {
        var user = this.MiAuth.auth.currentUser;
        return user.delete();
    }

    public logInFromDataBase() {
        this.afDB.database.goOnline();
    }

    public logoutFromDatabase() {
        this.afDB.database.goOffline();
    }

    sendVerification() {
        return this.MiAuth.auth.currentUser.sendEmailVerification();
    }
    getVerification() {
        return this.MiAuth.auth.currentUser.emailVerified;
    }

    private getUserData(uid) {
        this.baseService.getEntityByUId(uid, configs.apis.usuarios)
            .subscribe(response => {
                this.sessionCheck = true;
                if (response[0]) {
                    let model: any = response[0].payload.val();
                    let usuario = new Usuario(model.nombre, model.apellido, model.dni, model.anonimo, model.email, model.rol, uid);
                    usuario.uid = model.uid;
                    this.setUser(usuario);
                    this.sessionChange.next(usuario);
                }
            })
    }
}
