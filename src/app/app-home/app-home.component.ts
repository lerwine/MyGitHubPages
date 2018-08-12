import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.css']
})
export class AppHomeComponent implements OnInit {

  constructor(private _app: AppComponent) { }

  ngOnInit() {
    this._app.headerText = 'Lenny\'s GitHub Repositories';
    this._app.subHeadingText = '';
  }

}
