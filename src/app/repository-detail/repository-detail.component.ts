import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { RepositoryService } from '../repository.service';
import { Observable } from '../../../node_modules/rxjs';
import { RepositoryInfo } from '../repository-info';
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

  private _selectedId: number|undefined;
  public get selectedId(): number|undefined {
    return this._selectedId;
  }

  constructor(private _app: AppComponent, private _route: ActivatedRoute, private _router: Router, private _service: RepositoryService) { }

  ngOnInit() {
    this._app.headerText = '';
    this._app.subHeadingText = '';
    this.repositories$ = this._service.getRepositories();
    this.repository$ = this._route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this._selectedId = parseInt(params.get('id'));
        return this._service.getRepository(this._selectedId);
      })
    );
    this.repository$.forEach(r => {
      this._app.headerText = r.name;
      this.readme$ = this._route.paramMap.pipe(
        switchMap((params: ParamMap) =>
          this._service.getReadme(r.name))
      );
    });
  }
}
