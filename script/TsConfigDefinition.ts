import { LoadResult } from 'tsconfig';

/**
 *
 * @typedef JsxCodeGeneration
 * @type {("preserve" | "react" | "react-native")}
*/
export type JsxCodeGeneration = "preserve" | "react" | "react-native";

/**
 *
 * @typedef KnownModuleName
 * @type {("commonjs" | "amd" | "umd" | "system" | "es6" | "es2015" | "esnext" | "none")}
 */
export type KnownModuleName = "commonjs" | "amd" | "umd" | "system" | "es6" | "es2015" | "esnext" | "none";

/**
 * 
 * @typedef NewLineType
 * @type {("CRLF" | "LF" | "crlf" | "lf")}
 */
export type NewLineType = "CRLF" | "LF" | "crlf" | "lf";

/**
 * 
 * @typedef CompilerTargetType
 * @type {("es3" | "es5" | "es6" | "es2015" | "es2016" | "es2017" | "es2018" | "es2019" | "es2020" | "esnext")}
 */
export type CompilerTargetType = "es3" | "es5" | "es6" | "es2015" | "es2016" | "es2017" | "es2018" | "es2019" | "es2020" | "esnext";

/**
 * 
 * @typedef ModuleResolutionType
 * @type {("node" | "classic")}
 */
export type ModuleResolutionType = "node" | "classic";

/**
 * Name of module code generation.
 * @typedef CompileIncludeLibName
 * @type {("es5" | "es6" | "es2015" | "es7" | "es2016" | "es2017" | "es2018" | "es2019" | "es2020" | "esnext" | "dom" | "dom.iterable" | "webworker" | "webworker.importscripts" | "scripthost" | "es2015.core" |
 *     "es2015.collection" | "es2015.generator" | "es2015.iterable" | "es2015.promise" | "es2015.proxy" | "es2015.reflect" | "es2015.symbol" | "es2015.symbol.wellknown" | "es2016.array.include" | "es2017.object" | "es2017.intl" |
 *     "es2017.sharedmemory" | "es2017.string" | "es2017.typedarrays" | "es2018.asynciterable" | "es2018.intl" | "es2018.promise" | "es2018.regexp" | "es2019.array" | "es2019.object" | "es2019.string" | "es2019.symbol" | "es2020.string" |
 *     "es2020.symbol.wellknown" | "esnext.asynciterable" | "esnext.array" | "esnext.bigint" | "esnext.intl" | "esnext.symbol")}
 */
export type CompileIncludeLibName = "es5" | "es6" | "es2015" | "es7" | "es2016" | "es2017" | "es2018" | "es2019" | "es2020" | "esnext" | "dom" | "dom.iterable" | "webworker" | "webworker.importscripts" | "scripthost" | "es2015.core" |
    "es2015.collection" | "es2015.generator" | "es2015.iterable" | "es2015.promise" | "es2015.proxy" | "es2015.reflect" | "es2015.symbol" | "es2015.symbol.wellknown" | "es2016.array.include" | "es2017.object" | "es2017.intl" |
    "es2017.sharedmemory" | "es2017.string" | "es2017.typedarrays" | "es2018.asynciterable" | "es2018.intl" | "es2018.promise" | "es2018.regexp" | "es2019.array" | "es2019.object" | "es2019.string" | "es2019.symbol" | "es2020.string" |
    "es2020.symbol.wellknown" | "esnext.asynciterable" | "esnext.array" | "esnext.bigint" | "esnext.intl" | "esnext.symbol";

/**
 * TypeScript language server plugin.
 * @interface IPluginReference
 */
export interface IPluginReference {
    /**
     * Plugin name.
     * @type {string}
     * @memberof IPluginReference
     */
    name: string;
};

/**
 * Instructs the TypeScript compiler how to compile .ts files.
 * @interface ICompilerOptions
 */
