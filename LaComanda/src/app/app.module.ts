import { ReporteTiempoEntregaComponent } from './components/reportes/subReportes/reporte-tiempo-entrega.component';
import { ReporteMesasUsosComponent } from './components/reportes/subReportes/reporte-mesas-usos.component';
import { CrudTableComponent } from './components/common/lists/crud-table.component';
import { ConfirmMessageComponent } from './components/common/messages/confirm-message.component';
import { MesasComponent } from './components/mesas/mesas.component';
import { HacerPedidoComponent } from './components/hacer-pedido/hacer-pedido.component';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule, ApplicationRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';


import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';
import { AppState, InternalStateType } from './app.service';
import { AppComponent } from './app.component';
import { RouterModule, PreloadAllModules } from '@angular/router';
import {
  MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule,
  MatExpansionModule, MatGridListModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressBarModule,
  MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSortModule,
  MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule, MatStepperModule, MatSnackBarModule, GestureConfig
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ROUTES } from './app.routes';
import { configs } from './globalConfigs';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};
import '../styles/styles.scss';
import '../styles/font.scss';
import '../styles/icons.scss';
import '../styles/controllsStyle.scss';
import '../styles/workspace.scss';
import { ChartsModule } from 'ng2-charts';


import { OrderByPipe } from './pipes/orderBy.pipe';
import { DatePipe } from './pipes/date.pipe';
import { RoutesHandler, AuthenticationService, BaseService, MessageHandler, ParamsService, MainGuard } from './services';

import { HomeComponent } from './components/home.component';
import { LoginComponent } from './components/login/login.component';
import { InputErrorHandlerComponent } from './components/common/error-handler/input-error-handler.component';
import { CircleLoaderComponent } from './components/common/loaders/circle-loader.component';
import { SuccessMessageComponent } from './components/common/messages/success-message.component';
import { ConfirmDialogMessageComponent } from './components/common/messages/confirm-dialog-message.component';
import { ContainerScrollBar } from './components/common/scrollbar/scrollbar.component';


import { RegisterComponent } from './components/login/register.component';
import { BebibasComponent } from './components/bebidas/bebidas.component';
import { ComidasComponent } from './components/comidas/comidas.component';
import { PostresComponent } from './components/postres/postres.component';
import { EmpleadosComponent } from './components/empleados/empleados.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { PedidosClienteComponent } from './components/pedidos-cliente/pedidos-cliente.component';
import { EncuestaClienteComponent } from './components/encuesta-cliente/encuesta-cliente.component';
import { CervezasComponent } from './components/cervezas/cervezas.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { ReporteEmpleadoSesionComponent } from './components/reportes/subReportes/reporte-empleado-sesion.component';
import { ReportesOperacionSectorComponent } from './components/reportes/subReportes/reporte-operaciones-sector.component';
import { ReporteOperacionesEmpleadosComponent } from './components/reportes/subReportes/reporte-operaciones-empleados.component';
import { ReporteProductosVendidosComponent } from './components/reportes/subReportes/reporte-productos-vendidos.component';
import { ReportesPedidosCanceladosComponent } from './components/reportes/subReportes/reporte-pedidos-cancelados.component';
import { ReporteMesasFacturacionComponent } from './components/reportes/subReportes/reporte-mesa-facturacion.component';
import { ReporteEncuestasComponent } from './components/reportes/subReportes/reporte-encuestas.component';

export const DateFormat = {
  parse: {
    dateInput: 'input',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'MM/DD/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    InputErrorHandlerComponent,
    CircleLoaderComponent,
    RegisterComponent,
    SuccessMessageComponent,
    BebibasComponent,
    ConfirmDialogMessageComponent,
    ContainerScrollBar,
    ComidasComponent,
    PostresComponent,
    EmpleadosComponent,
    HacerPedidoComponent,
    HacerPedidoComponent,
    OrderByPipe,
    DatePipe,
    MesasComponent,
    PedidosComponent,
    PedidosClienteComponent,
    EncuestaClienteComponent,
    CervezasComponent,
    ConfirmMessageComponent,
    ReportesComponent,
    ReporteEmpleadoSesionComponent,
    CrudTableComponent,
    ReportesOperacionSectorComponent,
    ReporteOperacionesEmpleadosComponent,
    ReporteProductosVendidosComponent,
    ReportesPedidosCanceladosComponent,
    ReporteMesasUsosComponent,
    ReporteMesasFacturacionComponent,
    ReporteEncuestasComponent,
    ReporteTiempoEntregaComponent
  ],
  imports: [
    BrowserModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    RouterModule.forRoot(ROUTES, {
      useHash: true,
      preloadingStrategy: PreloadAllModules,
      enableTracing: true  // <-- debugging purposes only
    }),
    AngularFireModule.initializeApp(configs.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
  ],
  providers: [
    AppState,
    RoutesHandler,
    AuthenticationService,
    BaseService,
    MessageHandler,
    ParamsService,
    MainGuard,
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DateFormat }

  ],
  entryComponents: [
    LoginComponent,
    RegisterComponent,
    SuccessMessageComponent,
    ConfirmMessageComponent,
    ConfirmDialogMessageComponent,
  ],
  exports: [
    ContainerScrollBar,
    OrderByPipe,
    DatePipe,
  ],

  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(
    public appRef: ApplicationRef,
    public appState: AppState
  ) { }

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    console.log('HMR store', JSON.stringify(store, null, 2));
    /**
     * Set state
     */
    this.appState._state = store.state;
    /**
     * Set input values
     */
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    /**
     * Save state
     */
    const state = this.appState._state;
    store.state = state;
    /**
     * Recreate root elements
     */
    store.disposeOldHosts = createNewHosts(cmpLocation);
    /**
     * Save input values
     */
    store.restoreInputValues = createInputTransfer();
    /**
     * Remove styles
     */
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    /**
     * Display new elements
     */
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
