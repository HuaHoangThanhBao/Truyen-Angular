import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResourceService } from '../model-service/resourceService.service';
import { ToastAlertService } from '../others/toast-alert-service.service';
import { RefreshToken } from 'src/app/model/refresh-token/RefreshToken.model';


@Injectable({ providedIn: 'root' })
export class RefreshTokenService extends ResourceService<RefreshToken> {
    constructor(protected httpClient: HttpClient, protected toastService: ToastAlertService) {
        super(httpClient, toastService);
    }

    getResourceUrl(): string {
        return 'token';
    }
}