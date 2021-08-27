import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { TheLoai } from '../../model/theloai/TheLoai.model';
import { ResourceService } from './resourceService.service';
import { TacGia } from '../../model/tacGia/TacGia.model';


@Injectable({ providedIn: 'root' })
export class TacGiaService extends ResourceService<TacGia> {
    constructor(protected httpClient: HttpClient) {
        super(httpClient);
    }

    getResourceUrl(): string {
        return 'tacgia';
    }
}