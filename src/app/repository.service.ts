import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map, find, catchError } from 'rxjs/operators';
import { RepositoryInfo, IRepositoryInfo } from './repository-info';
import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class RepositoryService {
  private _userServiceUrl = 'https://api.github.com/users/lerwine';
  private _repoServiceUrl = 'https://api.github.com/repos/lerwine';
  private readonly _version = 'application/vnd.github.v3.html+json';
  private _repositories: Observable<RepositoryInfo[]>|undefined;
  private _readme: { [index: string]: Observable<string>; } = {};

  constructor(private http: HttpClient) {}

  getReadme(id: string|null): Observable<string> {
    if (id === null)
      return of <string>();
    let readme: Observable<string>|undefined = this._readme[id];
    if (typeof (readme) === 'undefined') {
      readme = this.http.get(this._repoServiceUrl + '/' + id + '/readme', {
          responseType: 'text',
          headers: new HttpHeaders({
            'Accept': 'application/vnd.github.v3.html'
          })
        })
        .pipe(catchError(function (err: HttpErrorResponse) {
          return of<string>('');
        }));
      this._readme[id] = readme;
    }
    return readme;
  }

  getRepositories(): Observable<RepositoryInfo[]> {
    let repositories: Observable<RepositoryInfo[]>|undefined = this._repositories;
    if (typeof (repositories) === 'undefined') {
      repositories = this.http.get<IRepositoryInfo[]>(this._userServiceUrl + '/repos', {
          observe: 'response'
        })
        .pipe(map<HttpResponse<IRepositoryInfo[]> , RepositoryInfo[]>(v => v.body.map<RepositoryInfo>(r => new RepositoryInfo(r))));
      this._repositories = repositories;
    }
    return repositories;
  }

  getRepository(id: string|null): Observable<RepositoryInfo> {
    if (id === null)
      return of<RepositoryInfo>();
    return this.getRepositories().pipe<RepositoryInfo>(map(t => t.find(r => r.name === id)));
  }
}
