import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map, find } from 'rxjs/operators';

export interface IRepositoryInfo {
  name: string;
}

const repositories: IRepositoryInfo[] = [

];

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  constructor() { }
  getRepositories(): Observable<IRepositoryInfo[]> { return of(repositories); }
  getRepository(id: string|null): Observable<IRepositoryInfo> {
    if (id === null)
      return of<IRepositoryInfo>();
    return this.getRepositories().pipe<IRepositoryInfo>(map(t => t.find(r => r.name === id)));
  }
}
