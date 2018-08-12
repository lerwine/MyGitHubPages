import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-code-cookbook-npm',
  templateUrl: './code-cookbook-npm.component.html',
  styleUrls: ['./code-cookbook-npm.component.css']
})
export class CodeCookbookNpmComponent implements OnInit {

  constructor(private _app: AppComponent) { }

  ngOnInit() {
    this._app.subHeadingText = 'NPM Cheat Sheet';
  }

}
