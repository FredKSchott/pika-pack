import {Reporter} from './reporters/index.js';
import Config from './config.js';

export type CLIFunction = (config: Config, reporter: Reporter, flags: Object, args: Array<string>) => CLIFunctionReturn;

type _CLIFunctionReturn = boolean;
export type CLIFunctionReturn = _CLIFunctionReturn | Promise<_CLIFunctionReturn>;

// person object, the exploded version of a `maintainers`/`authors` field
export type PersonObject = {
  email?: string;
  name?: string;
  url?: string;
};

// `dependencies` field in package info
type Dependencies = {
  [key: string]: string;
};

// package.json
export type Manifest = {
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

  // the package reference that
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

  // This flag is true when we add a new package with `pika add <mypackage>`.
  // We need to preserve the flag because we print a list of new packages in
  // the end of the add command
  fresh?: boolean;

  prebuiltVariants?: {[filename: string]: string};
};

// Used by outdated and upgrade-interactive
export type Dependency = {
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
