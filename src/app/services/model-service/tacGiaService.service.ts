import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { TheLoai } from '../../model/theloai/TheLoai.model';
import { ResourceService } from './resourceService.service';
import { TacGia } from '../../model/tacGia/TacGia.model';
import { ToastAlertService } from '../others/toast-alert-service.service';


@Injectable({ providedIn: 'root' })
export class TacGiaService extends ResourceService<TacGia> {
    constructor(protected httpClient: HttpClient, protected toastService: ToastAlertService) {
        super(httpClient, toastService);
    }

    getResourceUrl(): string {
        return 'tacgia';
    }
}