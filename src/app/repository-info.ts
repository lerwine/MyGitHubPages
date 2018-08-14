export interface IOwnerInfo {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id?: string|null;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface IRepositoryPermissions {
  admin: boolean;
  push: boolean;
  pull: boolean;
}

export interface ILicenseInfo {
  key: string;
  name: string;
  spdx_id?: string|null;
  url?: string|null;
  node_id: string;
}

export interface IRepositoryInfo {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  owner: IOwnerInfo;
  private: boolean;
  html_url: string;
  description?: string|null;
  fork: boolean;
  url: string;
  archive_url: string;
  assignees_url: string;
  blobs_url: string;
  branches_url: string;
  collaborators_url: string;
  comments_url: string;
  commits_url: string;
  compare_url: string;
  contents_url: string;
  contributors_url: string;
  deployments_url: string;
  downloads_url: string;
  events_url: string;
  forks_url: string;
  git_commits_url: string;
  git_refs_url: string;
  git_tags_url: string;
  git_url: string;
  issue_comment_url: string;
  issue_events_url: string;
  issues_url: string;
  keys_url: string;
  labels_url: string;
  languages_url: string;
  merges_url: string;
  milestones_url: string;
  notifications_url: string;
  pulls_url: string;
  releases_url: string;
  ssh_url: string;
  stargazers_url: string;
  statuses_url: string;
  subscribers_url: string;
  subscription_url: string;
  tags_url: string;
  teams_url: string;
  trees_url: string;
  clone_url: string;
  mirror_url?: string|null;
  hooks_url: string;
  svn_url: string;
  homepage?: string|null;
  language?: string|null;
  forks_count?: number;
  forks?: number;
  stargazers_count: number;
  watchers_count?: number;
  watchers?: number;
  size: number;
  default_branch: string;
  open_issues_count?: number;
  open_issues?: number;
  topics?: string[];
  has_issues: boolean;
  has_projects: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_downloads: boolean;
  archived: boolean;
  pushed_at: string|Date;
  created_at: string|Date;
  updated_at: string|Date;
  permissions?: IRepositoryPermissions|null;
  allow_rebase_merge?: boolean;
  allow_squash_merge?: boolean;
  allow_merge_commit?: boolean;
  subscribers_count?: number;
  network_count?: number;
  license: ILicenseInfo|null;
}
export class RepositoryInfo {
  private _id: number;
  private _name: string;
  private _repoUrl: string;
  private _description: string;
  private _isForked: boolean;
  private _isForkedDisplay: string;
  private _createdAt: Date;
  private _pushedAt: Date;
  private _updatedAt: Date;
  private _homepage: string;
  private _language: string;
  private _licenseType: string;
  private _license: string;
  public get id(): number { return this._id; }
  public get name(): string { return this._name; }
  public get repoUrl(): string { return this._repoUrl; }
  public get description(): string { return this._description; }
  public get isForked(): boolean { return this._isForked; }
  public get isForkedDisplay(): string { return this._isForkedDisplay; }
  public get createdAt(): Date { return this._createdAt; }
  public get pushedAt(): Date { return this._pushedAt; }
  public get updatedAt(): Date { return this._updatedAt; }
  public get homepage(): string { return this._homepage; }
  public get language(): string { return this._language; }
  public get license(): string { return this._license; }
  constructor(data: IRepositoryInfo) {
    this._id = data.id;
    this._name = data.name;
    this._repoUrl = (typeof(data.html_url) === 'string' && data.html_url.trim().length > 0) ? data.html_url : 'https://github.com/lerwine/' + data.name;
    this._description = (typeof(data.description) === 'string') ? data.description : '';
    this._isForked = data.fork === true;
    this._isForkedDisplay = (this._isForked) ? 'Yes' : 'No';
    this._createdAt = (typeof(data.created_at) === 'string') ? new Date(data.created_at) : data.created_at;
    this._pushedAt = (typeof(data.pushed_at) === 'string') ? new Date(data.pushed_at) : data.pushed_at;
    this._updatedAt = (typeof(data.updated_at) === 'string') ? new Date(data.updated_at) : data.updated_at;
    this._language = (typeof(data.language) === 'string' && data.language.trim().length > 0) ? data.language : 'Unspecified';
    if (typeof(data.license) !== 'undefined' && data.license !== null) {
      this._licenseType = (typeof(data.license.spdx_id) === 'string' && data.license.spdx_id.trim().length > 0) ? data.license.spdx_id : 'Unspecified';
      this._license = (typeof(data.license.name) === 'string' && data.license.name.trim().length > 0) ? data.license.name : this._licenseType;
    } else {
      this._licenseType = 'Unspecified';
      this._license = this._licenseType;
    }
  }
}
