import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-code-cookbook-git',
  templateUrl: './code-cookbook-git.component.html',
  styleUrls: ['./code-cookbook-git.component.css']
})
export class CodeCookbookGitComponent implements OnInit {

  constructor(private _app: AppComponent) { }

  ngOnInit() {
    this._app.subHeadingText = 'Git Cheat Sheet';
  }

}
