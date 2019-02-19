import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { CustomValidators } from "../common/validators";
import { Usuario } from './../../models/usuario';
import { configs } from 'src/app/globalConfigs';
import { AuthenticationService, ParamsService, MessageHandler, BaseService } from './../../services';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['register.component.scss'],
})

export class RegisterComponent implements OnInit {

    public formValidator:FormGroup;
    public model = { name:'', lastname: '', email: '', pass: '', secondpass: '', dni: ''};
    public loading:boolean;
    public errormessage = "";

    constructor( public dialogRef: MatDialogRef<RegisterComponent>,
        @Inject (MAT_DIALOG_DATA) public data: any,
        private autenticationService: AuthenticationService,
        private baseService: BaseService,
        private messageHandler: MessageHandler,
        private paramsService : ParamsService
    ){
    }

    ngOnInit(){
        this.setFormValidations();
    }

    cancelClick(){
        this.dialogRef.close();
    }

    saveClick(){
        if(this.formValidator.valid && !this.errormessage){
            this.loading = true;
            this.autenticationService.registerUserAndLogin(this.model.email, this.model.pass)
            .then(response => {
                let cliente = new Usuario(this.model.name, this.model.lastname, this.model.dni, false);
                cliente.uid = this.autenticationService.getUID();
                this.autenticationService.logInFromDataBase();
                this.baseService.addEntity(configs.apis.usuarios, cliente)
                .then(response =>{
                    this.loading = false;
                    this.paramsService.setUser(cliente);
                    this.messageHandler.showSucessMessage("Se registró correctamente");
                    this.cancelClick();
                }, error => {
                    this.autenticationService.deleteUserLogged()
                      .then(response => {
                          this.loading = false;
                        
                        this.messageHandler.showErrorMessage("Ocurrió un error al registrarse");
                        //CHEQUEAR ESTO CUANDO ES ALTA POR EMPLEADO
                
                      });
                  })
                
            })

        }
        

    }

    onfocusoutSecondPass(event){
        if(this.model.pass !== this.model.secondpass){
            this.errormessage = "Las contraseñas no coinciden"
        }else{
            this.errormessage = "";
        }
    }

    private setFormValidations(){
        this.formValidator = new FormGroup({
          'email': CustomValidators.getRequiredEmailValidator(),
          'pass': CustomValidators.getPassStringValidator(),
          'secondpass': CustomValidators.getPassStringValidator(),
          'name': CustomValidators.getSmallStringValidator(),
          'lastname': CustomValidators.getSmallStringValidator(),
          'dni': CustomValidators.getPositiveIntegerNumber(),
        });
      }
}