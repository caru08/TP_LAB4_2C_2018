//reporte-mesa-facturacion.component
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
    selector: 'reporte-mesa-facturacion',
    templateUrl: './reporte-mesa-facturacion.component.html',
    styleUrls: ['sub-reportes.scss'],
})

export class ReporteMesasFacturacionComponent implements OnInit, OnChanges {

    @Input('filtro-factura') filtroFactura: string;
    @Input('filtro-fecha-inicio') filtrofechainicio: any;
    @Input('filtro-fecha-fin') filtrofechaFin: any;
    public loading: boolean;
    public showGraphic = false;
    public doughnutChartLabels: string[] = [];
    public doughnutChartData: number[] = [];
    public doughnutChartType: string = 'doughnut';
    public totalData = new Array<any>();
    public tableDate = new Array<any>();
    public contador: any;


    constructor(public dialog: MatDialog,
        private baseService: BaseService) {
    }

    ngOnInit() {
        // this.getData();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['filtroFactura'] && changes['filtroFactura'].currentValue) {
            if (this.totalData.length) {
                this.mapData();
                return;
            } else {
                this.getData()
                return;
            }
        }
        if (changes['filtrofechainicio'] && changes['filtrofechainicio'].currentValue) {
            if (this.totalData.length) {
                this.mapData();
                return;
            } else {
                this.getData()
                return;
            }
        }
        if (changes['filtrofechaFin'] && changes['filtrofechaFin'].currentValue) {
            if (this.totalData.length) {
                this.mapData();
                return;
            } else {
                this.getData()
                return;
            }
        }
        this.getData();
    }

    getData() {
        this.loading = true;
        this.baseService.getList(configs.apis.mesas)
            .subscribe(mesasResponse => {
                this.baseService.getListByProperty(configs.apis.pedidos, 'estado', Diccionario.estadoPedidos.cerrado)
                    .subscribe(pedidosResponse => {
                        this.contador = {}
                        this.doughnutChartLabels = new Array<string>();
                        this.doughnutChartData = new Array<number>();

                        mesasResponse.forEach(mesa => {
                            let datos = mesa.payload.val();
                            this.doughnutChartLabels.push(datos.nombre + ' - ' + datos.codigo);
                            this.contador[datos.codigo] = 0;
                        })
                        pedidosResponse.forEach(pedido => {
                            let datos: any = pedido.payload.val();
                            let total = 0;
                            datos.productos.forEach(producto => {
                                total += producto.precio;
                            });
                            datos['total'] = total;
                            this.totalData.push(datos);
                        })
                        this.mapData();
                        this.loading = false;;
                    })

            })
    }

    mapData() {
        if (this.filtroFactura) {
            this.clearContador();
            switch (this.filtroFactura) {
                case 'mayorFactura':
                    this.totalData.forEach(pedido => {
                        if (this.contador[pedido.mesa] < pedido.total) {
                            this.contador[pedido.mesa] = pedido.total;
                        }
                    })
                    break;
            }
        }else if(this.filtrofechaFin || this.filtrofechainicio){
            this.clearContador();
            if (this.filtrofechainicio && !this.filtrofechaFin) {
                this.filtrarIgualAFecha();
            } else if (this.filtrofechainicio && this.filtrofechaFin) {
                this.filtrarEntreDosFechas();
            } else if (!this.filtrofechainicio && this.filtrofechaFin) {
                this.filtrarHastaUnaFecha();
            } 
            this.tableDate.forEach(pedido => {                
                    this.contador[pedido.mesa] += pedido.total;                
            })
        } else {
            this.totalData.forEach(pedido => {
                this.contador[pedido.mesa] += pedido.total;
            })
        }
        for (let key in this.contador) {
            this.doughnutChartData.push(this.contador[key])
        }
        this.showGraphic = true;
    }

    private clearContador() {
        for (let key in this.contador) {
            this.contador[key] = 0;
        }
    }

    private filtrarIgualAFecha() {
        let fechaComparar = Tools.parseMomentDateToString(this.filtrofechainicio);
        this.tableDate = _.filter(this.totalData, (pedido: any) => {
            if (Tools.sameDateString(fechaComparar, pedido.fecha)) {
                return pedido;
            }
        })
    }

    private filtrarEntreDosFechas() {
        let fechaMinima = Tools.parseMomentDateToString(this.filtrofechainicio);
        let fechaMaxima = Tools.parseMomentDateToString(this.filtrofechaFin);
        this.tableDate = _.filter(this.totalData, (pedido: any) => {
            if (Tools.greaterThanDates(fechaMinima, pedido.fecha) && Tools.smallThanDates(fechaMaxima, pedido.fecha)) {
                return pedido;
            }
        })
    }

    private filtrarHastaUnaFecha() {
        let fechaMaxima = Tools.parseMomentDateToString(this.filtrofechaFin);
        this.tableDate = _.filter(this.totalData, (pedido: any) => {
            if (Tools.smallThanDates(fechaMaxima, pedido.fecha)) {
                return pedido;
            }
        })
    }
}