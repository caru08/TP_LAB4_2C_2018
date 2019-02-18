
import { AuthenticationService } from './../services/authentication.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { RoutesHandler } from "../services";
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['home.component.scss'],
})

export class HomeComponent implements OnInit {

  public loading:boolean;
  constructor(private authenticationService: AuthenticationService,
    public dialog: MatDialog){}

  ngOnInit(){
    if(this.authenticationService.isLogged()){

    }
  }

  loginClick(){
    let dialogRef = this.dialog.open(LoginComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      debugger;
      if(result == 'register'){
        this.openRegisterForm();
      }
    });
  }

  private openRegisterForm(){
    let dialogRef = this.dialog.open(RegisterComponent, {});
    dialogRef.afterClosed().subscribe(result => {
    });

  }

}

