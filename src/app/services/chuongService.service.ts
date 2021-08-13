import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResourceService } from './resourceService.service';
import { Chuong } from '../model/chuong/Chuong.model';


@Injectable({ providedIn: 'root' })
export class ChuongService extends ResourceService<Chuong> {
    constructor(protected httpClient: HttpClient) {
        super(httpClient);
    }

    getResourceUrl(): string {
        return 'chuong';
    }
}