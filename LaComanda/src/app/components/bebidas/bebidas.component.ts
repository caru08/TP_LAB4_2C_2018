import { Diccionario } from '../common/diccionario';
import { Usuario } from './../../models/usuario';
import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { RoutesHandler, MessageHandler, ParamsService } from "../../services";

@Component({
  selector: 'bebidas',
  templateUrl: './bebidas.component.html',
  styleUrls: ['bebidas.component.scss'],
})

export class BebibasComponent implements OnInit {

    ngOnInit(){

    }

}