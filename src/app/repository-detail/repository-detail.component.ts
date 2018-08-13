import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { RepositoryService } from '../repository.service';
import { Observable } from '../../../node_modules/rxjs';
import { RepositoryInfo } from '../repository-info';
import { RepoReadme } from '../repo-readme';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-repository-detail',
  templateUrl: './repository-detail.component.html',
  styleUrls: ['./repository-detail.component.css']
})
export class RepositoryDetailComponent implements OnInit {
  repositories$: Observable<RepositoryInfo[]>;
  repository$: Observable<RepositoryInfo>;
  readme$: Observable<string>;

  private _selectedName: string;
  public get selectedName(): string {
    return this._selectedName;
  }

  constructor(private _app: AppComponent, private _route: ActivatedRoute, private _router: Router, private _service: RepositoryService) { }

  ngOnInit() {
    this._app.headerText = '';
    this._app.subHeadingText = '';
    this.repositories$ = this._service.getRepositories();
    this.repository$ = this._route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this._app.headerText = params.get('id');
        return this._service.getRepository(this._app.headerText);
      })
    );
    this.readme$ = this._route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this._service.getReadme(params.get('id')))
    );
  }
}
