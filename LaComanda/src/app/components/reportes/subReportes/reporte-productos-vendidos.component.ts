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
    selector: 'report-productos-vendidos',
    templateUrl: './reporte-productos-vendidos.component.html',
    styleUrls: ['sub-reportes.scss'],
})

export class ReporteProductosVendidosComponent implements OnInit, OnChanges {

    @Input('tipo-producto') tipoProducto: any;
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

    public barChartLabels: string[] = [];
    public barChartType: string = 'horizontalBar';
    public barChartLegend: boolean = true;
    public barChartData: any[] = [{ data: [], label: 'Productos' }];
    public showGraphic = false;

    constructor(public dialog: MatDialog,
        private baseService: BaseService) {
    }

    ngOnInit() {
        this.getData();
    }

    ngOnChanges() {

    }

    getData() {
        this.baseService.getListByProperty(configs.apis.pedidos, 'estado', Diccionario.estadoPedidos.cerrado)
            .subscribe(response => {
                debugger;
                this.totalData = new Array<any>();
                let contador = {}
                response.forEach(pedido => {
                    let datosPedido: any = pedido.payload.val();
                    datosPedido.productos.forEach(producto => {
                        let existsLabel = _.find(this.barChartLabels, label => {
                            return label == producto.nombre;
                        })
                        if (existsLabel) {
                            contador[producto.nombre]++;
                        } else {
                            this.barChartLabels.push(producto.nombre);
                            contador[producto.nombre] = 1;
                        }
                    });
                })
                for (let key in contador) {
                    this.barChartData[0].data.push(contador[key]);
                }
                this.showGraphic = true;
            })
    }
}