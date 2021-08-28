import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { ResourceService } from '../model-service/resourceService.service';
import { ToastAlertService } from '../others/toast-alert-service.service';
import { EmailConfirmationDto } from '../../model/authentication/emailConfirmationDto.model';
import { CustomEncoder } from '../others/custome-encoder';


@Injectable({ providedIn: 'root' })
export class EmailConfirmationService extends ResourceService<EmailConfirmationDto> {
    constructor(protected httpClient: HttpClient, protected toastService: ToastAlertService) {
        super(httpClient, toastService);
    }

    public confirmEmail = (token: string, email: string) => {
        let params = new HttpParams({ encoder: new CustomEncoder() })
        params = params.append('token', token);
        params = params.append('email', email);

        return this.customGetWithparams(params);
      }

    getResourceUrl(): string {
        return 'auth/RegistrationVerification';
    }
}