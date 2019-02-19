import { Component, Input, Inject } from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material';

@Component({
  selector: 'error-message',
  templateUrl: 'error-message.component.html',
  styleUrls:['./message.component.scss'],
})

export class ErrorMessageComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { 
  }





}
