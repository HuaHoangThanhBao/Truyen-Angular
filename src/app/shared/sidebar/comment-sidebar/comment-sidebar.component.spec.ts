import { HttpClientModule } from "@angular/common/http";
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { CommentSidebarComponent } from './comment-sidebar.component';

describe('CommentSideBarComponent', () => {
    let component: CommentSidebarComponent;
    let fixture: ComponentFixture<CommentSidebarComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                CommentSidebarComponent
            ],
            imports: [
                RouterTestingModule,
                HttpClientModule,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CommentSidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    it('should create component', () => {
        expect(component).toBeTruthy();
    })
})