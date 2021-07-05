import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { SeletonLoaderModule } from './modules/seleton-loader/seleton-loader.module';

import { AppComponent } from './app.component';
import { StoryReadingComponent } from './pages/home/story-reading/story-reading.component';
import { StoryDetailComponent } from './pages/home/story-detail/story-detail.component';
import { CategoryComponent } from './pages/home/category/category.component';
import { FollowingComponent } from './pages/home/following/following.component';
import { HistoryComponent } from './pages/home/history/history.component';
import { LoginComponent } from './pages/home/login/login.component';
import { IndexComponent } from './pages/home/index/index.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { ChartsComponent } from './pages/admin/charts/charts.component';
import { AuthorsComponent } from './pages/admin/authors/authors.component';
import { GenresComponent } from './pages/admin/genres/genres.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { StoriesComponent } from './pages/admin/stories/stories.component';
import { AcceptanceComponent } from './pages/admin/acceptance/acceptance.component';
import { CarouselComponent } from './shared/carousel/carousel.component';
import { PaginationComponent } from './shared/pagination/pagination.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { RankingComponent } from './shared/sidebar/ranking/ranking.component';
import { CommentListComponent } from './shared/comment-list/comment-list.component';
import { StoryListComponent } from './shared/story-list/story-list.component';
import { CommentSidebarComponent } from './shared/sidebar/comment-sidebar/comment-sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    StoryReadingComponent,
    StoryDetailComponent,
    CategoryComponent,
    FollowingComponent,
    HistoryComponent,
    LoginComponent,
    IndexComponent,
    DashboardComponent,
    ChartsComponent,
    AuthorsComponent,
    GenresComponent,
    UsersComponent,
    StoriesComponent,
    AcceptanceComponent,
    CarouselComponent,
    PaginationComponent,
    FooterComponent,
    NavbarComponent,
    RankingComponent,
    CommentListComponent,
    StoryListComponent,
    CommentSidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SeletonLoaderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
