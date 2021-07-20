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
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { AccountComponent } from './pages/home/account/account.component';
import { CategoryComponent } from './pages/home/category/category.component';
import { FollowingComponent } from './pages/home/following/following.component';
import { HistoryComponent } from './pages/home/history/history.component';
import { IndexComponent } from './pages/home/index/index.component';
import { StoryDetailComponent } from './pages/home/story-detail/story-detail.component';
import { StoryReadingComponent } from './pages/home/story-reading/story-reading.component';

const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: IndexComponent},
  { path: 'category/:id', component: CategoryComponent},
  { path: 'following', component: FollowingComponent},
  { path: 'history', component: HistoryComponent},
  { path: 'authentication', loadChildren: () => import('./pages/home/authentication/authentication.module').then(m => m.AuthenticationModule) },
  { path: 'account', component: AccountComponent/*, canActivate: [AuthGuard]*/},
  { path: 'story-detail/:id', component: StoryDetailComponent},
  { path: 'story-reading/:truyenID/:chuongID', component: StoryReadingComponent},

  { path: 'dashboard', component: DashboardComponent},
  { path: 'authors', component: AuthorsComponent},
  { path: 'charts', component: ChartsComponent},
  { path: 'genres', component: GenresComponent},
  { path: 'stories', component: StoriesComponent},
  { path: 'users', component: UsersComponent},
  { path: 'acceptance', component: AcceptanceComponent},
  
  {path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
