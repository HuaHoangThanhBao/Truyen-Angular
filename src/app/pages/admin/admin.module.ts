import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GeneralModules } from '../generalModules.module';
import { AcceptanceComponent } from './acceptance/acceptance.component';
import { AuthorsComponent } from './authors/authors.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartsComponent } from './charts/charts.component';
import { GenresComponent } from './genres/genres.component';
import { StoriesComponent } from './stories/stories.component';
import { UsersComponent } from './users/users.component';
import { AdminSideNavbarComponent } from '../../shared/admin-side-navbar/admin-side-navbar.component';
import { AdminTopNavbarComponent } from '../../shared/admin-top-navbar/admin-top-navbar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminGuard } from '../../modules/guards/admin-guard.service';

@NgModule({
  declarations: [AdminSideNavbarComponent, AdminTopNavbarComponent, DashboardComponent, AcceptanceComponent, AuthorsComponent, ChartsComponent, GenresComponent, StoriesComponent, UsersComponent],
  imports: [
    CommonModule,
    GeneralModules,
    ReactiveFormsModule,
    RouterModule.forChild([
        { path: 'dashboard', component: DashboardComponent, canActivate: [AdminGuard]},
        { path: 'acceptance', component: AcceptanceComponent, canActivate: [AdminGuard]},
        { path: 'author', component: AuthorsComponent, canActivate: [AdminGuard]},
        { path: 'chart', component: ChartsComponent, canActivate: [AdminGuard]},
        { path: 'genre', component: GenresComponent, canActivate: [AdminGuard]},
        { path: 'stories', component: StoriesComponent, canActivate: [AdminGuard]},
        { path: 'users', component: UsersComponent, canActivate: [AdminGuard]},
    ])
  ]
})
export class AdminModule { }
