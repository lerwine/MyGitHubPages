import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../repository.service';
import { ActivatedRoute, ParamMap } from '../../../node_modules/@angular/router';
import { Observable } from '../../../node_modules/rxjs';
import { switchMap } from '../../../node_modules/rxjs/operators';
import { RepositoryInfo } from '../repository-info';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-repository-list',
  templateUrl: './repository-list.component.html',
  styleUrls: ['./repository-list.component.css']
})
export class RepositoryListComponent implements OnInit {
  repositories$: Observable<RepositoryInfo[]>;

  private _selectedName: string;
  public get selectedName(): string {
    return this._selectedName;
  }

  constructor(private _app: AppComponent, private _service: RepositoryService, private _route: ActivatedRoute) { }

  ngOnInit() {
    this.repositories$ = this._service.getRepositories();
    this._app.headerText = 'Repositories';
    this._app.subHeadingText = '';
  }
}
