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
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [RegisterComponent, LoginComponent, ForgotPasswordComponent, ResetPasswordComponent, TwoStepVerificationComponent, EmailConfirmationComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SocialLoginModule,//Thêm ngày 01/09/2021
    RouterModule.forChild([
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'email-confirmation', component: EmailConfirmationComponent },
      { path: 'two-step-verification', component: TwoStepVerificationComponent }
    ])
  ],
  //Thêm ngày 01/09/2021
  providers:[
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.clientId)
          },
        ],
      } as SocialAuthServiceConfig
    }
  ]
})
export class AuthenticationModule { }
