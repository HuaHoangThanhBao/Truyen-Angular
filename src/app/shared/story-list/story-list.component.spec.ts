import { HttpClientModule } from "@angular/common/http";
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { StoryListComponent } from './story-list.component';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { PaginationComponent } from '../pagination/pagination.component';

describe('StoryListComponent', () => {
    let component: StoryListComponent;
    let fixture: ComponentFixture<StoryListComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                StoryListComponent,
                PaginationComponent
            ],
            imports: [
                RouterTestingModule,
                HttpClientModule,
            ],
            providers: [
                ConfirmationDialogService
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StoryListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create component', () => {
        expect(component).toBeTruthy();
    })

    it('should passing headers', () => {
        spyOn(component.paginationComponent, 'passPagingData');
        component.passPagingHeaders([]);
        expect(component.paginationComponent.passPagingData).toHaveBeenCalled();
    })
    
    it('should call reload list', () => {
        expect(component.callReloadList(1)).toEqual(1);
    })
    
    it('should call reload histories', () => {
        expect(component.callReloadHistories(1)).toEqual(1);
    })
    
    it('should call Delete Following Item', () => {
        expect(component.callDeleteFollowingItem(1)).toEqual(1);
    })
    
    it('should call refresh histories', () => {
        expect(component.callRefreshHistories(1)).toEqual(1);
    })
    
    it('should open Confirmation Dialog For Following', async () => {
        let spy = spyOn(component._confirmationDialogService, 'confirm')
        .and.returnValue(Promise.resolve(true));

        await component.openConfirmationDialogForFollowing('1');//

        spy.calls.mostRecent().returnValue.then(res => {
            expect(res).toEqual(true)
        })
    })
    
    it('should open Confirmation Dialog For History', async () => {
        let spy = spyOn(component._confirmationDialogService, 'confirm')
        .and.returnValue(Promise.resolve(true));

        await component.openConfirmationDialogForHistory('1');
        
        spy.calls.mostRecent().returnValue.then(res => {
            expect(res).toEqual(true)
        })
    })
})