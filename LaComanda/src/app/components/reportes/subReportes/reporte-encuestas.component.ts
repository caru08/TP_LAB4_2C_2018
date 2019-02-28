import { Producto } from './../../../models/productos';
import { BaseService } from './../../../services/baseService.service';
import { MessageHandler } from '../../../services/messageHandler.service';
import { ParamsService } from 'src/app/services';
import { Component, OnInit, OnDestroy, Input, SimpleChange, SimpleChanges, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Diccionario } from '../../common/diccionario';
import { AuthenticationService } from '../../../services/authentication.service';
import { configs } from 'src/app/globalConfigs';
import { TableColumn } from 'src/app/models/TableColumn';
import * as _ from 'lodash';
import { Tools } from '../../common/tools';
import { LoginComponent } from '../../login/login.component';
import { Pedido } from 'src/app/models/pedido';

@Component({
    selector: 'reporte-encuestas',
    templateUrl: './reporte-encuestas.component.html',
    styleUrls: ['sub-reportes.scss'],
})

export class ReporteEncuestasComponent implements OnInit, OnChanges {

    @Input('tipo-filtro') tipoFiltro: any;
    public loading: boolean;
    public tableDate = new Array<any>();
    public totalData = new Array<any>();
    public subscribeData: any;
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [
                {
                    ticks: {
                        beginAtZero: true
                    }
                }
            ]
        }
    };

    public barChartLabels: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;
    public showGraphic: boolean = false;
    public barChartData: any[] = [{ data: [], label: 'Puntaje' }];

  /*  public barChartData: any[] = [
        { data: [65, 59, 80, 81, 56, 55, 40, 0, 0, 0], label: 'Puntaje' },
    ];*/

    constructor(public dialog: MatDialog,
        private baseService: BaseService) {
    }

    ngOnInit() {
        this.getData();
    }

    ngOnChanges() {

    }

    getData() {
        this.baseService.getList(configs.apis.encuestaCliente)
            .subscribe(response => {
                this.totalData = new Array<any>();
                let contador = {
                    comida: {
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                        5: 0,
                        6: 0,
                        7: 0,
                        8: 0,
                        9: 0,
                        10: 0
                    },
                    mesa: {
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                        5: 0,
                        6: 0,
                        7: 0,
                        8: 0,
                        9: 0,
                        10: 0
                    },
                    restaurante: {
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                        5: 0,
                        6: 0,
                        7: 0,
                        8: 0,
                        9: 0,
                        10: 0
                    },
                    mozo: {
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                        5: 0,
                        6: 0,
                        7: 0,
                        8: 0,
                        9: 0,
                        10: 0
                    }
                }
                response.forEach(encuesta => {
                    let datoEncuesta: any = encuesta.payload.val();
                    contador.comida[datoEncuesta.comida]++;
                    contador.restaurante[datoEncuesta.restaurante]++;
                    contador.mozo[datoEncuesta.mozo]++;
                    contador.mesa[datoEncuesta.mesa]++;
                })
                let filtro = this.tipoFiltro;
                for (let key in contador[filtro]) {
                    this.barChartData[0].data.push(contador[filtro][key]);
                }                
                this.showGraphic = true;
            })
    }
}