import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppHomeComponent } from './app-home/app-home.component';
import { CodeCookbookComponent } from './code-cookbook/code-cookbook.component';
import { CodeCookbookGitComponent } from './code-cookbook-git/code-cookbook-git.component';
import { CodeCookbookVsCodeComponent } from './code-cookbook-vs-code/code-cookbook-vs-code.component';
import { CodeCookbookNpmComponent } from './code-cookbook-npm/code-cookbook-npm.component';
import { CodeCookbookHomeComponent } from './code-cookbook-home/code-cookbook-home.component';

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
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
