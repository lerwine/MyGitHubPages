import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { RepositoryService } from '../repository.service';
import { Observable } from '../../../node_modules/rxjs';
import { RepositoryInfo } from '../repository-info';
import { RepoReadme } from '../repo-readme';

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

  constructor(private _route: ActivatedRoute, private _router: Router, private _service: RepositoryService) { }

  ngOnInit() {
    this.repositories$ = this._service.getRepositories();
    this.repository$ = this._route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this._service.getRepository(params.get('id')))
    );
    console.log('about to invoke getReadMe');
    this.readme$ = this._route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this._service.getReadme(params.get('id')))
    );
  }
}
