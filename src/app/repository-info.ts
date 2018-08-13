import { ContentChild } from '@angular/core';
import { SafeHtml } from '../../node_modules/@angular/platform-browser';
export interface ITextData {
  isHtml: boolean;
  text: string|string[];
}
export type TextData = string|string[]|ITextData;
export interface ILicenseInfo {
  key: string;
  name: string;
  spdx_id: string;
  url: string;
  node_id: string;
}
export interface IRepositoryInfo {
  id: string;
  node_id: string;
  name: string;
  html_url?: string;
  description?: string|null;
  fork?: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string|null;
  language?: string|null;
  license?: ILicenseInfo|null;
  default_branch: string;
}
export class RepositoryInfo {
  private _id: string;
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
  private _default_branch: string;
  public get id(): string { return this._id; }
  public get name(): string { return this._name; }
  public get repoUrl(): string { return this._repoUrl; }
  public get description(): string { return this._description; }
  public get isForked(): boolean { return this._isForked; }
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
    if (typeof(data.description) === 'string')
      this._description = RepositoryInfo.encodeHtml(data.description);
    else
      this._description = '';
    this._isForked = data.fork === true;
    this._isForkedDisplay = (this._isForked) ? 'Yes' : 'No';
    this._createdAt = new Date(data.created_at);
    this._pushedAt = new Date(data.pushed_at);
    this._updatedAt = new Date(data.updated_at);
    this._language = (typeof(data.language) === 'string' && data.language.trim().length > 0) ? data.language : 'Unspecified';
    if (typeof(data.license) !== 'undefined' && data.license !== null) {
      this._licenseType = (typeof(data.license.spdx_id) === 'string' && data.license.spdx_id.trim().length > 0) ? data.license.spdx_id : 'Unspecified';
      this._license = (typeof(data.license.name) === 'string' && data.license.name.trim().length > 0) ? data.license.name : this._licenseType;
    } else {
      this._licenseType = 'Unspecified';
      this._license = this._licenseType;
    }
  }
  static encodeHtml(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  static fromTextData(data: ITextData): string {
    if (Array.isArray(data.text)) {
      if (data.text.length === 0)
        return '';
      if (data.text.length === 1)
        return (data.isHtml) ? data.text[0] : RepositoryInfo.encodeHtml(data.text[0]);
        return ((data.isHtml) ? data.text : data.text.map(function(s: string): string { return '<p>' + RepositoryInfo.encodeHtml(s) + '</p>'; })).join('\n');
    }
    return (data.isHtml) ? data.text : RepositoryInfo.encodeHtml(data.text);
  }
}
