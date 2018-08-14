export interface IElement {
  name: string;
  id?: string;
  class?: string|string[];
  style?: string|string[]
}

interface IContainerBaseElement extends IElement {
  content: string|IElement|(string|IElement)[];
}

export type ContentElement = IContainerElement|IAnchorElement|IListElement|IDtDdElement|IBreakElement;

export interface IBreakElement { name: 'br'; }
export interface IContainerElement extends IContainerBaseElement {
  name: 'h1'|'h2'|'h3'|'h4'|'h5'|'h6'|'div'|'span'|'samp'|'kbd'|'var'|'code'|'pre'|'em'|'p';
}

export interface IAnchorElement extends IContainerBaseElement {
  name: 'a';
  href?: string;
  target?: '_blank';
}
interface IRestrictedContainerElement<T> extends IElement {
  content: T|T[];
}

export interface IListItemElement extends IContainerBaseElement {
  name: 'li';
}

export interface IListElement extends IRestrictedContainerElement<IListItemElement> {
  name: 'ul'|'ol';
}

export interface IDtElement extends IContainerBaseElement { name: 'dt'; }
export interface IDdElement extends IContainerBaseElement { name: 'dd'; }
export interface IDtDdElement {
  dt: IDtElement;
  dd: IDdElement;
}
export interface IDlElement extends IRestrictedContainerElement<IDtDdElement> {
  name: 'dl';
}
export interface ICaptionElement extends IContainerBaseElement {
  name: 'caption';
}
export interface ITrElement extends IRestrictedContainerElement<ITdElement> {
  name: 'tr';
}
export interface ITdElement extends IContainerBaseElement {
  name: 'td';
}
export interface IThElement extends IContainerBaseElement {
  name: 'th';
}
export interface IRowContainerElement extends IRestrictedContainerElement<ITrElement> {
  name: 'thead'|'tbody'|'tfooter';
}
export interface ITableElement extends IContainerBaseElement {
  name: 'table';
  caption: string|ICaptionElement;
  thead: IRowContainerElement|ITrElement|ITrElement[];
  tbody: IRowContainerElement|ITrElement|ITrElement[];
  tfoot: IRowContainerElement|ITrElement|ITrElement[];
}
export class DocJson {
}