export interface ICompilerOptions {
    /**
     * The character set of the input files.
     * @type {string}
     * @memberof ICompilerOptions
     */
    charset?: string,
    /**
     * Enables building for project references.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    composite?: boolean,
    /**
     * Generates corresponding d.ts files.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    declaration?: boolean,
    /**
     * Specify output directory for generated declaration files.
     * @type {string}
     * @memberof ICompilerOptions
     * @description Requires TypeScript version 2.0 or later.
     */
    declarationDir?: string,
    /**
     * Show diagnostic information.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    diagnostics?: boolean,
    /**
     * Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    emitBOM?: boolean,
    /**
     * Only emit '.d.ts' declaration files.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    emitDeclarationOnly?: boolean,
    /**
     * Enable incremental compilation.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    incremental?: boolean,
    /**
     * Specify file to store incremental compilation information.
     * @type {string}
     * @memberof ICompilerOptions
     */
    tsBuildInfoFile?: string,
    /**
     * Emit a single file with source maps instead of having a separate file.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    inlineSourceMap?: boolean,
    /**
     * Emit the source alongside the sourcemaps within a single file.
     * @type {boolean}
     * @memberof ICompilerOptions
     * @description requires --inlineSourceMap to be set.
     */
    inlineSources?: boolean,
    /**
     * Specify JSX code generation: 'preserve', 'react', or 'react-native'.
     * @type {JsxCodeGeneration}
     * @memberof ICompilerOptions
     */
    jsx?: JsxCodeGeneration,
    /**
     * Specifies the object invoked for createElement and __spread when targeting 'react' JSX emit.
     * @type {string}
     * @memberof ICompilerOptions
     */
    reactNamespace?: string,
    /**
     * Print names of files part of the compilation.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    listFiles?: boolean,
    /**
     * Specifies the location where debugger should locate map files instead of generated locations.
     * @type {string}
     * @memberof ICompilerOptions
     */
    mapRoot?: string,
    /**
     * Specify module code generation.
     * @type {KnownModuleName}
     * @memberof ICompilerOptions
     */
    module?: KnownModuleName,
    /**
     * Specifies the end of line sequence to be used when emitting files.
     * @type {NewLineType}
     * @memberof ICompilerOptions
     */
    newLine?: NewLineType,
    /**
     * Do not emit output.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    noEmit?: boolean,
    /**
     * Do not generate custom helper functions like __extends in compiled output.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    noEmitHelpers?: boolean,
    /**
     * Do not emit outputs if any type checking errors were reported.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    noEmitOnError?: boolean,
    /**
     * Warn on expressions and declarations with an implied 'any' type.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    noImplicitAny?: boolean,
    /**
     * Raise error on 'this' expressions with an implied any type.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    noImplicitThis?: boolean,
    /**
     * Report errors on unused locals.
     * @type {boolean}
     * @memberof ICompilerOptions
     * @description Requires TypeScript version 2.0 or later.
     */
    noUnusedLocals?: boolean,
    /**
     * Report errors on unused parameters.
     * @type {boolean}
     * @memberof ICompilerOptions
     * @description Requires TypeScript version 2.0 or later.
     */
    noUnusedParameters?: boolean,
    /**
     * Do not include the default library file (lib.d.ts).
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    noLib?: boolean,
    /**
     * Do not add triple-slash references or module import targets to the list of compiled files.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    noResolve?: boolean,
    /**
     * Disable strict checking of generic signatures in function types.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    noStrictGenericChecks?: boolean,
    /**
     * (undocumented)
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    skipDefaultLibCheck?: boolean,
    /**
     * Skip type checking of declaration files.
     * @type {boolean}
     * @memberof ICompilerOptions
     * @description Requires TypeScript version 2.0 or later.
     */
    skipLibCheck?: boolean,
    /**
     * Concatenate and emit output to single file.
     * @type {string}
     * @memberof ICompilerOptions
     */
    outFile?: string,
    /**
     * Redirect output structure to the directory.
     * @type {string}
     * @memberof ICompilerOptions
     */
    outDir?: string,
    /**
     * Do not erase const enum declarations in generated code.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    preserveConstEnums?: boolean,
    /**
     * Do not resolve symlinks to their real path; treat a symlinked file like a real one.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    preserveSymlinks?: boolean,
    /**
     * Keep outdated console output in watch mode instead of clearing the screen.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    preserveWatchOutput?: boolean,
    /**
     * Stylize errors and messages using color and context (experimental).
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    pretty?: boolean,
    /**
     * Do not emit comments to output.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    removeComments?: boolean,
    /**
     * Specifies the root directory of input files.
     * @type {string}
     * @memberof ICompilerOptions
     * @description Use to control the output directory structure with --outDir.
     */
    rootDir?: string,
    /**
     * Unconditionally emit imports for unresolved files.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    isolatedModules?: boolean,
    /**
     * Generates corresponding '.map' file.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    sourceMap?: boolean,
    /**
     * Specifies the location where debugger should locate TypeScript files instead of source locations.
     * @type {string}
     * @memberof ICompilerOptions
     */
    sourceRoot?: string,
    /**
     * Suppress excess property checks for object literals.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    suppressExcessPropertyErrors?: boolean,
    /**
     * Suppress noImplicitAny errors for indexing objects lacking index signatures.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    suppressImplicitAnyIndexErrors?: boolean,
    /**
     * Do not emit declarations for code that has an '@internal' annotation.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    stripInternal?: boolean,
    /**
     * Specify ECMAScript target version.
     * @type {CompilerTargetType}
     * @memberof ICompilerOptions
     */
    target?: CompilerTargetType,
    /**
     * Watch input files.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    watch?: boolean,
    /**
     * Enables experimental support for ES7 decorators.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    experimentalDecorators?: boolean,
    /**
     * Emit design-type metadata for decorated declarations in source.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    emitDecoratorMetadata?: boolean,
    /**
     * Specifies module resolution strategy: 'node' (Node) or 'classic' (TypeScript pre 1.6).
     * @type {ModuleResolutionType}
     * @memberof ICompilerOptions
     * @default: "classic"
     */
    moduleResolution?: ModuleResolutionType,
    /**
     * Do not report errors on unused labels.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    allowUnusedLabels?: boolean,
    /**
     * Report error when not all code paths in function return a value.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    noImplicitReturns?: boolean,
    /**
     * Report errors for fallthrough cases in switch statement.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    noFallthroughCasesInSwitch?: boolean,
    /**
     * Do not report errors on unreachable code.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    allowUnreachableCode?: boolean,
    /**
     * Disallow inconsistently-cased references to the same file.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    forceConsistentCasingInFileNames?: boolean,
    /**
     * Base directory to resolve non-relative module names.
     * @type {string}
     * @memberof ICompilerOptions
     */
    baseUrl?: string,
    /**
     * Specify path mapping to be computed relative to baseUrl option.
     * @type {string[]}
     * @memberof ICompilerOptions
     */
    paths?: string[],
    /**
     * List of TypeScript language server plugins to load
     * @type {IPluginReference[]}
     * @memberof ICompilerOptions
     * @description Requires TypeScript version 2.3 or later.
     */
    plugins?: IPluginReference[],
    /**
     * Specify list of root directories to be used when resolving modules.
     * @type {string[]}
     * @memberof ICompilerOptions
     */
    rootDirs?: string[],
    /**
     * Specify list of directories for type definition files to be included.
     * @type {string[]}
     * @memberof ICompilerOptions
     * @description Requires TypeScript version 2.0 or later.
     */
    typeRoots?: string[],
    /**
     * Type declaration files to be included in compilation.
     * @type {string[]}
     * @memberof ICompilerOptions
     * @description Requires TypeScript version 2.0 or later.
     */
    types?: string[],
    /**
     * Enable tracing of the name resolution process.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    traceResolution?: boolean,
    /**
     * Allow javascript files to be compiled.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    allowJs?: boolean,
    /**
     * Do not truncate error messages.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    noErrorTruncation?: boolean,
    /**
     * Allow default imports from modules with no default export.
     * @type {boolean}
     * @memberof ICompilerOptions
     * @description This does not affect code emit, just typechecking.
     */
    allowSyntheticDefaultImports?: boolean,
    /**
     * Do not emit 'use strict' directives in module output.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    noImplicitUseStrict?: boolean,
    /**
     * Enable to list all emitted files.
     * @type {boolean}
     * @memberof ICompilerOptions
     * @description Requires TypeScript version 2.0 or later.
     */
    listEmittedFiles?: boolean,
    /**
     * Disable size limit for JavaScript project.
     * @type {boolean}
     * @memberof ICompilerOptions
     * @default false
     * @description Requires TypeScript version 2.0 or later.
     */
    disableSizeLimit?: boolean,
    /**
     * Specify library file to be included in the compilation.
     * @type {string[]}
     * @memberof ICompilerOptions
     * @description Requires TypeScript version 2.0 or later.
     */
    lib?: CompileIncludeLibName[],
    /**
     * Enable strict null checks.
     * @type {boolean}
     * @memberof ICompilerOptions
     * @description Requires TypeScript version 2.0 or later.
     */
    strictNullChecks?: boolean,
    /**
     * The maximum dependency depth to search under node_modules and load JavaScript files.
     * @type {number}
     * @memberof ICompilerOptions
     * @default 0
     * @description Only applicable with --allowJs.
     */
    maxNodeModuleJsDepth?: number,
    /**
     * Import emit helpers (e.g. '__extends', '__rest', etc..) from tslib.
     * @type {boolean}
     * @memberof ICompilerOptions
     * @description Requires TypeScript version 2.1 or later.
     */
    importHelpers?: boolean,
    /**
     * Specify the JSX factory function to use when targeting react JSX emit, e.g. 'React.createElement' or 'h'.
     * @type {string}
     * @memberof ICompilerOptions
     * @default "React.createElement"
     * @description Requires TypeScript version 2.1 or later.
     */
    jsxFactory?: string,
    /**
     * Parse in strict mode and emit 'use strict' for each source file.
     * @type {boolean}
     * @memberof ICompilerOptions
     * @description Requires TypeScript version 2.1 or later.
     */
    alwaysStrict?: boolean,
    /**
     * Enable all strict type checking options.
     * @type {boolean}
     * @memberof ICompilerOptions
     * @description Requires TypeScript version 2.3 or later.
     */
    strict?: boolean,
    /**
     * Enable stricter checking of of the `bind`, `call`, and `apply` methods on functions.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    strictBindCallApply?: boolean,
    /**
     * Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'.
     * @type {boolean}
     * @memberof ICompilerOptions
     * @description Requires TypeScript version 2.3 or later.
     */
    downlevelIteration?: boolean,
    /**
     * Report errors in .js files. Requires TypeScript version 2.3 or later.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    checkJs?: boolean,
    /**
     * Disable bivariant parameter checking for function types.
     * @type {boolean}
     * @memberof ICompilerOptions
     * @description Requires TypeScript version 2.6 or later.
     */
    strictFunctionTypes?: boolean,
    /**
     * Ensure non-undefined class properties are initialized in the constructor.
     * @type {boolean}
     * @memberof ICompilerOptions
     * @description Requires TypeScript version 2.7 or later.
     */
    strictPropertyInitialization?: boolean,
    /**
     * Emit '__importStar' and '__importDefault' helpers for runtime babel ecosystem compatibility and enable '--allowSyntheticDefaultImports' for typesystem compatibility.
     * @type {boolean}
     * @memberof ICompilerOptions
     * @description Requires TypeScript version 2.7 or later.
     */
    esModuleInterop?: boolean,
    /**
     * Allow accessing UMD globals from modules.
     * @type {boolean}
     * @memberof ICompilerOptions
     */
    allowUmdGlobalAccess?: boolean,
    /**
     * Resolve 'keyof' to string valued property names only (no numbers or symbols).
     * @type {boolean}
     * @memberof ICompilerOptions
     * @description Requires TypeScript version 2.9 or later.
     */
    keyofStringsOnly?: boolean,
    /**
     * Generates a sourcemap for each corresponding '.d.ts' file.
     * @type {boolean}
     * @memberof ICompilerOptions
     * @description Requires TypeScript version 2.9 or later.
     */
    declarationMap?: boolean,
    /**
     * Include modules imported with '.json' extension.
     * @type {boolean}
     * @memberof ICompilerOptions
     * @description Requires TypeScript version 2.9 or later.
     */
    resolveJsonModule?: boolean,
}

