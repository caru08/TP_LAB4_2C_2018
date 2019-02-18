import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { SuccessMessageComponent } from '../components/common/messages/success-message.component';

@Injectable()
export class MessageHandler {

    constructor(private snackBar: MatSnackBar){}

    showSucessMessage(msg){
        this.snackBar.open(msg, '', {duration: 4000});
    }

    showErrorMessage(msg){
        let config = new MatSnackBarConfig();
        config.duration = 4000;
        config.data = msg;
        this.snackBar.openFromComponent(SuccessMessageComponent, config);

    }



}