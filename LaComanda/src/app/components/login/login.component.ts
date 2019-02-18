import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { FormGroup } from '@angular/forms';
import { CustomValidators } from "../common/validators";


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.scss'],
})

export class LoginComponent implements OnInit {

    public formValidator:FormGroup;
    public model = { email: '', pass: ''};
    public loading:boolean;

    constructor( public dialogRef: MatDialogRef<LoginComponent>,
        @Inject (MAT_DIALOG_DATA) public data: any  
    ){
    }

    ngOnInit(){
        this.setFormValidations();

    }

    cancelClick(){
        this.dialogRef.close();
    }

    saveClick(){

    }

    registerClick(){
        this.dialogRef.close("register");
    }

    private setFormValidations(){
        this.formValidator = new FormGroup({
          'email': CustomValidators.getRequiredEmailValidator(),
          'pass': CustomValidators.getPassStringValidator()
        });
      }
}