import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ToastAlertService } from 'src/app/shared/services/toast-alert-service.service';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss']
})
export class EmailConfirmationComponent implements OnInit {
  public showSuccess: boolean;
  public showError: boolean;
  public errorMessage: string;

  constructor(private _authService: AuthenticationService, private _route: ActivatedRoute, private toast: ToastAlertService) { }

  ngOnInit(): void {
    this.confirmEmail();
  }

  private confirmEmail = () => {
    this.showError = this.showSuccess = false;

    const token = this._route.snapshot.queryParams['token'];
    const email = this._route.snapshot.queryParams['email'];

    this._authService.confirmEmail('auth/registrationverification', token, email)
    .subscribe(_ => {
      this.toast.showToast("Hoan hô!", "Tài khoản được kích hoạt thành công!", "success");
      this.showSuccess = true;
    },
    error => {
      this.showError = true;
      this.errorMessage = error;
      console.log(this.errorMessage)
    })
  }
}
