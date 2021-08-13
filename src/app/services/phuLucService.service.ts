import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResourceService } from './resourceService.service';
import { PhuLuc } from '../model/phuluc/PhuLuc.model';


@Injectable({ providedIn: 'root' })
export class PhuLucService extends ResourceService<PhuLuc> {
    constructor(protected httpClient: HttpClient) {
        super(httpClient);
    }

    getResourceUrl(): string {
        return 'phuluc';
    }
}