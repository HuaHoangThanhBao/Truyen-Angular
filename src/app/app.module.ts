import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { SeletonLoaderModule } from './modules/seleton-loader/seleton-loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from "@auth0/angular-jwt";

import { AppComponent } from './app.component';
import { IndexComponent } from './pages/home/index/index.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { ChartsComponent } from './pages/admin/charts/charts.component';
import { AuthorsComponent } from './pages/admin/authors/authors.component';
import { GenresComponent } from './pages/admin/genres/genres.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { StoriesComponent } from './pages/admin/stories/stories.component';
import { AcceptanceComponent } from './pages/admin/acceptance/acceptance.component';
import { CarouselComponent } from './shared/carousel/carousel.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AuthGuard } from './modules/guards/auth-guard.service';
import { environment } from '../environments/environment';
import { ToastAlertService } from './shared/services/toast-alert-service.service';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { GeneralModules } from './pages/home/generalModules.module';
import { RouterModule } from '@angular/router';

export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    DashboardComponent,
    ChartsComponent,
    AuthorsComponent,
    GenresComponent,
    UsersComponent,
    StoriesComponent,
    AcceptanceComponent,
    CarouselComponent,
    FooterComponent,
    NavbarComponent,
    NotFoundComponent,
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
  providers: [AuthGuard, ToastAlertService],
  bootstrap: [AppComponent]
})
export class AppModule { }
