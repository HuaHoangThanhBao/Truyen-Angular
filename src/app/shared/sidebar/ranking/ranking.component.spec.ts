import { TestBed } from "@angular/core/testing";
import { RankingComponent } from './ranking.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from "@angular/router/testing";

describe('RankingComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                RankingComponent
            ],
            imports: [
                RouterTestingModule,
                HttpClientModule,
            ]
        }).compileComponents();
    });

    it('should create component', () => {
        const fixture = TestBed.createComponent(RankingComponent);
        const app = fixture.componentInstance;
        fixture.detectChanges();
        expect(app).toBeTruthy();
    })
})