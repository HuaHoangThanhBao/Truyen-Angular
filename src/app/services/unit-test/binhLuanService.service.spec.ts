import { TestBed } from "@angular/core/testing";
import { GeneralModules } from "src/app/pages/generalModules.module";
import { BinhLuanService } from '../model-service/binhLuanService.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastAlertService } from '../others/toast-alert-service.service';

describe('BinhLuanService', () => {
    let service: BinhLuanService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [GeneralModules, HttpClientModule],
            providers: [BinhLuanService, ToastAlertService]
        })
        service = TestBed.inject(BinhLuanService);
    });

    it('should get resouce url', ()=>{
        expect(service.getResourceUrl()).toEqual('binhluan');
    })
})