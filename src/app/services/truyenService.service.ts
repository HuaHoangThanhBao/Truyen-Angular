import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResourceService } from './resourceService.service';
import { Truyen } from '../model/truyen/Truyen.model';
import { RequestParam } from '../model/param/RequestParam.model';


@Injectable({ providedIn: 'root' })
export class TruyenService extends ResourceService<Truyen> {
    constructor(protected httpClient: HttpClient) {
        super(httpClient);
    }

    getResourceUrl(): string {
        return 'truyen';
    }

    async getPaginationHeaders(params: RequestParam) {
        let resultHeaders = await this.getListHeaders(params, 'X-Pagination');
        //console.log(resultHeaders);

        return JSON.parse(resultHeaders);
    }
}