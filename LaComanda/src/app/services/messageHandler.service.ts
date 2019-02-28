import { ConfirmMessageComponent } from './../components/common/messages/confirm-message.component';
import { ConfirmDialogMessageComponent } from './../components/common/messages/confirm-dialog-message.component';
import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { SuccessMessageComponent } from '../components/common/messages/success-message.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Injectable()
export class MessageHandler {

    static knownErrors: any = [
        {
            code: 'auth/email-already-in-use',
            message: "El email ya existe"
        },
        {
            code: 'auth/user-not-found',
            message: "El email no se encuentra registrado"
        },
        {
            code: 'auth/wrong-password',
            message: "Contraseña Incorrecta"
        },
        {
            code: "auth/network-request-failed",
            message: "No hay conexión a internet"
        },
        {
            code: "auth/invalid-email",
            message: "Email inválido"
        },
    ];

    constructor(private snackBar: MatSnackBar,
        public dialog: MatDialog) { }

    showSucessMessage(msg) {
        let config = new MatSnackBarConfig();
        config.duration = 4000;
        config.data = msg;
        config.panelClass = 'success-snack';
        this.snackBar.openFromComponent(SuccessMessageComponent, config);
    }

    showErrorMessage(msg, error?) {
        var mensaje = "Error desconocido";
        if (error) {
            for (var i = 0; i < MessageHandler.knownErrors.length; i++) {
                if (error.code == MessageHandler.knownErrors[i].code) {
                    mensaje = MessageHandler.knownErrors[i].message;
                    break;
                }
            }
        }
        let config = new MatSnackBarConfig();
        config.duration = 4000;
        config.data = error ? msg + ' ' + mensaje : msg;
        config.panelClass = 'error-snack';
        this.snackBar.openFromComponent(SuccessMessageComponent, config);
    }

    public openConfirmDialog(message: string) {
        let config = new MatSnackBarConfig();
        config.data = message;
        config.panelClass = 'confirm-snack';
        let snackRef = this.snackBar.openFromComponent(ConfirmMessageComponent, config);
        return snackRef.afterDismissed();
    }



}