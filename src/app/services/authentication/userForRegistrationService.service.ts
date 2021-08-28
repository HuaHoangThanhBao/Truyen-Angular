import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResourceService } from '../model-service/resourceService.service';
import { ToastAlertService } from '../others/toast-alert-service.service';
import { UserForRegistrationDto } from 'src/app/model/authentication/userForRegistrationDto.model';


@Injectable({ providedIn: 'root' })
export class UserForRegistrationService extends ResourceService<UserForRegistrationDto> {
    constructor(protected httpClient: HttpClient, protected toastService: ToastAlertService) {
        super(httpClient, toastService);
    }

    getResourceUrl(): string {
        return 'auth/registration';
    }
}