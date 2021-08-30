import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResourceService } from '../model-service/resourceService.service';
import { ToastAlertService } from '../others/toast-alert-service.service';
import { AdminForRegistrationDto } from '../../model/authentication/adminForRegistrationDto.model';


@Injectable({ providedIn: 'root' })
export class AdminForRegistrationService extends ResourceService<AdminForRegistrationDto> {
    constructor(protected httpClient: HttpClient, protected toastService: ToastAlertService) {
        super(httpClient, toastService);
    }

    getResourceUrl(): string {
        return 'auth/admin-registration';
    }
}