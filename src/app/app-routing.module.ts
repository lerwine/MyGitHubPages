import { NgModule } from '@angular/core';
import { Route, Routes, RouterModule, Data } from '@angular/router';
import { AppHomeComponent } from './app-home/app-home.component';
import { CodeCookbookComponent } from './code-cookbook/code-cookbook.component';
import { CodeCookbookVsCodeComponent } from './code-cookbook-vs-code/code-cookbook-vs-code.component';
import { CodeCookbookGitComponent } from './code-cookbook-git/code-cookbook-git.component';
import { CodeCookbookNpmComponent } from './code-cookbook-npm/code-cookbook-npm.component';
import { CodeCookbookHomeComponent } from './code-cookbook-home/code-cookbook-home.component';

export const routeMap: Routes = [
  { path: '', component: AppHomeComponent },
  { path: 'codeCookbook', component: CodeCookbookComponent, children: [ { path: '', children: [
    { path: 'vscode', component: CodeCookbookVsCodeComponent },
    { path: 'git', component: CodeCookbookGitComponent },
    { path: 'npm', component: CodeCookbookNpmComponent },
    { path: '', component: CodeCookbookHomeComponent }
  ]}]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routeMap)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
