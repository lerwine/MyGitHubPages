import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppHomeComponent } from './app-home/app-home.component';
import { CodeCookbookComponent } from './code-cookbook/code-cookbook.component';
import { CodeCookbookGitComponent } from './code-cookbook-git/code-cookbook-git.component';
import { CodeCookbookVsCodeComponent } from './code-cookbook-vs-code/code-cookbook-vs-code.component';
import { CodeCookbookNpmComponent } from './code-cookbook-npm/code-cookbook-npm.component';
import { CodeCookbookHomeComponent } from './code-cookbook-home/code-cookbook-home.component';
import { RepositoryModule } from './repository/repository.module';
import { CommonModule } from '../../node_modules/@angular/common';
import { HttpClientModule, HttpClient, HttpResponse } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    AppHomeComponent,
    CodeCookbookComponent,
    CodeCookbookGitComponent,
    CodeCookbookVsCodeComponent,
    CodeCookbookNpmComponent,
    CodeCookbookHomeComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    RepositoryModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
