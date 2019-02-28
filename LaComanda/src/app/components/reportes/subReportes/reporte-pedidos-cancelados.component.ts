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

@Component({
    selector: 'reporte-pedidos-cancelados',
    templateUrl: './reporte-pedidos-cancelados.component.html',
    styleUrls: ['sub-reportes.scss'],
})

export class ReportesPedidosCanceladosComponent implements OnInit, OnChanges {

    @Input('filtro-fecha-inicio') filtrofechainicio: any;
    @Input('filtro-fecha-fin') filtrofechaFin: any;
    @Input('filtro-rol') filtroRol: any;
    @Input('filtro-empleado') filtroEmpleado: any;
    public loading: boolean;
    public columns = new Array<TableColumn>();
    public tableDate = new Array<any>();
    public subscribeData: any;

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
        this.columns.push(new TableColumn('cliente', 'Cliente', false, 'start', 30, 20));
        this.columns.push(new TableColumn('fecha', 'Fecha', false, 'start', 25, 20));
        this.columns.push(new TableColumn('mesa', 'Codigo Mesa', false, 'start', 25, 20));
    }

    private getData(){
        this.baseService.getListByProperty(configs.apis.pedidos, 'estado', Diccionario.estadoPedidos.cancelado)
        .subscribe(response => {
            this.tableDate = response.map(pedido => {
                let datos:any = pedido.payload.val();
                return {codigo: datos.codigo, cliente: datos.cliente, fecha: datos.fecha, mesa: datos.mesa};
            })
        })
    }
}