import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map, find, catchError } from 'rxjs/operators';
import { RepositoryInfo, IRepositoryInfo } from './repository-info';
import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { RepoReadme, IRepoReadme } from './repo-readme';

// https://api.github.com/repos/lerwine/appjs/readme.html
// https://api.github.com/users/lerwine/repos
// const fauxRepoImport: IRepositoryInfo[] = [
//   {
//     name:  'appjs',
//     description:  null,
//     fork:  true,
//     created_at:  '2014-05-29T16:55:14Z',
//     updated_at:  '2014-05-29T16:55:14Z',
//     pushed_at:  '2013-04-24T02:28:39Z',
//     homepage:  null,
//     language:  'JavaScript',
//     license:  null,
//     default_branch:  'master'
//   },
//   {
//     name:  'appjs',
//     description:  null,
//     fork:  true,
//     created_at:  '2014-05-29T16:55:14Z',
//     updated_at:  '2014-05-29T16:55:14Z',
//     pushed_at:  '2013-04-24T02:28:39Z',
//     homepage:  null,
//     language:  'JavaScript',
//     license:  null,
//     default_branch:  'master'
//   },
//   {
//     name:  'CertKeyProvider',
//     description:  'Plugin for KeePass to use certificates from the Windows certificate store as master key source',
//     fork:  true,
//     created_at:  '2018-01-01T19:24:18Z',
//     updated_at:  '2018-01-01T19:24:19Z',
//     pushed_at:  '2017-06-21T02:21:05Z',
//     homepage:  null,
//     language:  'C#',
//     license:  null,
//     default_branch:  'master'
//   },
//   {
//     name:  'CodeCookBook',
//     description:  'Lenny\'s Coder\'s Cookbook',
//     fork:  false,
//     created_at:  '2018-06-23T13:33:35Z',
//     updated_at:  '2018-06-23T13:33:37Z',
//     pushed_at:  '2018-06-23T13:33:36Z',
//     homepage:  null,
//     language:  null,
//     license:  'GPL-3.0',
//     default_branch:  'master'
//   },
//   {
//     name:  'ConnectionReport',
//     description:  null,
//     fork:  false,
//     created_at:  '2014-01-26T03:36:07Z',
//     updated_at:  '2014-01-26T03:55:36Z',
//     pushed_at:  '2014-01-26T03:55:35Z',
//     homepage:  null,
//     language:  'ASP',
//     license:  'Apache-2.0',
//     default_branch:  'master'
//   },
//   {
//     name:  'CoreWebAppExample',
//     description:  null,
//     fork:  false,
//     created_at:  '2018-03-01T14:09:32Z',
//     updated_at:  '2018-05-01T11:59:15Z',
//     pushed_at:  '2018-05-01T11:59:14Z',
//     homepage:  null,
//     language:  'JavaScript',
//     license:  'Apache-2.0',
//     default_branch:  'master'
//   },
//   {
//     name:  'DataObjectSorter',
//     description:  'Data Object Sorter Sample Code',
//     fork:  false,
//     created_at:  '2014-01-23T11:54:18Z',
//     updated_at:  '2014-01-24T01:24:54Z',
//     pushed_at:  '2014-01-24T01:24:54Z',
//     homepage:  null,
//     language:  'C#',
//     license:  'Apache-2.0',
//     default_branch:  'master'
//   },
//   {
//     name:  'DataViewState',
//     description:  null,
//     fork:  false,
//     created_at:  '2014-01-23T12:05:25Z',
//     updated_at:  '2014-01-26T00:48:26Z',
//     pushed_at:  '2014-01-26T00:48:25Z',
//     homepage:  null,
//     language:  'C#',
//     license:  'Apache-2.0',
//     default_branch:  'master'
//   },
//   {
//     name:  'DocOrganizer',
//     description:  null,
//     fork:  false,
//     created_at:  '2014-01-23T12:12:51Z',
//     updated_at:  '2014-01-24T01:30:31Z',
//     pushed_at:  '2014-01-24T01:30:28Z',
//     homepage:  null,
//     language:  'ASP',
//     license:  'Apache-2.0',
//     default_branch:  'master'
//   },
//   {
//     name:  'DotNetProgrammersToolbox',
//     description:  null,
//     fork:  false,
//     created_at:  '2014-01-23T12:10:20Z',
//     updated_at:  '2014-01-24T01:39:33Z',
//     pushed_at:  '2014-01-24T01:39:33Z',
//     homepage:  null,
//     language:  'ASP',
//     license:  'Apache-2.0',
//     default_branch:  'master'
//   },
//   {
//     name:  'Excel-Based-Password-Keeper',
//     description:  'Excel-based user interface for managing passwords. Note: Macros in this project do not provide encryption.',
//     fork:  false,
//     created_at:  '2015-04-23T18:13:45Z',
//     updated_at:  '2015-12-14T19:25:53Z',
//     pushed_at:  '2015-05-14T17:49:20Z',
//     homepage:  null,
//     language:  'Visual Basic',
//     license:  'Apache-2.0',
//     default_branch:  'master'
//   },
//   {
//     name:  'FlashCards',
//     description:  null,
//     fork:  false,
//     created_at:  '2014-01-26T03:37:11Z',
//     updated_at:  '2016-03-29T13:04:25Z',
//     pushed_at:  '2016-03-29T13:04:23Z',
//     homepage:  null,
//     language:  'C#',
//     license:  'Apache-2.0',
//     default_branch:  'master'
//   },
//   {
//     name:  'GeneratePowershellModule',
//     description:  null,
//     fork:  false,
//     created_at:  '2014-01-23T12:08:07Z',
//     updated_at:  '2014-01-24T01:43:54Z',
//     pushed_at:  '2014-01-24T01:43:54Z',
//     homepage:  null,
//     language:  'C#',
//     license:  'Apache-2.0',
//     default_branch:  'master'
//   },
//   {
//     name:  'GetListSelection',
//     description:  null,
//     fork:  false,
//     created_at:  '2014-01-23T12:15:37Z',
//     updated_at:  '2014-01-24T02:06:02Z',
//     pushed_at:  '2014-01-24T02:05:59Z',
//     homepage:  null,
//     language:  'C#',
//     license:  'Apache-2.0',
//     default_branch:  'master'
//   },
//   {
//     name:  'git-bash-scripts',
//     description:  'Useful bash scripts that are intended to be used within the platform-independent Git bash shell as well as the the bash shell on a linux machine.',
//     fork:  false,
//     created_at:  '2014-05-29T13:30:15Z',
//     updated_at:  '2016-09-15T14:01:26Z',
//     pushed_at:  '2016-09-15T14:02:52Z',
//     homepage:  null,
//     language:  'Shell',
//     license:  'Apache-2.0',
//     default_branch:  'master'
//   },
//   {
//     name:  'GTaskCoord',
//     description:  'Example task coordinator for google apps',
//     fork:  false,
//     created_at:  '2018-04-08T00:29:31Z',
//     updated_at:  '2018-04-08T00:29:34Z',
//     pushed_at:  '2018-04-08T00:29:33Z',
//     homepage:  null,
//     language:  null,
//     license:  'GPL-3.0',
//     default_branch:  'master'
//   },
//   {
//     name:  'IconExtractor',
//     description:  'Icon Extractor Library for .NET',
//     fork:  true,
//     created_at:  '2018-08-04T14:14:33Z',
//     updated_at:  '2018-08-04T14:14:35Z',
//     pushed_at:  '2015-09-30T07:34:21Z',
//     homepage:  null,
//     language:  'C#',
//     license:  'Other',
//     default_branch:  'master'
//   },
//   {
//     name:  'JQueryContactsChallenge',
//     description:  null,
//     fork:  false,
//     created_at:  '2015-10-27T11:47:49Z',
//     updated_at:  '2015-10-27T12:04:41Z',
//     pushed_at:  '2015-10-29T10:06:40Z',
//     homepage:  null,
//     language:  'C#',
//     license:  'Apache-2.0',
//     default_branch:  'master'
//   },
//   {
//     name:  'JSCookbook',
//     description:  'Lenny\'s JavaScript Cookbook',
//     fork:  false,
//     created_at:  '2014-01-22T13:07:58Z',
//     updated_at:  '2018-04-11T08:27:42Z',
//     pushed_at:  '2018-04-11T08:27:40Z',
//     homepage:  null,
//     language:  'JavaScript',
//     license:  'Apache-2.0',
//     default_branch:  'master'
//   },
//   {
//     name:  'JsTypeCommander',
//     description:  'Validate, detect and convert JavaScript types and classes',
//     fork:  false,
//     created_at:  '2018-04-11T01:44:55Z',
//     updated_at:  '2018-06-23T00:43:06Z',
//     pushed_at:  '2018-06-28T02:28:54Z',
//     homepage:  '',
//     language:  'TypeScript',
//     license:  'GPL-3.0',
//     default_branch:  'master'
//   },
//   {
//     name:  'KeyStorageTest',
//     description:  'Test for key storage code',
//     fork:  false,
//     created_at:  '2014-03-28T22:05:47Z',
//     updated_at:  '2014-03-28T22:09:00Z',
//     pushed_at:  '2014-03-28T22:08:59Z',
//     homepage:  null,
//     language:  'C#',
//     license:  'GPL-3.0',
//     default_branch:  'master'
//   },
//   {
//     name:  'lerwine.github.io',
//     description:  'Lenny\'s website, for all things coding!',
//     fork:  false,
//     created_at:  '2018-06-24T01:07:12Z',
//     updated_at:  '2018-07-30T01:56:55Z',
//     pushed_at:  '2018-07-30T01:56:53Z',
//     homepage:  '',
//     language:  'JavaScript',
//     license:  null,
//     default_branch:  'master'
//   },
//   {
//     name:  'LErwineExamples',
//     description:  null,
//     fork:  false,
//     created_at:  '2014-10-13T21:19:13Z',
//     updated_at:  '2015-03-12T12:21:51Z',
//     pushed_at:  '2015-03-12T12:21:51Z',
//     homepage:  null,
//     language:  'C#',
//     license:  null,
//     default_branch:  'master'
//   },
//   {
//     name:  'LTEControls',
//     description:  null,
//     fork:  false,
//     created_at:  '2014-01-26T03:37:50Z',
//     updated_at:  '2014-01-26T03:56:51Z',
//     pushed_at:  '2014-01-26T03:56:50Z',
//     homepage:  null,
//     language:  'C#',
//     license:  null,
//     default_branch:  'master'
//   },
//   {
//     name:  'LTEJSLib',
//     description:  null,
//     fork:  false,
//     created_at:  '2014-04-29T14:59:09Z',
//     updated_at:  '2014-04-29T15:02:20Z',
//     pushed_at:  '2014-04-29T15:02:22Z',
//     homepage:  null,
//     language:  'JavaScript',
//     license:  'GPL-2.0',
//     default_branch:  'master'
//   },
//   {
//     name:  'LtePowerShell',
//     description:  'My personal PowerShell modules, scripts and snippets',
//     fork:  false,
//     created_at:  '2017-08-26T20:59:28Z',
//     updated_at:  '2018-04-10T18:46:35Z',
//     pushed_at:  '2017-08-26T21:03:59Z',
//     homepage:  '',
//     language:  null,
//     license:  'GPL-3.0',
//     default_branch:  'master'
//   },
//   {
//     name:  'LTEToolkit',
//     description:  'Lenny Erwine\'s Visual Studio Code Toolkit',
//     fork:  false,
//     created_at:  '2014-10-29T12:28:06Z',
//     updated_at:  '2016-10-24T13:28:02Z',
//     pushed_at:  '2016-10-30T17:16:08Z',
//     homepage:  '',
//     language:  'C#',
//     license:  'Other',
//     default_branch:  'master'
//   },
//   {
//     name:  'MyGitHubPages',
//     description:  'Source code for generating content for https://lerwine.github.io',
//     fork:  false,
//     created_at:  '2018-06-24T18:34:15Z',
//     updated_at:  '2018-08-01T02:20:53Z',
//     pushed_at:  '2018-08-01T02:20:52Z',
//     homepage:  null,
//     language:  'JavaScript',
//     license:  'GPL-3.0',
//     default_branch:  'master'
//   },
//   {
//     name:  'PortalEnumerator',
//     description:  null,
//     fork:  false,
//     created_at:  '2014-01-26T03:38:19Z',
//     updated_at:  '2014-01-26T03:58:21Z',
//     pushed_at:  '2014-01-26T03:58:20Z',
//     homepage:  null,
//     language:  'C#',
//     license:  'Apache-2.0',
//     default_branch:  'master'
//   },
//   {
//     name:  'PowerShell-Modules',
//     description:  'A collection of PowerShell modules that I have been working on for personal research.',
//     fork:  false,
//     created_at:  '2015-02-24T12:14:47Z',
//     updated_at:  '2018-05-23T15:11:37Z',
//     pushed_at:  '2018-06-06T02:46:43Z',
//     homepage:  null,
//     language:  'HTML',
//     license:  'Apache-2.0',
//     default_branch:  'master'
//   }
// ];

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  private _userServiceUrl = 'https://api.github.com/users/lerwine';
  private _repoServiceUrl = 'https://api.github.com/repos/lerwine';
  private readonly _version = 'application/vnd.github.v3.html+json';
  private _repositories: Observable<RepositoryInfo[]> |undefined;
  private _readme: { [index: string]: Observable<string>; } = { };
  constructor(private http: HttpClient) { }
  getRepository(id: string|null): Observable<RepositoryInfo> {
    if (id === null)
      return of<RepositoryInfo>();
    return this.getRepositories().pipe<RepositoryInfo>(map(t => t.find(r => r.name === id)));
  }
  getReadme(id: string|null): Observable<string> {
    if (id === null)
      return of<string>();
    let readme: Observable<string>|undefined = this._readme[id];
    if (typeof(readme) === 'undefined') {
      console.log('calling getReadMe to ' + this._repoServiceUrl + '/' + id + '/readme');
      readme = this.http.get(this._repoServiceUrl + '/' + id + '/readme', { responseType: 'text', headers: new HttpHeaders({
        'Accept':  'application/vnd.github.v3.html'
      }) })
      .pipe(catchError(function(err: HttpErrorResponse) {
        return of<string>('');
      }));
      this._readme[id] = readme;
    }
    return readme;
  }
  getRepositories(): Observable<RepositoryInfo[]> {
    let repositories: Observable<RepositoryInfo[]> |undefined = this._repositories;
    if (typeof(repositories) === 'undefined') {
      repositories = this.http.get<IRepositoryInfo[]>(this._userServiceUrl + '/repos', { observe: 'response' })
        .pipe(map<HttpResponse<IRepositoryInfo[]>, RepositoryInfo[]>(v => v.body.map<RepositoryInfo>(r => new RepositoryInfo(r))));
      this._repositories = repositories;
    }
    return repositories;
  }
}
