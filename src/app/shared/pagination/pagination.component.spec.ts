import { HttpClientModule } from "@angular/common/http";
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
    let component: PaginationComponent;
    let fixture: ComponentFixture<PaginationComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                PaginationComponent
            ],
            imports: [
                RouterTestingModule,
                HttpClientModule,
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PaginationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    it('should create component', () => {
        expect(component).toBeTruthy();
    })
    
    it('should pass Paging Data', () => {
        expect(component.passPagingData(1)).toEqual(1);
    })
    
    it('should not render pagination with no data', () => {
        expect(component.renderPagination({}, 1)).toEqual(undefined);
    })
    
    it('should render pagination with 0 page', () => {
        expect(component.renderPagination({TotalPages: 0}, 1)).toEqual(undefined);
    })
    
    it('should render pagination with 1 page', () => {
        expect(component.renderPagination({TotalPages: 1}, 1)).toEqual([1]);
    })
    
    it('should render pagination with 2 pages', () => {
        expect(component.renderPagination({TotalPages: 2}, 1)).toEqual([1, '...', 2]);
    })
    
    it('should render pagination with 3 pages', () => {
        expect(component.renderPagination({TotalPages: 3}, 1)).toEqual([1, 2, '...', 3]);
    })
    
    it('should render pagination greater than 3 pages', () => {
        expect(component.renderPagination({TotalPages: 4}, 1)).toEqual([1, 2, '...', 3, 4]);
    })
    
    it('should render pagination with index = 4', () => {
        expect(component.renderPagination({TotalPages: 4}, 2)).toEqual([1, 2, '...']);
    })
    
    it('should render pagination with index = 5', () => {
        expect(component.renderPagination({TotalPages: 5}, 2)).toEqual([1, 2, '...', 4, 5]);
    })
    
    it('should render pagination with index = total pages', () => {
        expect(component.renderPagination({TotalPages: 2}, 2)).toEqual([1]);
    })

    it('should not refresh Story List with wrong data', () => {
        expect(component.refreshStoryList(1)).toEqual(undefined);
    })

    it('should not refresh Story List with true data', () => {
        component.paginationHeader = {TotalPages: 5}
        expect(component.refreshStoryList(5)).toEqual(5);
    })
    
    it('should not refresh Story List with three dots', () => {
        const list = document.createElement('div');
        list.id = "list-area";
        document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(list);
        component.paginationHeader = {TotalPages: 5}
        expect(component.refreshStoryList('...')).toEqual(undefined);
    })
    
    it('should not refresh Story List with false type', () => {
        const list = document.createElement('div');
        list.id = "list-area";
        document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(list);
        component.paginationHeader = {TotalPages: 5}
        expect(component.refreshStoryList(false)).toEqual(false);
    })
    
    it('should scroll to', () => {
        const list = document.createElement('div');
        list.id = "list-area";
        document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(list);
        expect(component.scrollTo('list-area')).toEqual('list-area');
    })
    
    it('should scroll to unknown element', () => {
        expect(component.scrollTo('unknown')).toEqual('unknown');
    })
})