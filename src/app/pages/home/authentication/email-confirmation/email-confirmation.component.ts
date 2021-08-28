import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastAlertService } from 'src/app/services/others/toast-alert-service.service';
import { EmailConfirmationService } from '../../../../services/authentication/emailComfirmationService.service';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss']
})
export class EmailConfirmationComponent implements OnInit {
  public showSuccess: boolean;
  public showError: boolean;
  public errorMessage: string;

  constructor(private _route: ActivatedRoute, private toast: ToastAlertService,
    private emailConfirmationService: EmailConfirmationService) { }

  ngOnInit(): void {
    this.confirmEmail();
  }

  private confirmEmail = () => {
    this.showError = this.showSuccess = false;

    const token = this._route.snapshot.queryParams['token'];
    const email = this._route.snapshot.queryParams['email'];

    this.emailConfirmationService.confirmEmail(token, email)
    .subscribe(error => {
      if(!error){
        this.toast.showToast("Chúc mừng!", "Tài khoản được kích hoạt thành công!", "success");
        this.showSuccess = true;
      }
    })
  }
}
