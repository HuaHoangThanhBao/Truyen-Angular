import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResourceService } from './resourceService.service';
import { BinhLuan } from '../model/binhluan/BinhLuan.model';


@Injectable({ providedIn: 'root' })
export class BinhLuanService extends ResourceService<BinhLuan> {
    constructor(protected httpClient: HttpClient) {
        super(httpClient);
    }

    getResourceUrl(): string {
        return 'binhluan';
    }
}