import { MainGuard } from './services/RoutesHandler.service';
import { BebibasComponent } from './components/bebidas/bebidas.component';
import { Diccionario } from './components/common/diccionario';
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home.component';


export const ROUTES: Routes = [
  {
    path: 'bebidas', component: BebibasComponent, pathMatch: 'full', canActivate: [MainGuard], canActivateChild: [MainGuard],
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
       { path: 'configuration/errors', component: ErrorsWorkspaceComponent, outlet:'smpt' },
       { path: 'configuration/unavailability-events', component: UnavailabilityEventWorkspace, outlet:'smpt' },
       { path: 'configuration/components', component: ComponentsWorkspaceComponent, outlet:'smpt' },
       { path: 'configuration/privilege-role', component: PrivilegeRolesWorkspaceComponent, outlet:'smpt' },
       { path: 'report', component: GraphicsReportsWorkspaceComponent, outlet:'smpt' },
       { path: 'export', component: ExportsWorkspaceComponent, outlet:'smpt' },
       { path: 'export/indicators', component: ExportsWorkspaceComponent, outlet:'smpt' },
       { path: 'export/backup', component: ExportsWorkspaceComponent, outlet:'smpt' },
       { path: 'export/alarms-notifications', component: ExportsWorkspaceComponent, outlet:'smpt' },
       { path: 'export/notifications', component: ExportsWorkspaceComponent, outlet:'smpt' },
       { path: 'help', component: HelpWorkspaceComponent, outlet:'smpt' },
       { path: '**',    component: NoContentComponent, outlet:'smpt' }
     ]
   },
   { path: '**', component: LoginViewComponent },
   */

];


