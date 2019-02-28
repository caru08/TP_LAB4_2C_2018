//reporte-pedidos-cancelados.component
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
import { Producto } from 'src/app/models/productos';

@Component({
    selector: 'reporte-tiempo-entrega',
    templateUrl: './reporte-tiempo-entrega.component.html',
    styleUrls: ['sub-reportes.scss'],
})

export class ReporteTiempoEntregaComponent implements OnInit, OnChanges {

    @Input('filtro-fecha-inicio') filtrofechainicio: any;
    @Input('filtro-fecha-fin') filtrofechaFin: any;
    @Input('filtro-rol') filtroRol: any;
    @Input('filtro-empleado') filtroEmpleado: any;
    public loading: boolean;
    public columns = new Array<TableColumn>();
    public tableDate = new Array<any>();
    public subscribeData: any;
    public showGraphic = false;
    public doughnutChartLabels: string[] = ['Con Demora', 'A Tiempo'];
    public doughnutChartData: number[] = [];
    public doughnutChartType: string = 'doughnut';
  

    constructor(public dialog: MatDialog,
        private baseService: BaseService) {
    }

    ngOnInit(){
        this.setColumns();
        this.getData();
    }

    ngOnChanges(){

    }

    private setColumns() {
        this.columns = new Array<TableColumn>();
        this.columns.push(new TableColumn('codigo', 'Codigo', false, 'start', 10, 25));
        this.columns.push(new TableColumn('fechaPedido', 'Fecha Pedido', false, 'start', 25, 20));
        this.columns.push(new TableColumn('fechaEntrega', 'Fecha Entrega', false, 'start', 25, 20));
        this.columns.push(new TableColumn('tiempoElaboracion', 'Tiempo Elaboracion', false, 'start', 15, 20));
        this.columns.push(new TableColumn('estadoEntrega', 'En tiempo', false, 'start', 20, 20));
    }

    private getData(){
        this.loading = true;
        this.baseService.getListByProperty(configs.apis.pedidos, 'estado', Diccionario.estadoPedidos.cerrado)
        .subscribe(response => {
            let countConDemora = 0;
            let countATiempo = 0;
            this.tableDate = response.map(pedido => {
                let datos:any = pedido.payload.val();
                let tiempoElaboracion = 0;
                let enTiempo = false;
               
                datos.productos.forEach(producto => {
                    tiempoElaboracion += producto.tiempoEmpleado ? producto.tiempoEmpleado : producto.tiempoElaboracion;                    
                });
                let fechaPedido:any = Tools.parseStringDateTimeToDateTime(datos.fecha);
                let fechaEntrega:any = datos.fechaEntrega ? Tools.parseStringDateTimeToDateTime(datos.fechaEntrega) : new Date();
                //let diff = fechaEntrega - fechaPedido;
                var diff = Math.abs(fechaEntrega - fechaPedido);
                var diferencia = Math.floor((diff/1000)/60);
                enTiempo = diferencia > tiempoElaboracion ? false : true;
                enTiempo ? countATiempo++ : countConDemora++;
                return {codigo: datos.codigo, fechaPedido: datos.fecha, fechaEntrega: datos.fechaEntrega, tiempoElaboracion: tiempoElaboracion, 
                    estadoEntrega: enTiempo, diferencia: diferencia};
            })
            this.doughnutChartData.push(countConDemora, countATiempo);
            this.showGraphic = true;
            this.loading = false;
        })
    }
}