import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResourceService } from '../model-service/resourceService.service';
import { ToastAlertService } from '../others/toast-alert-service.service';
import { TwoFactorDto } from '../../model/authentication/twoFactorDto.model';
import { UpdatePasswordDto } from '../../model/authentication/updatePasswordDto.model';


@Injectable({ providedIn: 'root' })
export class UpdatePasswordService extends ResourceService<UpdatePasswordDto> {
    constructor(protected httpClient: HttpClient, protected toastService: ToastAlertService) {
        super(httpClient, toastService);
    }

    getResourceUrl(): string {
        return 'auth/UpdatePassword';
    }
}