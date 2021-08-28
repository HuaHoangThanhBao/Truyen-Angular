import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResourceService } from './resourceService.service';
import { User } from '../../model/user/User.model';
import { ToastAlertService } from '../others/toast-alert-service.service';


@Injectable({ providedIn: 'root' })
export class UserService extends ResourceService<User> {
    constructor(protected httpClient: HttpClient, protected toastService: ToastAlertService) {
        super(httpClient, toastService);
    }

    getResourceUrl(): string {
        return 'user';
    }
}