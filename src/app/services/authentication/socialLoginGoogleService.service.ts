import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResourceService } from '../model-service/resourceService.service';
import { ToastAlertService } from '../others/toast-alert-service.service';
import { ExternalAuthDto } from 'src/app/model/authentication/externalAuthDto.model';


@Injectable({ providedIn: 'root' })
export class SocialLoginGoogleService extends ResourceService<ExternalAuthDto> {
    constructor(protected httpClient: HttpClient, protected toastService: ToastAlertService) {
        super(httpClient, toastService);
    }

    getResourceUrl(): string {
        return 'auth/ExternalLogin';
    }
}