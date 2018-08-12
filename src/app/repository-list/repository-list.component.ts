import { Component, OnInit } from '@angular/core';
import { RepositoryService, IRepositoryInfo } from '../repository.service';
import { ActivatedRoute, ParamMap } from '../../../node_modules/@angular/router';
import { Observable } from '../../../node_modules/rxjs';
import { switchMap } from '../../../node_modules/rxjs/operators';

@Component({
  selector: 'app-repository-list',
  templateUrl: './repository-list.component.html',
  styleUrls: ['./repository-list.component.css']
})
export class RepositoryListComponent implements OnInit {
  repositories$: Observable<IRepositoryInfo[]>;

  private _selectedName: string;
  public get selectedName(): string {
    return this._selectedName;
  }

  constructor(private _service: RepositoryService, private _route: ActivatedRoute) { }

  ngOnInit() {
    this.repositories$ = this._route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        // (+) before `params.get()` turns the string into a number
        this._selectedName = params.get('id');
        return this._service.getRepositories();
      })
    );
  }
}
