export declare enum JsTokenType {
    Unknown = 0,
    Comment = 1,
    Identifier = 2,
    Number = 3,
    String = 4,
    OpenGroup = 5,
    CloseGroup = 6,
    Regex = 7,
    Terminator = 8,
    NewLine = 9,
    Operator = 10,
    WhiteSpace = 11
}
export interface IParsedToken {
    value: any;
    code: string;
    type: JsTokenType;
}
export interface ITokenChain {
    previous?: ITokenChain;
    current: IParsedToken;
    next?: ITokenChain;
}
export interface ITryParseTokenCB {
    (code: string, context: JsCodeParseContext): IParsedToken | undefined;
}
interface IJsCodeParseOptions {
    allowIdentifierEscapeSequence?: boolean;
    allowBackquoteMultiline?: boolean;
}
export declare class JsCodeParseContext {
    private _tokenChain;
    readonly tokenChain: ITokenChain | undefined;
    private _tokenParseInfo;
    private _position;
    readonly position: number;
    private _code;
    readonly code: string;
    constructor(code: string, options?: IJsCodeParseOptions);
    ParseNextToken(): IParsedToken | undefined;
}
export {};
//# sourceMappingURL=index.d.ts.map