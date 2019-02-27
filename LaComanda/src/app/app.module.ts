import { MesasComponent } from './components/mesas/mesas.component';
import { HacerPedidoComponent } from './components/hacer-pedido/hacer-pedido.component';
import { BrowserModule, HAMMER_GESTURE_CONFIG  } from '@angular/platform-browser';
import { NgModule, ApplicationRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';
import { AppState, InternalStateType } from './app.service';
import { AppComponent } from './app.component';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule,
  MatExpansionModule,  MatGridListModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressBarModule,
  MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSortModule,
  MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule, MatStepperModule, MatSnackBarModule, GestureConfig } from '@angular/material';
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

import { OrderByPipe } from './pipes/orderBy.pipe';
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
    MesasComponent,
    PedidosComponent,
    PedidosClienteComponent,
    EncuestaClienteComponent,
    CervezasComponent
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
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig }
  ],
  entryComponents:[
    LoginComponent,
    RegisterComponent,
    SuccessMessageComponent,
    ConfirmDialogMessageComponent,
  ],
  exports:[    
    ContainerScrollBar,
    OrderByPipe,
  ],

  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(
    public appRef: ApplicationRef,
    public appState: AppState
  ) {}

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
    store.restoreInputValues  = createInputTransfer();
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
