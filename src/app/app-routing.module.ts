import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SingerComponent } from './singer/singer.component';
import { SingerListComponent } from './singer-list/singer-list.component';
import { RecommendComponent } from './recommend/recommend.component';

const routes: Routes = [
  {
    path: 'singer',
    component: SingerComponent,
  },
  {
    path: 'singer-list',
    component: SingerListComponent,
  },
  {
    path: 'recommend',
    component: RecommendComponent,
  },
]; // sets up routes constant where you define your routes

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
