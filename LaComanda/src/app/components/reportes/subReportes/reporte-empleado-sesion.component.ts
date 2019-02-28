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
    selector: 'reporte-empleado-sesion',
    templateUrl: './reporte-empleado-sesion.component.html',
    styleUrls: ['sub-reportes.scss'],
})

export class ReporteEmpleadoSesionComponent implements OnInit, OnChanges {

    @Input('filtro-fecha-inicio') filtrofechainicio: any;
    @Input('filtro-fecha-fin') filtrofechaFin: any;
    @Input('filtro-rol') filtroRol: any;
    @Input('filtro-empleado') filtroEmpleado: any;
    public loading: boolean;
    public columns = new Array<TableColumn>();
    public tableDate = new Array<any>();
    public totalData = new Array<any>();
    public subscribeData: any;

    constructor(public dialog: MatDialog,
        private baseService: BaseService) {
    }

    ngOnInit() {
        this.setColumns(); 
    }

    ngOnChanges(changes: SimpleChanges) {
        debugger;
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

    private setColumns() {
        this.columns = new Array<TableColumn>();
        this.columns.push(new TableColumn('rol', 'Rol', false, 'start', 10, 25));
        this.columns.push(new TableColumn('usuarioEmail', 'Email Empleado', false, 'start', 30, 20));
        this.columns.push(new TableColumn('fechaInicio', 'Horario Inicio Sesión', false, 'start', 25, 20));
        this.columns.push(new TableColumn('fechaFin', 'Horario Fin Sesión', false, 'start', 25, 20));
    }

    private getData() {
        this.loading = true;
        if (this.filtroRol) {
            this.subscribeData = this.baseService.getListByProperty(configs.apis.logSesiones, 'rol', this.filtroRol)
        } else if (this.filtroEmpleado) {
            this.subscribeData = this.baseService.getListByProperty(configs.apis.logSesiones, 'usuarioEmail', this.filtroEmpleado)
        } else {
            this.subscribeData = this.baseService.getList(configs.apis.logSesiones)
        }
        this.subscribeData
            .subscribe(response => {
                this.totalData = response.map(log => {
                    let datos = log.payload.val();
                    return { rol: datos.rol, usuarioEmail: datos.usuarioEmail, fechaInicio: datos.fechaInicio, fechaFin: datos.fechaFin };
                })
                this.mapData();
                this.loading = false;
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
            if (Tools.sameDateString(fechaComparar, log.fechaInicio)) {
                return log;
            }
        })
    }

    private filtrarEntreDosFechas() {
        let fechaMinima = Tools.parseMomentDateToString(this.filtrofechainicio);
        let fechaMaxima = Tools.parseMomentDateToString(this.filtrofechaFin);
        this.tableDate = _.filter(this.totalData, (log: any) => {
            if (Tools.greaterThanDates(fechaMinima, log.fechaInicio) && Tools.smallThanDates(fechaMaxima, log.fechaInicio)) {
                return log;
            }
        })

    }

    private filtrarHastaUnaFecha() {
        let fechaMaxima = Tools.parseMomentDateToString(this.filtrofechaFin);
        this.tableDate = _.filter(this.totalData, (log: any) => {
            if (Tools.smallThanDates(fechaMaxima, log.fechaInicio)) {
                return log;
            }
        })
    }



}