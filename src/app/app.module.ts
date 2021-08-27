import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from "@auth0/angular-jwt";

import { AppComponent } from './app.component';
import { IndexComponent } from './pages/home/index/index.component';
import { CarouselComponent } from './shared/carousel/carousel.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AuthGuard } from './modules/guards/auth-guard.service';
import { environment } from '../environments/environment';
import { ToastAlertService } from './services/others/toast-alert-service.service';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { GeneralModules } from './pages/generalModules.module';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './pages/admin/admin/admin.component';
import { LoginService } from './services/others/login-service.service';

export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    AdminComponent,
    CarouselComponent,
    FooterComponent,
    NavbarComponent,
    NotFoundComponent
  ],
  imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    GeneralModules,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [environment.apiURL]
      }
    })
  ],
  providers: [AuthGuard, ToastAlertService, LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
