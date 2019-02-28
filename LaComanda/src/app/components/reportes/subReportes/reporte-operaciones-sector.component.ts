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
    selector: 'reporte-operacion-sector',
    templateUrl: './reporte-operaciones-sector.component.html',
    styleUrls: ['sub-reportes.scss'],
})

export class ReportesOperacionSectorComponent implements OnInit, OnChanges {

    @Input('filtro-fecha-inicio') filtrofechainicio: any;
    @Input('filtro-fecha-fin') filtrofechaFin: any;
    @Input('filtro-empleado') filtroEmpleado: any;
    public loading: boolean;
    public tableDate = new Array<any>();
    public totalData = new Array<any>();
    public subscribeData: any;

    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabels: string[] = ['Operaciones Mozos', 'Operaciones Socios', 'Operaciones Cocineros', 'Operaciones Cerveceros', 'Operaciones Bartenders'];
    public barChartType:string = 'bar';
    public barChartLegend:boolean = true;
    public barChartData:any[] = [ {data: [], label: 'Operaciones'} ];
    public showGraphic = false;

    constructor(private authenticationService: AuthenticationService,
        public dialog: MatDialog,
        private messageHandler: MessageHandler,
        private router: Router,
        private paramsService: ParamsService,
        private baseService: BaseService) {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['filtrofechainicio'] && changes['filtrofechainicio'].currentValue) {
            if (this.totalData.length) {
                this.mapData();
            } else {
                this.getData()
            }
            return;
        }
        if (changes['filtrofechaFin'] && changes['filtrofechaFin'].currentValue) {
            if (this.totalData.length) {
                this.mapData();
            } else {
                this.getData()
            }
            return;
        }
        if (changes['filtroRol'] && changes['filtroRol'].currentValue) {
            this.getData()
            return;
        }
        if (changes['filtroEmpleado'] && changes['filtroEmpleado'].currentValue) {
            this.getData()
            return;
        }
        this.getData();
    }

    private getData() {
        this.loading = true;
        this.subscribeData = this.baseService.getListByProperty(configs.apis.pedidos, 'estado', Diccionario.estadoPedidos.cerrado)
        this.subscribeData
            .subscribe(response => {
                this.totalData = response.map(item =>{
                    let datos: any = item.payload.val();
                    return datos;
                })
                this.mapData();                
            })
    }

    mapData() {
        if (this.filtrofechainicio && !this.filtrofechaFin) {
            this.filtrarIgualAFecha();
        } else if (this.filtrofechainicio && this.filtrofechaFin) {
            this.filtrarEntreDosFechas();
        } else if (!this.filtrofechainicio && this.filtrofechaFin) {
            this.filtrarHastaUnaFecha();
        } else {
            this.tableDate = this.totalData;
        }
        this.getGraphicData();
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

    private getGraphicData(){
        var mozoCount = this.tableDate.length;
        var socioCount = this.tableDate.length;
        var cocineroCount = 0;
        var cerveceroCount = 0;
        var bartenderCount = 0
        this.tableDate.forEach(datos => {           
            datos.productos.forEach(producto => {
                if (producto.tipo == Diccionario.tipoProductos.bebida) {
                    bartenderCount++;
                } else if (producto.tipo == Diccionario.tipoProductos.comida || producto.tipo == Diccionario.tipoProductos.postre) {
                    cocineroCount++;
                } else if (producto.tipo == Diccionario.tipoProductos.cerveza) {
                    cerveceroCount++;
                }
            });
        });
        this.barChartData = [
            {data: [mozoCount, socioCount, cocineroCount, cerveceroCount, bartenderCount], label: 'Operaciones'}                    
          ];
        //this.barChartData[0].data = [ mozoCount, socioCount, cocineroCount, cerveceroCount, bartenderCount];
        this.showGraphic = true,
        /* this.totalData = response.map(pedido => {
              let datos: any = pedido.payload.val()
              return new Pedido(pedido.key, datos.mesa, datos.estado, datos.productos, datos.mozo, datos.codigo, datos.fecha, datos.foto, datos.cliente, datos.fechaEntrega);
          })
          this.mapData(); */
        this.loading = false;
    }



}