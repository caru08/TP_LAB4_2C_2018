import { ConfirmDialogMessageComponent } from './../components/common/messages/confirm-dialog-message.component';
import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { SuccessMessageComponent } from '../components/common/messages/success-message.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Injectable()
export class MessageHandler {

    constructor(private snackBar: MatSnackBar,
        public dialog: MatDialog){}

    showSucessMessage(msg){
        let config = new MatSnackBarConfig();
        config.duration = 400000000;
        config.data = msg;
        config.panelClass = 'success-snack';
        this.snackBar.openFromComponent(SuccessMessageComponent, config);
    }

    showErrorMessage(msg){
        let config = new MatSnackBarConfig();
        config.duration = 4000;
        config.data = msg;
        config.panelClass = 'error-snack';
        this.snackBar.openFromComponent(SuccessMessageComponent, config);
    }

    public openConfirmDialog(message:string){
        let dialogRef = this.dialog.open(ConfirmDialogMessageComponent, {
          width: '300px',
          data: { message: message }
        });
        return dialogRef.afterClosed();
      }



}