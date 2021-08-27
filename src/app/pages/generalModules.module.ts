import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingComponent } from '../shared/sidebar/ranking/ranking.component';
import { CommentListComponent } from '../shared/comment-list/comment-list.component';
import { CommentSidebarComponent } from '../shared/sidebar/comment-sidebar/comment-sidebar.component';
import { StoryListComponent } from '../shared/story-list/story-list.component';
import { PaginationComponent } from '../shared/pagination/pagination.component';
import { RouterModule } from '@angular/router';
import { SeletonLoaderModule } from '../modules/seleton-loader/seleton-loader.module';
import { ImagesLazyloadModule } from '../shared/images-lazyload/images.lazyload.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, SeletonLoaderModule, ImagesLazyloadModule],
    declarations: [
        StoryListComponent,
        RankingComponent,
        CommentSidebarComponent,
        CommentListComponent,
        PaginationComponent,
    ],
    exports: [
        StoryListComponent,
        RankingComponent,
        CommentSidebarComponent,
        CommentListComponent,
        PaginationComponent,
        SeletonLoaderModule,
        ImagesLazyloadModule
    ]
})
export class GeneralModules { }
