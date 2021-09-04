import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TwoStepVerificationComponent } from './two-step-verification/two-step-verification.component';
import { EmailConfirmationComponent } from './email-confirmation/email-confirmation.component';
import { GeneralModules } from '../../generalModules.module';

@NgModule({
  declarations: [RegisterComponent, LoginComponent, ForgotPasswordComponent, ResetPasswordComponent, TwoStepVerificationComponent, EmailConfirmationComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GeneralModules,
    RouterModule.forChild([
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'email-confirmation', component: EmailConfirmationComponent },
      { path: 'two-step-verification', component: TwoStepVerificationComponent }
    ])
  ],
  providers:[]
})
export class AuthenticationModule { }
