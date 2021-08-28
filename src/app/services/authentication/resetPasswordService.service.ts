import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResourceService } from '../model-service/resourceService.service';
import { ToastAlertService } from '../others/toast-alert-service.service';
import { ResetPasswordDto } from '../../model/authentication/resetPasswordDto.model';


@Injectable({ providedIn: 'root' })
export class ResetPasswordService extends ResourceService<ResetPasswordDto> {
    constructor(protected httpClient: HttpClient, protected toastService: ToastAlertService) {
        super(httpClient, toastService);
    }

    getResourceUrl(): string {
        return 'auth/ResetPassword';
    }
}