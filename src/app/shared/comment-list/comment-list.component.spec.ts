import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CommentListComponent } from './comment-list.component';
import { ToastAlertService } from '../../services/others/toast-alert-service.service';
import { LoginService } from '../../services/others/login-service.service';
import { BinhLuanService } from '../../services/model-service/binhLuanService.service';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component } from "@angular/core";
import { By } from "@angular/platform-browser";

// @Component({
//     template: `  
//     <form [formGroup]="formGroup" autocomplete="off" novalidate>
//       <input name="noidung" type="text" formControlName="noidung"/>
//     </form>
//     `
// })
// class FormControlCompenentSpy {
//     formGroup: FormGroup
// }

describe('CommentListComponent', () => {
    let component: CommentListComponent;
    let fixture: ComponentFixture<CommentListComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                CommentListComponent,
            ],
            imports: [
                RouterTestingModule,
                HttpClientModule,
            ],
            providers: [ToastAlertService, LoginService, BinhLuanService]
        }).compileComponents();
    });
    beforeEach(() => {
        fixture = TestBed.createComponent(CommentListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create component', () => {
        expect(component).toBeTruthy();
    })
})