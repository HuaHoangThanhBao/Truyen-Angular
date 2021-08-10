import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { FollowingComponent } from '../info/following/following.component';
import { HistoryComponent } from '../info/history/history.component';
import { GeneralModules } from '../generalModules.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AccountComponent, FollowingComponent, HistoryComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GeneralModules,
    RouterModule.forChild([
        { path: 'following', component: FollowingComponent},
        { path: 'history', component: HistoryComponent},
        { path: 'account', component: AccountComponent/*, canActivate: [AuthGuard]*/},
    ])
  ]
})
export class InfoModule { }
