import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResourceService } from './resourceService.service';
import { ToastAlertService } from '../others/toast-alert-service.service';
import { TruyenOnSearch } from '../../model/truyen/TruyenOnSearch.model';


@Injectable({ providedIn: 'root' })
export class TruyenOnSearchService extends ResourceService<TruyenOnSearch> {
    constructor(protected httpClient: HttpClient, protected toastService: ToastAlertService) {
        super(httpClient, toastService);
    }

    getResourceUrl(): string {
        return 'truyen';
    }
}