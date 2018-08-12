import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-code-cookbook-home',
  templateUrl: './code-cookbook-home.component.html',
  styleUrls: ['./code-cookbook-home.component.css']
})
export class CodeCookbookHomeComponent implements OnInit {

  constructor(private _app: AppComponent) { }

  ngOnInit() {
    this._app.subHeadingText = '';
  }

}
