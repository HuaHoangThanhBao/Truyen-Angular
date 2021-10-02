import { TestBed } from "@angular/core/testing";
import { SeletonLoaderComponent } from './seleton-loader.component';

describe('SeletonLoader', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                SeletonLoaderComponent,
            ],
            imports: [
            ]
        }).compileComponents();
    });

    it('should create component', () => {
        const fixture = TestBed.createComponent(SeletonLoaderComponent);
        const app = fixture.componentInstance;
        fixture.detectChanges();
        expect(app).toBeTruthy();
    })
    
    it('should get mystles', () => {
        const myStyles = {
            'width.px': '',
            'height.px': '',
            'border-radius': '',
            'margin': '5px 0px 5px 0px'
        };
        const fixture = TestBed.createComponent(SeletonLoaderComponent);
        const app = fixture.componentInstance;
        expect(app.getMyStyles()).toEqual(myStyles);
    })
})