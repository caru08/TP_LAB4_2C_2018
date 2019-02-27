import { Observable, Subscriber } from 'rxjs';
import { BaseService } from './../../services/baseService.service';
import { Diccionario } from '../common/diccionario';
import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MessageHandler } from "../../services";
import { configs } from 'src/app/globalConfigs';
import * as _ from "lodash";
import { Tools } from '../common/tools';
import { EncuestaCliente } from 'src/app/models/encuestaCliente';

@Component({
    selector: 'encuesta-cliente',
    templateUrl: './encuesta-cliente.component.html',
    styleUrls: ['encuesta-cliente.component.scss'],
})

export class EncuestaClienteComponent implements OnInit {

    @Output('close-encuesta') closeEncuesta = new EventEmitter<boolean>();
    @Input('pedido-key') pedidoKey:string;
    autoTicks = false;
    disabled = false;
    invert = false;
    max = 10;
    min = 0;
    showTicks = true;
    step = 1;
    thumbLabel = true;
    value = 0;
    vertical = false; 
    model: EncuestaCliente;

    constructor(private baseService: BaseService,
        private messageHandler: MessageHandler){
    }

    ngOnInit(){
        this.model = new EncuestaCliente('', 10, 10, 10, 10, this.pedidoKey);
    }

    saveClick(){
        this.baseService.addEntity(configs.apis.encuestaCliente, this.model)
        .then(response =>{
            this.messageHandler.showSucessMessage("Gracias por completar la encuesta!");
            this.cancelClick(true);
        }, error =>{
            this.messageHandler.showErrorMessage("Ocurrió un error al agregar la encuesta");
        })
    }

    cancelClick(completada?){
        this.closeEncuesta.emit(completada);
    }

}