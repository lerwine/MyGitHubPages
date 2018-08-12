import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-code-cookbook',
  templateUrl: './code-cookbook.component.html',
  styleUrls: ['./code-cookbook.component.css']
})
export class CodeCookbookComponent implements OnInit {

  constructor(private _app: AppComponent) { }

  ngOnInit() {
    this._app.headerText = 'Code Cookbook';
  }

}
