import { Reporter } from './reporters/index.js';
import Config from './config.js';
export declare type CLIFunction = (config: Config, reporter: Reporter, flags: Object, args: Array<string>) => CLIFunctionReturn;
declare type _CLIFunctionReturn = boolean;
export declare type CLIFunctionReturn = _CLIFunctionReturn | Promise<_CLIFunctionReturn>;
export declare type PersonObject = {
    email?: string;
    name?: string;
    url?: string;
};
declare type Dependencies = {
    [key: string]: string;
};
export declare type Manifest = {
    name: string;
    version: string;
    description?: string;
    keywords?: string[];
    sideEffects?: boolean;
    private?: boolean;
    distributions?: any;
    author?: {
        name?: string;
        email?: string;
        url?: string;
    };
    homepage?: string;
    flat?: boolean;
    license?: string;
    licenseText?: string;
    noticeText?: string;
    readme?: string;
    readmeFilename?: string;
    repository?: {
        type: 'git';
        url: string;
    };
    bugs?: {
        url: string;
    };
    dist?: {
        tarball: string;
        shasum: string;
    };
    directories?: {
        man: string;
        bin: string;
    };
    man?: Array<string>;
    bin?: {
        [name: string]: string;
    };
    scripts?: {
        [name: string]: string;
    };
    engines?: {
        [engineName: string]: string;
    };
    os?: Array<string>;
    cpu?: Array<string>;
    dependencies?: Dependencies;
    devDependencies?: Dependencies;
    peerDependencies?: Dependencies;
    optionalDependencies?: Dependencies;
    bundleDependencies?: Array<string>;
    bundledDependencies?: Array<string>;
    installConfig?: {
        pnp?: boolean;
    };
    deprecated?: string;
    files?: Array<string>;
    main?: string;
    fresh?: boolean;
    prebuiltVariants?: {
        [filename: string]: string;
    };
};
export declare type Dependency = {
    name: string;
    current: string;
    wanted: string;
    latest: string;
    url: string;
    hint?: string;
    range: string;
    upgradeTo: string;
    workspaceName: string;
    workspaceLoc: string;
};
export {};
