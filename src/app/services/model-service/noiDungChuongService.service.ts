import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResourceService } from './resourceService.service';
import { ToastAlertService } from '../others/toast-alert-service.service';
import { NoiDungChuong } from '../../model/noidungchuong/NoiDungChuong.model';


@Injectable({ providedIn: 'root' })
export class NoiDungChuongService extends ResourceService<NoiDungChuong> {
    constructor(protected httpClient: HttpClient, protected toastService: ToastAlertService) {
        super(httpClient, toastService);
    }

    getResourceUrl(): string {
        return 'noidungchuong';
    }
}