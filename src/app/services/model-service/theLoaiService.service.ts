import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { TheLoai } from '../../model/theloai/TheLoai.model';
import { ResourceService } from './resourceService.service';
import { ToastAlertService } from '../others/toast-alert-service.service';


@Injectable({ providedIn: 'root' })
export class TheLoaiService extends ResourceService<TheLoai> {
    constructor(protected httpClient: HttpClient, protected toastService: ToastAlertService) {
        super(httpClient, toastService);
    }

    getResourceUrl(): string {
        return 'theloai';
    }
}