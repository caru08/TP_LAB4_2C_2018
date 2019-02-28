import { Usuario } from './../models/usuario';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';

@Injectable()
export class ParamsService {

    accept:boolean;
    cancel:boolean;

    constructor(){

    }


}