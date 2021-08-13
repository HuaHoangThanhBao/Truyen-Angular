import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResourceService } from './resourceService.service';
import { TheoDoi } from '../model/theodoi/TheoDoi.model';
import { RequestParam } from '../model/param/RequestParam.model';


@Injectable({ providedIn: 'root' })
export class TheoDoiService extends ResourceService<TheoDoi> {
    constructor(protected httpClient: HttpClient) {
        super(httpClient);
    }

    getResourceUrl(): string {
        return 'theodoi';
    }
    
    async getPaginationHeaders(params: RequestParam) {
        let resultHeaders = await this.getListHeaders(params, 'X-Pagination');
        //console.log(resultHeaders);

        return JSON.parse(resultHeaders);
    }
}