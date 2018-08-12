import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { RepositoryService, IRepositoryInfo } from '../repository.service';
import { Observable } from '../../../node_modules/rxjs';

@Component({
  selector: 'app-repository-detail',
  templateUrl: './repository-detail.component.html',
  styleUrls: ['./repository-detail.component.css']
})
export class RepositoryDetailComponent implements OnInit {
  repository$: Observable<IRepositoryInfo>;

  constructor(private _route: ActivatedRoute, private _router: Router, private _service: RepositoryService) { }

  ngOnInit() {
    this.repository$ = this._route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this._service.getRepository(params.get('id')))
    );
  }
}
