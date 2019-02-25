import { MessageHandler } from './../../services/messageHandler.service';
import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { CustomValidators } from "../common/validators";


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.scss'],
})

export class LoginComponent implements OnInit {

  public formValidator: FormGroup;
  public model = { email: '', pass: '' };
  public loading: boolean;

  constructor(public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authenticationService: AuthenticationService,
    private messageHandler: MessageHandler) {
  }

  ngOnInit() {
    this.setFormValidations();
  }

  cancelClick() {
    this.dialogRef.close();
  }

  saveClick() {
    this.loading = true;
    this.authenticationService.singIn(this.model.email, this.model.pass)
      .then(response => {
        this.authenticationService.setEmailPass(this.model.email, this.model.pass);
        this.loading = false;
        this.dialogRef.close();
      })
      .catch(error => {
        this.loading = false;
        console.log(error);
        this.messageHandler.showErrorMessage("Error al iniciar sesión. ", error);
      })

  }

  registerClick() {
    this.dialogRef.close("register");
  }

  private setFormValidations() {
    this.formValidator = new FormGroup({
      'email': CustomValidators.getRequiredEmailValidator(),
      'pass': CustomValidators.getPassStringValidator()
    });
  }
}