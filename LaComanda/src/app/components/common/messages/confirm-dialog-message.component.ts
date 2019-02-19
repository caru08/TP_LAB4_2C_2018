import { Component, Input, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'confirm-message',
  templateUrl: 'confirm-dialog-message.component.html',
  styleUrls:['./dialog-message.component.scss'],
})

export class ConfirmDialogMessageComponent {

  public message:string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.message = data.message ? data.message : "MESSAGES.CONFIRM_ACTION";
  }

  accept(){
    this.dialogRef.close(true);
  }

  cancel(){
    this.dialogRef.close(false);
  }

}
