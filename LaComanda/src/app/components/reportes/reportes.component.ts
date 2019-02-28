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
    public mostrarReporte: boolean;
    public maxDate = new Date();
    public rolesList = new Array<any>();
    public empleadosList = new Array<any>();
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
                    filtroFecha: true,
                    filtroEmpleado: true
                },
                {
                    label: 'Centidad de operaciones por empleado',
                    name: 'pedidosEmpleado'
                }
            ]
        },
        {
            label: 'Reportes de Pedidos',
            subReportes: [
                {
                    label: 'Productos más vendidos',
                    name: 'productosVendidos',
                },
                {
                    label: 'Productos menos vendido',
                    name: 'productosVendidos',
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
                    label: 'Mesas menos usadas',
                    name: 'mesasNoUsadas',
                },
                {
                    label: 'Mesas que más facturaron',
                    name: 'mesasMayorFactura',
                },
                {
                    label: 'Mesas que menos facturaron',
                    name: 'mesasMenorFactura',
                }
            ]
        },
        {
            label: 'Reportes de Encuestas',
            subReportes: [
                {
                    label: 'Atención de Mozos',
                    name: 'encuestaMozos',
                },
                {
                    label: 'Satisfacción de la comida',
                    name: 'encuestaComida',
                },
                {
                    label: 'Opiniones del Lugar',
                    name: 'encuestaRestaurante',
                },
                {
                    label: 'Opiniones de las mesas',
                    name: 'encuestaMesas'
                },
                {
                    label: 'Comentarios',
                    name: 'encuestaComentarios',
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
    }

    filtroRolChange(){
        this.filtroEmpleado = '';
    }

    filtroEmpleadoChange(){
        this.filtroRol = '';
    }

}