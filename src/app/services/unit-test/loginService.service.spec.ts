import { TestBed } from "@angular/core/testing";
import { LoginService } from '../others/login-service.service';
import { GeneralModules } from '../../pages/generalModules.module';

describe('LoginService', () => {
    let service: LoginService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [GeneralModules],
            providers: [LoginService]
        })
        service = TestBed.inject(LoginService);
    });

    it('should set new ID', () => {
        expect(service.setNewID('123456')).toEqual('123456');
    })
})