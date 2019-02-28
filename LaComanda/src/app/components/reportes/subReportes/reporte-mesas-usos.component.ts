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
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
    selector: 'reporte-mesas-usos',
    templateUrl: './reporte-mesas-usos.component.html',
    styleUrls: ['sub-reportes.scss'],
})

export class ReporteMesasUsosComponent implements OnInit, OnChanges {

    public loading: boolean;
    public showGraphic = false;
    public doughnutChartLabels: string[] = [];
    public doughnutChartData: number[] = [];
    public doughnutChartType: string = 'doughnut';
  
    constructor(public dialog: MatDialog,
        private baseService: BaseService) {
    }

    ngOnInit() {
        this.getData();
    }

    ngOnChanges() {

    }

    getData() {
        this.loading = true;
        this.baseService.getList(configs.apis.mesas)
            .subscribe(mesasResponse => {
                this.baseService.getListByProperty(configs.apis.pedidos, 'estado', Diccionario.estadoPedidos.cerrado)
                    .subscribe(pedidosResponse => {
                        let contador = {}
                        this.doughnutChartLabels = new Array<string>();
                        this.doughnutChartData = new Array<number>();

                        mesasResponse.forEach(mesa => {
                            let datos = mesa.payload.val();
                            this.doughnutChartLabels.push(datos.nombre + ' - ' + datos.codigo);
                            contador[datos.codigo] = 0;
                        })
                        pedidosResponse.forEach(pedido => {
                            let datos: any = pedido.payload.val();
                            contador[datos.mesa]++;
                        })
                        for (let key in contador) {
                            this.doughnutChartData.push(contador[key])
                        }
                        this.showGraphic = true;
                        this.loading = false;;
                    })

            })
    }
}