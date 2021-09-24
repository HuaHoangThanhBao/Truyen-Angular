import { Router } from '@angular/router';
import { PasswordConfirmationValidatorService } from '../../../../services/others/password-confirmation-validator.service';
import { UserForRegistrationDto } from '../../../../model/authentication/userForRegistrationDto.model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { ToastAlertService } from 'src/app/services/others/toast-alert-service.service';
import { UserForRegistrationService } from '../../../../services/authentication/userForRegistrationService.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;
  public errorMessage: string = '';

  btnSubmitLocked: boolean = false;

  constructor(private _passConfValidator: PasswordConfirmationValidatorService, private _router: Router, 
    private toast: ToastAlertService, private userForRegistrationService: UserForRegistrationService) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirm: new FormControl('')
    });
    this.registerForm.get('confirm').setValidators([Validators.required,
      this._passConfValidator.validateConfirmPassword(this.registerForm.get('password'))]);
  }


  public validateControl = (controlName: string) => {
    return this.registerForm.controls[controlName].invalid && this.registerForm.controls[controlName].touched
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.registerForm.controls[controlName].hasError(errorName)
  }

  public registerUser = (registerFormValue) => {
    this.btnSubmitLocked = true;
    const formValues = { ...registerFormValue };

    const user: UserForRegistrationDto = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      password: formValues.password,
      quyen: 0,
      confirmPassword: formValues.confirm,
      clientURI: `${environment.host}/authentication/email-confirmation`
    };

    this.userForRegistrationService.post(user)
    .subscribe(res => {
      if (!res?.error) {
        this.toast.showToast("Xác thực", "Bạn hãy kiểm tra email của mình để đến bước tiếp theo nhé!", "info");
        this._router.navigate(["authentication/login"])
      }
      else{
        this.btnSubmitLocked = false;
      }
    })
  }
}
