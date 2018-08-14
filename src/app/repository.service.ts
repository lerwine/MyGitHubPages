import { Injectable } from '@angular/core';
import { of, Observable, empty } from 'rxjs';
import { map, find, catchError, expand, concatMap, concat } from 'rxjs/operators';
import { RepositoryInfo, IRepositoryInfo } from './repository-info';
import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { jsonpCallbackContext } from '../../node_modules/@angular/common/http/src/module';
import { ValueTransformer } from '../../node_modules/@angular/compiler/src/util';

interface IPageMap {
  content: IRepositoryInfo[];
  next: string|null;
}
@Injectable({ providedIn: 'root' })
export class RepositoryService {
  private _userServiceUrl = 'https://api.github.com/users/lerwine';
  private _repoServiceUrl = 'https://api.github.com/repos/lerwine';
  private _repositories: Observable<RepositoryInfo[]> | undefined;
  private _readme: {
    [index: string]: Observable<string> ;
  } = {};

  constructor(private http: HttpClient) {}

  getReadme(name?: string|null): Observable<string> {
    if (typeof(name) !== 'string')
      return of<string>();
    let readme: Observable<string> | undefined = this._readme[name];
    if (typeof (readme) === 'undefined') {
      console.log('Loading README from GitHub');
      readme = this.http.get(this._repoServiceUrl + '/' + name + '/readme', {
          responseType: 'text',
          headers: new HttpHeaders({
            'Accept': 'application/vnd.github.v3.html'
          })
        })
        .pipe(
          map(function(value: string) {
            console.log('Parsing ' + JSON.stringify(value));
            let m: RegExpMatchArray = value.match(/^\s*(<(div|article)(?:\s+[^>]*)?>\s*)+/);
            if (m !== null) {
              const s = value.substr(m[0].length).trim();
              m = s.match(/(\s*<\/(article|div)>)+\s*$/);
              if (m !== null)
                return s.substr(0, value.length - m[0].length).trim();
            }
            return value;
          }),
          catchError(function (err: HttpErrorResponse) {
            return of<string>('');
          })
        );
      this._readme[name] = readme;
    }
    return readme;
  }

  private getRepositoryPage(url: string): Observable<IPageMap> {
    return this.http.get<IRepositoryInfo[]>(url, { observe: 'response'})
      .pipe(map<HttpResponse<IRepositoryInfo[]>, IPageMap>(ri => {
        return {
          content: ri.body,
          next: this.nextPage(ri)
        };
      }));
  }

  private nextPage(response: HttpResponse<IRepositoryInfo[]>): string | null {
    let url: string | null = null;
    const link = response.headers.get('Link');
    if (link) {
      const match = link.match(/<([^>]+)>;\s*rel="next"/);
      if (match)
        [, url] = match;
    }
    return url;
  }

  getRepositories() {
    let repositories: Observable<RepositoryInfo[]> | undefined = this._repositories;
    if (typeof(repositories) === 'undefined') {
      console.log('Loading repositories from GitHub');
      repositories = this.getRepositoryPage(this._userServiceUrl + '/repos?per_page=30&page=1').pipe(
        expand((obj: IPageMap) => {
          if (obj.next)
            return this.getRepositoryPage(obj.next).pipe(map(pm => {
              return {
                content: obj.content.concat(pm.content),
                next: pm.next
              };
            }));
          return empty();
        }),
        concatMap((value, index) => [value.content.map<RepositoryInfo>(r => new RepositoryInfo(r))])
      );
      this._repositories = repositories;
    }

    return repositories;
  }

  getRepository(id?: number|string|null): Observable<RepositoryInfo> {
    if (typeof(id) !== 'number') {
      if (typeof(id) === 'string')
        id = parseInt(id);
      else
        return of<RepositoryInfo>();
    }
    if (isNaN(id))
      return of<RepositoryInfo>();
    return this.getRepositories().pipe<RepositoryInfo>(map(t => t.find(r => r.id === id)));
  }
}
