import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { IndexComponent } from './pages/home/index/index.component';
import { AdminComponent } from './pages/admin/admin/admin.component';

const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: IndexComponent},
  { path: 'admin', component: AdminComponent},
  { path: 'admin', loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule) },
  { path: 'authentication', loadChildren: () => import('./pages/home/authentication/authentication.module').then(m => m.AuthenticationModule) },
  { path: 'details', loadChildren: () => import('./pages/home/details/details.module').then(m => m.DetailsModule) },
  { path: 'info', loadChildren: () => import('./pages/home/info/info.module').then(m => m.InfoModule) },

  // { path: '', redirectTo: 'index', pathMatch: 'full' },
  // { path: 'index', component: IndexComponent},
  // { path: 'category/:id', component: CategoryComponent},
  // { path: 'following', component: FollowingComponent},
  // { path: 'history', component: HistoryComponent},
  // { path: 'authentication', loadChildren: () => import('./pages/home/authentication/authentication.module').then(m => m.AuthenticationModule) },
  // { path: 'account', component: AccountComponent/*, canActivate: [AuthGuard]*/},
  // { path: 'story-detail/:id', component: StoryDetailComponent},
  // { path: 'story-reading/:truyenID/:chuongID', component: StoryReadingComponent},

  // { path: 'dashboard', component: DashboardComponent},
  // { path: 'authors', component: AuthorsComponent},
  // { path: 'charts', component: ChartsComponent},
  // { path: 'genres', component: GenresComponent},
  // { path: 'stories', component: StoriesComponent},
  // { path: 'users', component: UsersComponent},
  // { path: 'acceptance', component: AcceptanceComponent},
  
  {path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
