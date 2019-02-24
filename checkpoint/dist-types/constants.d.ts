/// <reference types="node" />
export declare const DEPENDENCY_TYPES: string[];
export declare const RESOLUTIONS = "resolutions";
export declare const MANIFEST_FIELDS: string[];
export declare const SUPPORTED_NODE_VERSIONS = ">=8.5.0";
export declare const CHILD_CONCURRENCY = 5;
export declare const NODE_MODULES_FOLDER = "node_modules";
export declare const NODE_PACKAGE_JSON = "package.json";
export declare const DEFAULT_INDENT = "  ";
export declare const ENV_PATH_KEY: string;
export declare function getPathKey(platform: string, env: NodeJS.ProcessEnv): string;
