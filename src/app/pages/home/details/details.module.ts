import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryComponent } from '../details/category/category.component';
import { StoryDetailComponent } from '../details/story-detail/story-detail.component';
import { StoryReadingComponent } from '../details/story-reading/story-reading.component';
import { GeneralModules } from '../generalModules.module';

@NgModule({
  declarations: [CategoryComponent, StoryDetailComponent, StoryReadingComponent],
  imports: [
    CommonModule,
    GeneralModules,
    RouterModule.forChild([
        { path: 'category/:id', component: CategoryComponent},
        { path: 'story-detail/:truyenID', component: StoryDetailComponent},
        { path: 'story-reading/:truyenID/:chuongID', component: StoryReadingComponent},
    ])
  ]
})
export class DetailsModule { }
