import { NgModule } from '@angular/core';
import { Route, Routes, RouterModule, Data } from '@angular/router';
import { RepositoryListComponent } from '../repository-list/repository-list.component';
import { RepositoryDetailComponent } from '../repository-detail/repository-detail.component';

export const routeMap: Routes = [
  { path: 'repositories', component: RepositoryListComponent },
  { path: 'repository/:id', component: RepositoryDetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routeMap)],
  exports: [RouterModule]
})
export class RepositoryRoutingModule { }
