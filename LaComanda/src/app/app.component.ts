import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from './app.service';
import { RoutesHandler } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private route;
  private routerService;

  constructor(public appState: AppState,
    private routeService: RoutesHandler,
    private router: Router
    ) {
    this.routerService = this.routeService.getRouter();
    this.route = this.routeService.getRoute();
    }

  ngOnInit(){   
    


  }
}
