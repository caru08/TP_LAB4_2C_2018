import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup} from '@angular/forms';

@Component({
  selector: 'input-error-handler',
  templateUrl: 'input-error-handler.component.html',
  styleUrls:['./input-error-handler.component.scss'],
})

export class InputErrorHandlerComponent implements OnChanges {

  @Input('form-group-name') formGroup:FormGroup;
  @Input('select-collection') collection:any;
  @Input('error-message') errorMessage:string;

  constructor(){
  }

  ngOnChanges(changes: SimpleChanges) {

  }




}
