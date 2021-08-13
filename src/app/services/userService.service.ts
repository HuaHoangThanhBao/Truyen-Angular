import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResourceService } from './resourceService.service';
import { User } from '../model/user/User.model';


@Injectable({ providedIn: 'root' })
export class UserService extends ResourceService<User> {
    constructor(protected httpClient: HttpClient) {
        super(httpClient);
    }

    getResourceUrl(): string {
        return 'user';
    }
}