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

@NgModule({
  declarations: [AdminSideNavbarComponent, AdminTopNavbarComponent, DashboardComponent, AcceptanceComponent, AuthorsComponent, ChartsComponent, GenresComponent, StoriesComponent, UsersComponent],
  imports: [
    CommonModule,
    GeneralModules,
    ReactiveFormsModule,
    RouterModule.forChild([
        { path: 'dashboard', component: DashboardComponent},
        { path: 'acceptance', component: AcceptanceComponent},
        { path: 'author', component: AuthorsComponent},
        { path: 'chart', component: ChartsComponent},
        { path: 'genre', component: GenresComponent},
        { path: 'stories', component: StoriesComponent},
        { path: 'users', component: UsersComponent},
    ])
  ]
})
export class AdminModule { }
