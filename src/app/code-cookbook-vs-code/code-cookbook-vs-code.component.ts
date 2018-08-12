import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-code-cookbook-vs-code',
  templateUrl: './code-cookbook-vs-code.component.html',
  styleUrls: ['./code-cookbook-vs-code.component.css']
})
export class CodeCookbookVsCodeComponent implements OnInit {

  constructor(private _app: AppComponent) { }

  ngOnInit() {
    this._app.subHeadingText = 'Visual Studio Code Check Sheet';
  }

}
