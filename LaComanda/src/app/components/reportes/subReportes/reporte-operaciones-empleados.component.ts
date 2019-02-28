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
import { EmptyError } from 'rxjs';

@Component({
    selector: 'reporte-operaciones-empleados',
    templateUrl: './reporte-operaciones-empleados.component.html',
    styleUrls: ['sub-reportes.scss'],
})

export class ReporteOperacionesEmpleadosComponent implements OnInit, OnChanges {

    @Input('filtro-fecha-inicio') filtrofechainicio: any;
    @Input('filtro-fecha-fin') filtrofechaFin: any;
    @Input('filtro-rol') filtroRol: any;
    @Input('filtro-empleado') filtroEmpleado: any;
    public loading: boolean;
    public columns = new Array<TableColumn>();
    public tableDate = new Array<any>();
    public totalData = new Array<any>();
    public subscribeData: any;
    public listaEmpleados: any;

    constructor(private authenticationService: AuthenticationService,
        public dialog: MatDialog,
        private messageHandler: MessageHandler,
        private router: Router,
        private paramsService: ParamsService,
        private baseService: BaseService) {
    }

    ngOnInit() {
        this.setColumns();
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

    getNombreEmpleado(element) {
        let empleado = _.find(this.listaEmpleados, empleado => {
            return element.empleado == empleado.uid;
        })
        return empleado ? empleado.nombre + ' ' + empleado.apellido : '';
    }

    private setColumns() {
        this.columns = new Array<TableColumn>();
        this.columns.push(new TableColumn('rol', 'Rol', false, 'start', 10, 25));
        this.columns.push(new TableColumn('nombreEmpleado', 'Empleado', false, 'start', 20, 20));
        this.columns.push(new TableColumn('fechaPedido', 'Fecha del Pedido', false, 'start', 15, 20));
        this.columns.push(new TableColumn('fechaEntregado', 'Fecha de Entrega', false, 'start', 15, 20));
        this.columns.push(new TableColumn('tiempoDefinido', 'Tiempo Definido (minutos)', false, 'start', 10, 20));
        this.columns.push(new TableColumn('tiempoEstimado', 'Tiempo Estimado (minutos)', false, 'start', 10, 20));
        this.columns.push(new TableColumn('producto', 'Producto pedido', false, 'start', 15, 20));
    }

    private getData() {
        this.baseService.getList(configs.apis.usuarios).subscribe(response => {
            let lista = _.filter(response, item => {
                return item.payload.val().rol != Diccionario.roles.cliente && item.payload.val().rol != Diccionario.roles.administrador
            }).map(item => {
                let datos = item.payload.val();
                datos['key'] = item.key;
                return datos;
            });
            this.listaEmpleados = lista;
            this.subscribeData = this.baseService.getListByProperty(configs.apis.pedidos, 'estado', Diccionario.estadoPedidos.cerrado)
                .subscribe(response => {
                    this.totalData = new Array<any>();
                    let dataSinFiltro = new Array<any>();
                    response.forEach(pedido => {
                        let datosPedido: any = pedido.payload.val();
                        dataSinFiltro.push({ rol: Diccionario.roles.mozo, empleado: datosPedido.mozo, fecha: datosPedido.fecha, 
                            fechaEntregado: datosPedido.fechaEntrega, producto: '' });
                        datosPedido.productos.forEach(producto => {
                            let rol = producto.tipo == Diccionario.tipoProductos.bebida ? Diccionario.roles.bartener :
                                producto.tipo == Diccionario.tipoProductos.cerveza ? Diccionario.roles.cervezero :
                                    Diccionario.roles.cocinero;
                            dataSinFiltro.push({ rol: rol, empleado: producto.empleado, fecha: datosPedido.fecha,
                                fechaEntregado: datosPedido.fechaEntrega, tiempoDefinido: producto.tiempoElaboracion, tiempoEstimado: producto.tiempoEmpleado, producto: producto.nombre });
                        });
                    })
                    if (this.filtroRol) {
                        this.totalData = _.filter(dataSinFiltro, row =>{
                            return row.rol == this.filtroRol;
                        })
                    }else if(this.filtroEmpleado){
                        this.totalData = _.filter(dataSinFiltro, row =>{
                            return row.empleado == this.filtroEmpleado;
                        })
                    }else{
                        this.totalData = dataSinFiltro;
                    }

                    this.mapData();
                    this.loading = false;
                })
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
    }

    private filtrarIgualAFecha() {
        let fechaComparar = Tools.parseMomentDateToString(this.filtrofechainicio);
        this.tableDate = _.filter(this.totalData, (log: any) => {
            if (Tools.sameDateString(fechaComparar, log.fecha)) {
                return log;
            }
        })
    }

    private filtrarEntreDosFechas() {
        let fechaMinima = Tools.parseMomentDateToString(this.filtrofechainicio);
        let fechaMaxima = Tools.parseMomentDateToString(this.filtrofechaFin);
        this.tableDate = _.filter(this.totalData, (log: any) => {
            if (Tools.greaterThanDates(fechaMinima, log.fecha) && Tools.smallThanDates(fechaMaxima, log.fecha)) {
                return log;
            }
        })

    }

    private filtrarHastaUnaFecha() {
        let fechaMaxima = Tools.parseMomentDateToString(this.filtrofechaFin);
        this.tableDate = _.filter(this.totalData, (log: any) => {
            if (Tools.smallThanDates(fechaMaxima, log.fecha)) {
                return log;
            }
        })
    }

}