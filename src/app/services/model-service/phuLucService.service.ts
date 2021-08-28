import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResourceService } from './resourceService.service';
import { PhuLuc } from '../../model/phuluc/PhuLuc.model';
import { ToastAlertService } from '../others/toast-alert-service.service';


@Injectable({ providedIn: 'root' })
export class PhuLucService extends ResourceService<PhuLuc> {
    constructor(protected httpClient: HttpClient, protected toastService: ToastAlertService) {
        super(httpClient, toastService);
    }

    getResourceUrl(): string {
        return 'phuluc';
    }
}