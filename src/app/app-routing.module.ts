import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { IndexComponent } from './pages/home/index/index.component';
import { AdminComponent } from './pages/admin/admin/admin.component';

const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: IndexComponent},
  { path: 'admin', loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule) },
  { path: 'authentication', loadChildren: () => import('./pages/home/authentication/authentication.module').then(m => m.AuthenticationModule) },
  { path: 'details', loadChildren: () => import('./pages/home/details/details.module').then(m => m.DetailsModule) },
  { path: 'info', loadChildren: () => import('./pages/home/info/info.module').then(m => m.InfoModule) },
  {path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
