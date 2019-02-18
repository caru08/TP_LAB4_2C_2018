import { Component, Input, Inject } from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material';

@Component({
  selector: 'success-message',
  templateUrl: 'success-message.component.html',
  styleUrls:['./message.component.scss'],
})

export class SuccessMessageComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { 
      debugger;
  }





}
