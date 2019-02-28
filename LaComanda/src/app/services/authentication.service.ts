import { MessageHandler } from './messageHandler.service';
import { AngularFireModule } from 'angularfire2'
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { configs } from '../globalConfigs';
import { Observable, Subject, Subscriber } from 'rxjs';
import { BaseService } from './baseService.service';
import { Usuario } from '../models/usuario';
import * as firebase from 'firebase';
import * as _ from 'lodash';
import { Diccionario } from '../components/common/diccionario';
import { Tools } from '../components/common/tools';
import { DataSource } from '@angular/cdk/table';

@Injectable()
export class AuthenticationService {

    public sessionChange: Subject<any> = new Subject();
    public sessionCheck: boolean;

    private clickLogin: boolean;
    private user: any;
    private pass: any;
    private email: any;
    private loginInfo: any;

    constructor(private MiAuth: AngularFireAuth,
        private baseService: BaseService,
        public afDB: AngularFireDatabase,
        private messageHandler: MessageHandler) {
        this.MiAuth.authState.subscribe(user => {
            if (user) {
                this.logInFromDataBase();
                this.getUserData(user.uid);
            } else {
                this.sessionCheck = true;
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
        let secondaryApp = this.getSecondaryFirebaseApp();
        return new Observable<any>((subscriber: Subscriber<any>) => {
            secondaryApp.auth().createUserWithEmailAndPassword(email, pass).then(function (firebaseUser) {
                secondaryApp.auth().signOut();
                subscriber.next(firebaseUser);
            }, error => {
                subscriber.next(error);
            })
        })
    }

    deleteUser(email, pass) {
        let secondaryApp = this.getSecondaryFirebaseApp();
        return new Observable<any>((subscriber: Subscriber<any>) => {
            secondaryApp.auth().signInWithEmailAndPassword(email, pass)
                .then(response => {
                    secondaryApp.auth().currentUser.delete()
                        .then(response => {
                            subscriber.next(response);
                        })
                })
        })
    }

    singIn(email: string, pass: string, clicklogin) {
        this.clickLogin = clicklogin;
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
        this.logFinSesion();
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

    public logInicioSesion(usuario) {
        let fecha = new Date();
        let fechaString = Tools.parseServerFormatDate(fecha);
        let logInicio = { fechaInicio: fechaString, usuarioId: usuario.uid, usuarioEmail: usuario.email, rol: usuario.rol, fechaFin: 'vacia' };
        this.baseService.addEntity(configs.apis.logSesiones, logInicio)
            .then(response => {
            })
    }

    private logFinSesion() {
        let logFin = Tools.deepCopy(this.loginInfo);
        let fecha = new Date();
        let fechaFin = Tools.parseServerFormatDate(fecha);
        logFin['fechaFin'] = fechaFin;
        this.baseService.updateEntity(configs.apis.logSesiones, logFin.key, logFin)
            .then(response => {
                this.setUser(null);
                this.setEmailPass('', '');
                this.MiAuth.auth.signOut();
                this.logoutFromDatabase();
            });
    }

    private getUserData(uid) {
        this.baseService.getEntityByUId(uid, configs.apis.usuarios)
            .subscribe(response => {
                this.sessionCheck = true;
                if (response[0]) {
                    let model: any = response[0].payload.val();
                    if (model.estado == Diccionario.estadosUsuarios.suspendido) {
                        this.messageHandler.showErrorMessage("Error al iniciar sesión, la cuenta está suspendida");
                        this.logOut();
                    } else {
                        let usuario = new Usuario(model.nombre, model.apellido, model.dni, model.anonimo, model.email, model.rol, uid, model.estado);
                        usuario.uid = model.uid;
                        this.setUser(usuario);
                        if (this.clickLogin && usuario.rol != Diccionario.roles.cliente) {
                            this.logInicioSesion(usuario);
                        } else if (usuario.rol != Diccionario.roles.cliente) {
                            this.getLogInisio(usuario);
                        }
                        this.sessionChange.next(usuario);
                    }
                } else {
                    this.logOut();
                }
            })
    }

    private getSecondaryFirebaseApp() {
        var config = configs.firebaseConfig;
        var firebaseApss = firebase.apps;
        var secondaryApp;
        if (firebaseApss.length > 1) {
            for (var i = 0; i < firebaseApss.length; i++) {
                if (firebaseApss[i].name == 'Secondary') {
                    secondaryApp = firebaseApss[i]
                }
            }
        } else {
            secondaryApp = firebase.initializeApp(config, 'Secondary');
        }
        return secondaryApp;
    }

    private getLogInisio(usuario) {
        this.baseService.getListByProperty(configs.apis.logSesiones, 'fechaFin', 'vacia')
            .subscribe(response => {
                if (this.isLogged()) {
                    response.forEach(log => {
                        let dato: any = log.payload.val();
                        if (dato.usuarioId == usuario.uid) {
                            this.loginInfo = {
                                key: response[0].key, fechaInicio: dato.fechaInicio, usuarioId: dato.usuarioId,
                                usuarioEmail: dato.usuarioEmail, rol: dato.rol, fechaFin: dato.fechaFin
                            };
                            return;
                        }
                    })
                }
            })
    }


}
