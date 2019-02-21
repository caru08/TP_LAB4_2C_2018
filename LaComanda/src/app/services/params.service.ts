import { Usuario } from './../models/usuario';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';

@Injectable()
export class ParamsService {

    user:any;
    pass:any;
    email: any;

    constructor(){

    }

    setUser(user){
        this.user = user;
    }

    setEmailPass(email, pass){
        this.email = email;
        this.pass = pass;
    }

    getUser(): Usuario {
        return this.user;
    }

}