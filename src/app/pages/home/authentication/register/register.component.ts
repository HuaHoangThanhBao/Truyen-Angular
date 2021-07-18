import { Router } from '@angular/router';
import { PasswordConfirmationValidatorService } from '../../../../shared/services/password-confirmation-validator.service';
import { UserForRegistrationDto } from '../../../../model/userForRegistrationDto.model';
import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { ToastAlertService } from 'src/app/shared/services/toast-alert-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;
  public errorMessage: string = '';
  public showError: boolean;

  btnSubmitLocked: boolean = false;

  constructor(private _authService: AuthenticationService, private _passConfValidator: PasswordConfirmationValidatorService,
    private _router: Router, private toast: ToastAlertService) { }

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
    this.showError = false;
    const formValues = { ...registerFormValue };

    const user: UserForRegistrationDto = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      password: formValues.password,
      confirmPassword: formValues.confirm,
      clientURI: 'https://www.ranhdoctruyen.com/unimozy/authentication/email-confirmation'
    };

    this._authService.registerUser("auth/registration", user)
    .subscribe(_ => {
      this.toast.showToast("Xác thực", "Bạn hãy kiểm tra email của mình để đến bước tiếp theo nhé!", "info");
      this._router.navigate(["/authentication/login"]);
    },
    error => {
      this.errorMessage = error;
      this.showError = true;
      this.btnSubmitLocked = false;
      console.log(error)
      console.log(error.error.errorMessage)
    })
  }
}
