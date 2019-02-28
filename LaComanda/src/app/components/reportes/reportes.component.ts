import { BaseService } from './../../services/baseService.service';
import { MessageHandler } from './../../services/messageHandler.service';
import { ParamsService } from 'src/app/services';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Diccionario } from '../common/diccionario';
import { AuthenticationService } from './../../services/authentication.service';
import { configs } from 'src/app/globalConfigs';
import * as _ from 'lodash';

@Component({
    selector: 'reportes',
    templateUrl: './reportes.component.html',
    styleUrls: ['reportes.component.scss'],
})

export class ReportesComponent implements OnInit {

    public loading: boolean;
    public reporte = { subReportes: [] };
    public subReporte = { name: '' }
    public filtroFechaInicio: any;
    public filtroFechaFin: any;
    public filtroRol: any;
    public filtroEmpleado: any;
    public filtroTipoProducto: any;
    public filtroFactura: any;
    public mostrarReporte: boolean;
    public maxDate = new Date();
    public rolesList = new Array<any>();
    public tiposDeProductos = new Array<any>();
    public filtroFacturasList = new Array<any>();
    public empleadosList = new Array<any>();
    public empleadoSeleccionado: any;
    public reportesList = [
        {
            label: 'Reportes de Empleados',
            subReportes: [
                {
                    label: 'Días y horarios en que los empleados ingresaron al sistema',
                    name: 'logSesion',
                    filtroFecha: true,
                    filtroRol: true,
                    filtroEmpleados: true
                },
                {
                    label: 'Cantidad de operaciones por sector',
                    name: 'pedidosSector',
                    filtroFecha: true
                },
                {
                    label: 'Cantidad de operaciones de los empleado',
                    name: 'pedidosEmpleado',
                    filtroFecha: true,
                    filtroRol: true,
                    filtroEmpleados: true
                }
            ]
        },
        {
            label: 'Reportes de Pedidos',
            subReportes: [
                {
                    label: 'Productos más vendidos',
                    name: 'productosMasVendidos',
                    filtroTipoProducto: true,
                },
                {
                    label: 'Tiempo de entrega de pedidos',
                    name: 'pedidosEntrega',
                },
                {
                    label: 'Pedidos cancelados',
                    name: 'pedidosCancelados',
                }
            ]
        },
        {
            label: 'Reportes de Mesas',
            subReportes: [
                {
                    label: 'Mesas mas usadas',
                    name: 'mesasUsadas',
                },
                {
                    label: 'Mesas que más facturaron',
                    name: 'mesasMayorFactura',
                    filtroFacturas: 'filtroFacturas',
                    filtroFecha: true,
                }
            ]
        },
        {
            label: 'Reportes de Encuestas',
            subReportes: [
                {
                    label: 'Atención de Mozos',
                    name: 'encuestaMozos',
                    filtro: 'mozo'
                },
                {
                    label: 'Satisfacción de la comida',
                    name: 'encuestaComida',
                    filtro: 'comida'
                },
                {
                    label: 'Opiniones del Lugar',
                    name: 'encuestaRestaurante',
                    filtro: 'restaurante'
                },
                {
                    label: 'Opiniones de las mesas',
                    name: 'encuestaMesas',
                    filtro: 'mesa'
                }
            ]
        }
    ]

    constructor(private authenticationService: AuthenticationService,
        public dialog: MatDialog,
        private messageHandler: MessageHandler,
        private router: Router,
        private paramsService: ParamsService,
        private baseService: BaseService) {
        for (let key in Diccionario.roles) {
            if (key != Diccionario.roles.cliente && key != Diccionario.roles.administrador) {
                this.rolesList.push({ label: key, value: Diccionario.roles[key] });
            }
        }
        for (let key in Diccionario.tipoProductos) {
            this.tiposDeProductos.push({ label: key, value: Diccionario.tipoProductos[key] });
        }
        this.filtroFacturasList = [ 
            { 
                label: 'Con Mayor Factura',
                name: 'mayorFactura'
            }
        ]
    }

    ngOnInit() {
        this.loading = true;
        this.baseService.getList(configs.apis.usuarios).subscribe(response => {
            let lista = _.filter(response, item => {
                return item.payload.val().rol != Diccionario.roles.cliente && item.payload.val().rol != Diccionario.roles.administrador
            }).map(item => {
                let datos = item.payload.val();
                datos['key'] = item.key;
                return datos;
            });
            this.empleadosList = lista;
            this.loading = false;
        })

    }

    buscar() {
            this.mostrarReporte = true;        
    }

    tipoReporteChange() {
        this.mostrarReporte = false;
    }

    subReporteChange() {
        this.mostrarReporte = false;
        this.filtroEmpleado = '';
        this.filtroRol = '';
        this.empleadoSeleccionado = null;
        this.filtroFechaFin = '';
        this.filtroFechaInicio = '';
    }

    filtroRolChange() {
        this.filtroEmpleado = '';
        this.empleadoSeleccionado = '';
    }

    filtroEmpleadoChange() {
        this.filtroRol = '';
        if (this.subReporte.name == 'logSesion') {
            this.filtroEmpleado = this.empleadoSeleccionado.email;
        }
        if (this.subReporte.name == 'pedidosEmpleado') {
            this.filtroEmpleado = this.empleadoSeleccionado.uid;
        }
    }

    filtroTipoProductosChange(){

    }

    filtroTipoFacturacionChange(){
        this.mostrarReporte = false;
        this.filtroFechaInicio = '';
        this.filtroFechaFin = '';
    }

    changeFecha(){
        if(this.subReporte.name == 'mesasMayorFactura'){
            this.filtroFactura = ''
            this.mostrarReporte = false;
        }
    }

}