/**
 * Auto type (.d.ts) acquisition options for this project.
 * @interface ITypeAcquisition
 */
export interface ITypeAcquisition {
    /**
     * Enable auto type acquisition
     * @type {boolean}
     * @memberof ITypeAcquisition
     * @default false
     */
    enable?: boolean;
    /**
     * Specifies a list of type declarations to be included in auto type acquisition. Ex. ["jquery", "lodash"]
     * @type {string[]}
     * @memberof ITypeAcquisition
     */
    include?: string[];
    /**
     * Specifies a list of type declarations to be excluded from auto type acquisition. Ex. ["jquery", "lodash"]
     * @type {string[]}
     * @memberof ITypeAcquisition
     */
    exclude?: string[];
}

/**
 * Project reference.
 * @interface IProjectReference
 */
export interface IProjectReference {
    /**
     * Path to referenced tsconfig or to folder containing tsconfig.
     * @type {string}
     * @memberof ITypeAcquisition
     */
    path: string;
}

/**
 * TypeScript compiler's configuration file
 * @interface ITSConfig
 */
export interface ITSConfig {
    /**
     * Enable Compile-on-Save for this project.
     * @type {string}
     * @memberof ITSConfig
     */
    compileOnSave?: boolean;
    /**
     * Instructs the TypeScript compiler how to compile .ts files.
     * @type {string}
     * @memberof ITSConfig
     */
    compilerOptions: ICompilerOptions;
    /**
     * Auto type (.d.ts) acquisition options for this project.
     * @type {string}
     * @memberof ITSConfig
     * @description Requires TypeScript version 2.1 or later.
     */
    typeAcquisition?: ITypeAcquisition;
    /**
     * Path to base configuration file to inherit from.
     * @type {string}
     * @memberof ITSConfig
     * @description Requires TypeScript version 2.1 or later.
     */
    extends?: string;
    /**
     * Specifies an explicit list of files to be included from compilation.
     * @type {string[]}
     * @memberof ITSConfig
     * @description If no 'files' or 'include' property is present in a tsconfig.json, the compiler defaults to including all files in the containing directory and subdirectories except those specified by 'exclude'. When a 'files' property is specified, only those files and those specified by 'include' are included.
     */
    files?: string[];
    /**
     * Specifies a list of files to be excluded from compilation. The 'exclude' property only affects the files included via the 'include' property and not the 'files' property.
     * @type {string[]}
     * @memberof ITSConfig
     * @description Glob patterns require TypeScript version 2.0 or later.
     */
    exclude?: string[];
    /**
     * Specifies a list of glob patterns that match files to be included in compilation.
     * @type {string[]}
     * @memberof ITSConfig
     * @description If no 'files' or 'include' property is present in a tsconfig.json, the compiler defaults to including all files in the containing directory and subdirectories except those specified by 'exclude'.
     *  Requires TypeScript version 2.0 or later.
     */
    include?: string[];
    /**
     * Referenced projects. Requires TypeScript version 3.0 or later.
     * @type {IProjectReference[]}
     * @memberof ITSConfig
     */
    references?: IProjectReference[];
}

export interface LoadResultTsConfig extends LoadResult {
    config: ITSConfig;
}
