import { inject, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { LoginService } from './services/others/login-service.service';
import { RefreshTokenService } from './services/jwt/refreshTokenService.service';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ToastAlertService } from './services/others/toast-alert-service.service';
import { of, BehaviorSubject, Subject } from 'rxjs';
import { RefreshToken } from './model/refresh-token/RefreshToken.model';

describe('AppComponent', () => {
  let refreshTokenServiceSpy: jasmine.SpyObj<RefreshTokenService>;

  beforeEach(async () => {
    refreshTokenServiceSpy = jasmine.createSpyObj('RefreshTokenService', ['postExtendNonCatchError']);
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
      ],
      imports: [
        JwtModule.forRoot({
          config: {
            tokenGetter: () => {
              return '';
            }
          }
        }),
        RouterTestingModule,
        HttpClientModule],
        providers: [LoginService, RefreshTokenService, ToastAlertService, JwtHelperService,
          {
            provide: Router,
            useValue: {
              url: '/index',
              events: of(new NavigationEnd(0, '/index', '/index')),
              navigate: jasmine.createSpy('navigate')
            }
          }
        ]
    }).compileComponents();
  });


  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();
    expect(app).toBeTruthy();
  });
  
  it('theme dark', () => {
    localStorage.setItem('theme', 'dark');
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    
    expect(app.canActivate()).toBeTruthy();
  })

  it('token is not expired', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    
    expect(app.canActivate()).toBeTruthy();
  })

  it('token is expired', () => {
    localStorage.setItem('jwt', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9zaWQiOiI1NTQ4ZDJjNS1mNzdmLTRmZjktZDdlYy0wOGQ5N2Y1YTUzZWUiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJVc2VyIiwiZXhwIjoxNjMzMTUzMzM4LCJpc3MiOiJodHRwczovL3d3dy5yYW5oZG9jdHJ1eWVuLmNvbSIsImF1ZCI6WyJodHRwczovL3d3dy5yYW5oZG9jdHJ1eWVuLmNvbSIsImh0dHBzOi8vd3d3LnJhbmhkb2N0cnV5ZW4uY29tIiwiaHR0cHM6Ly93d3cucmFuaGRvY3RydXllbi5jb20iXX0.gQZaTrAum9K9-jOZUoeU_bn88Zw6S61Npm6ES4tCzl0');
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.canActivate()).toBeTruthy();//
  })
  
  it('refresh token is expired', () => {
    localStorage.setItem('refreshToken', 'B8tGbECCuMXHNeQYuw5CHcQWiv/PyiNEBjZwkHVRd3I=');
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.canActivate()).toBeTruthy();//
  })

  it(`should have as title 'RanhDocTruyen'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('RanhDocTruyen');
  });
});
