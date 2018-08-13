export interface IRepoReadme {
  type: string;
  encoding: string;
  size: number;
  name: string;
  path: string;
  content: string;
  sha: string;
  url: string;
  git_url?: string;
  html_url?: string;
  download_url?: string;
  _links?: {
    git?: string;
    self?: string;
    html?: string;
  };
}
export class RepoReadme {
  private _type: string;
  private _encoding: string;
  private _size: number;
  private _name: string;
  private _path: string;
  private _content: string;
  private _sha: string;
  private _url: string;
  private _git_url: string;
  private _html_url: string;
  private _download_url: string;
  public get type(): string { return this._type; }
  public get encoding(): string { return this._encoding; }
  public get size(): number { return this._size; }
  public get name(): string { return this._name; }
  public get path(): string { return this._path; }
  public get content(): string { return this._content; }
  public get sha(): string { return this._sha; }
  public get url(): string { return this._url; }
  public get git_url(): string|undefined { return this._git_url; }
  public get html_url(): string|undefined { return this._html_url; }
  public get download_url(): string|undefined { return this._download_url; }
  constructor(data?: IRepoReadme|null) {
    if (typeof(data) !== 'object' || data === null) {
      this._type = '';
      this._encoding = '';
      this._size = 0;
      this._name = '';
      this._path = '';
      this._content = '';
      this._sha = '';
      this._url = '';
      this._git_url = '';
      this._html_url = '';
      this._download_url = '';
      return;
    }

    this._type = data.type;
    this._encoding = data.encoding;
    this._size = data.size;
    this._name = data.name;
    this._path = data.path;
    this._content = data.content;
    this._sha = data.sha;
    this._url = data.url;
    this._git_url = (typeof(data.git_url) === 'string' && data.git_url.trim().length > 0) ? data.git_url : '';
    this._html_url = (typeof(data.html_url) === 'string' && data.html_url.trim().length > 0) ? data.html_url : '';
    this._download_url = (typeof(data.download_url) === 'string' && data.download_url.trim().length > 0) ? data.download_url : '';
  }
}
