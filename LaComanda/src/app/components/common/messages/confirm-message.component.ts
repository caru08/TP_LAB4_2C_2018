import { Component, Input, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarRef } from '@angular/material';
import { ParamsService } from '../../../services/params.service';

@Component({
  selector: 'confirm-message',
  templateUrl: 'confirm-message.component.html',
  styleUrls: ['./message.component.scss'],
})

export class ConfirmMessageComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
    public dialogRef: MatSnackBarRef<ConfirmMessageComponent>,
    private paramsService: ParamsService) {
  }

  okbutton() {
    this.paramsService.accept = true;
    this.paramsService.cancel = false;
    this.dialogRef.dismiss();
  }

  cancel(){
    this.paramsService.accept = false;
    this.paramsService.cancel = true;
    this.dialogRef.dismiss();
  }





}
