import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RepositoryListComponent } from '../repository-list/repository-list.component';
import { RepositoryDetailComponent } from '../repository-detail/repository-detail.component';
import { RepositoryService } from '../repository.service';
import { RepositoryRoutingModule } from './repository-routing.module';
import { BrowserModule } from '../../../node_modules/@angular/platform-browser';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    RepositoryRoutingModule
  ],
  declarations: [RepositoryListComponent, RepositoryDetailComponent],
  providers: [RepositoryService]
})
export class RepositoryModule { }
