import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { TheLoai } from '../../model/theloai/TheLoai.model';
import { ResourceService } from './resourceService.service';


@Injectable({ providedIn: 'root' })
export class TheLoaiService extends ResourceService<TheLoai> {
    constructor(protected httpClient: HttpClient) {
        super(httpClient);
    }

    getResourceUrl(): string {
        return 'theloai';
    }
}