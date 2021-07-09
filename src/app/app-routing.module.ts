import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './modules/guards/auth-guard.service';
import { AcceptanceComponent } from './pages/admin/acceptance/acceptance.component';
import { AuthorsComponent } from './pages/admin/authors/authors.component';
import { ChartsComponent } from './pages/admin/charts/charts.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { GenresComponent } from './pages/admin/genres/genres.component';
import { StoriesComponent } from './pages/admin/stories/stories.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { AccountComponent } from './pages/home/account/account.component';
import { CategoryComponent } from './pages/home/category/category.component';
import { FollowingComponent } from './pages/home/following/following.component';
import { HistoryComponent } from './pages/home/history/history.component';
import { IndexComponent } from './pages/home/index/index.component';
import { LoginComponent } from './pages/home/login/login.component';
import { RegisterComponent } from './pages/home/register/register.component';
import { StoryDetailComponent } from './pages/home/story-detail/story-detail.component';
import { StoryReadingComponent } from './pages/home/story-reading/story-reading.component';
import { TwoStepVerificationComponent } from './pages/home/two-step-verification/two-step-verification.component';

const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: IndexComponent},
  { path: 'category/:id', component: CategoryComponent},
  { path: 'following', component: FollowingComponent, canActivate: [AuthGuard]},
  { path: 'history', component: HistoryComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'two-step-veri', component: TwoStepVerificationComponent},
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard]},
  { path: 'story-detail/:id', component: StoryDetailComponent},
  { path: 'story-reading/:truyenID/:chuongID', component: StoryReadingComponent},

  { path: 'dashboard', component: DashboardComponent},
  { path: 'authors', component: AuthorsComponent},
  { path: 'charts', component: ChartsComponent},
  { path: 'genres', component: GenresComponent},
  { path: 'stories', component: StoriesComponent},
  { path: 'users', component: UsersComponent},
  { path: 'acceptance', component: AcceptanceComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
