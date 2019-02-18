import { FormControl, Validators, FormGroup } from '@angular/forms';

export class CustomValidators {

  public static getFormControl(){
    return new FormControl();
  }

  public static getRequiredField(value?, disabled?){
    return new FormControl({value: value ? value :'', disabled: disabled }, Validators.compose([
      Validators.required
    ]));
  }

  public static getSmallStringValidator(value?, disabled?){
    return new FormControl({value: value ? value :'', disabled: disabled }, Validators.compose([
      Validators.required,
      Validators.maxLength(20),
      Validators.minLength(2)
    ]));
  }

  public static getPassStringValidator(value?, disabled?){
    return new FormControl({value: value ? value :'', disabled: disabled }, Validators.compose([
      Validators.required,
      Validators.maxLength(8),
      Validators.minLength(4)
    ]));
  }

  //TODO BORRAR ESTO PORQUE YA ESTA EL OTRO QUE RECIBE EL INPUT POR PARAMETRO
  public static getSmallStringValidatorDisabled(){
    return new FormControl({value:'', disabled:true }, Validators.compose([
      Validators.required,
      Validators.maxLength(20),
      Validators.minLength(2)
    ]));
  }

  public static getLongStringValidator(value?, disabled?){
    return new FormControl({value: value ? value :'', disabled: disabled }, Validators.compose([
      Validators.required,
      Validators.maxLength(90),
      Validators.minLength(3)
    ]));
  }

  public static getDefaultDateValidator(value?, disabled?){
    return new FormControl({value: value ? value :'', disabled: disabled }, Validators.compose([
      Validators.required
    ]));
  }

  public static getRequiredEmailValidator(value?, disabled?){
    return new FormControl({value: value ? value :'', disabled: disabled }, Validators.compose([
      Validators.required,
      Validators.pattern('.+@{1}.+\\.{1}.+')
    ]));
  }

  public static getPositiveIntegerNumber(){
    return new FormControl({value: '', disabled:true}, Validators.compose([
      Validators.pattern('[0-9]+'),
      Validators.required
    ]));
  }

  public static getFloatNumber(){
    return new FormControl({value: '', disabled:true}, Validators.compose([
      Validators.pattern('[0-9]+.[0-9]+'),
      Validators.required
    ]));
  }

  public static getKPIValidator(){
    return new FormControl({value: ''}, Validators.compose([
      Validators.max(0.99),
      Validators.min(0.01),
      Validators.required,
      Validators.pattern('[0].[0-9]{1,2}')
    ]));
  }

  public static getSimpleFormGroupValidator(){
    return new FormGroup({
      'shortString': CustomValidators.getSmallStringValidator(),
    });
  }

  public static addValidator(formGroup:FormGroup, validatorType:string, fieldName, value?, disabled?){
    formGroup.addControl(fieldName, CustomValidators.formControlTypes[validatorType](value, disabled))
  }

  public static removeValidator(formGroup, validatorType, field){

  }

  public static enableDisableControls(formGroup, controlsArray, enable){
    /* TODO: investigar como funcionan los metodos enable y disable para mejorar esto */
    if(enable){
      controlsArray.forEach(control => { formGroup.controls[control].enable(true)});
    } else {
      controlsArray.forEach(control => { formGroup.controls[control].disable(true)});
    }
  }

  private static formControlTypes = {
    "shortString": CustomValidators.getSmallStringValidator,
    "longString": CustomValidators.getLongStringValidator,
    "defaultDate": CustomValidators.getDefaultDateValidator,
    "email": CustomValidators.getRequiredEmailValidator,
    "required": CustomValidators.getRequiredField
  };




}
