import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResourceService } from '../model-service/resourceService.service';
import { ToastAlertService } from '../others/toast-alert-service.service';
import { UserForLoginDto } from '../../model/authentication/userForLoginDto.model';


@Injectable({ providedIn: 'root' })
export class UserForLoginService extends ResourceService<UserForLoginDto> {
    constructor(protected httpClient: HttpClient, protected toastService: ToastAlertService) {
        super(httpClient, toastService);
    }

    getResourceUrl(): string {
        return 'auth/login';
    }
}