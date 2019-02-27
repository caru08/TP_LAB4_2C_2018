import { PedidosClienteComponent } from './components/pedidos-cliente/pedidos-cliente.component';
import { MesasComponent } from './components/mesas/mesas.component';
import { ComidasComponent } from './components/comidas/comidas.component';
import { MainGuard } from './services/RoutesHandler.service';
import { BebibasComponent } from './components/bebidas/bebidas.component';
import { Routes } from '@angular/router';
import { PostresComponent } from './components/postres/postres.component';
import { EmpleadosComponent } from './components/empleados/empleados.component';
import { HacerPedidoComponent } from './components/hacer-pedido/hacer-pedido.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { CervezasComponent } from './components/cervezas/cervezas.component';

export const ROUTES: Routes = [
  {
    path: 'bebidas', component: BebibasComponent, pathMatch: 'full', canActivate: [MainGuard], canActivateChild: [MainGuard],
  },
  {
    path: 'comidas', component: ComidasComponent, pathMatch: 'full', canActivate: [MainGuard], canActivateChild: [MainGuard],
  },
  {
    path: 'postres', component: PostresComponent, pathMatch: 'full', canActivate: [MainGuard], canActivateChild: [MainGuard],
  },
  {
    path: 'cervezas', component: CervezasComponent, pathMatch: 'full', canActivate: [MainGuard], canActivateChild: [MainGuard],
  },
  {
    path: 'empleados', component: EmpleadosComponent, pathMatch: 'full', canActivate: [MainGuard], canActivateChild: [MainGuard],
  },
  {
    path: 'hacer-pedido', component: HacerPedidoComponent, pathMatch: 'full', canActivate: [MainGuard], canActivateChild: [MainGuard],
  },
  {
    path: 'mesas', component: MesasComponent, pathMatch: 'full', canActivate: [MainGuard], canActivateChild: [MainGuard],
  },
  {
    path: 'pedidos', component: PedidosComponent, pathMatch: 'full', canActivate: [MainGuard], canActivateChild: [MainGuard],
  },
  {
    path: 'mis-pedidos', component: PedidosClienteComponent, pathMatch: 'full', canActivate: [MainGuard], canActivateChild: [MainGuard],
  },
  
  

  /* { path: 'login', component: LoginViewComponent },
   { path: 'main', component: UIViewComponent, canActivate: [MainGuard], canActivateChild: [MainGuard],
     children:[
       { path: 'configuration', component: NoContentComponent, outlet:'smpt' },
       { path: 'configuration/indicators', component: IndicatorsWorkspaceComponent, outlet:'smpt' },
       { path: 'configuration/reports', component: AutomaticReportWorkspaceComponent, outlet:'smpt' },
       { path: 'configuration/backup', component: BackupWorkspaceComponent, outlet:'smpt' },
       { path: 'configuration/alarms', component: AlarmWorkspaceComponent, outlet:'smpt' },
       { path: 'configuration/notifications', component: NotificationsErrorsWorkspaceComponent, outlet:'smpt' },
     ]
   },
   { path: '**', component: LoginViewComponent },
   */

];


