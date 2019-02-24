// import os from 'os';
// import * as path from 'path';
// import userHome from './util/user-home-dir.js';
// import {getCacheDir, getConfigDir, getDataDir} from './util/user-dirs.js';
export const DEPENDENCY_TYPES = ['devDependencies', 'dependencies', 'legacyDependencies'];
// export const OWNED_DEPENDENCY_TYPES = ['devDependencies', 'dependencies', 'legacyDependencies'];
export const RESOLUTIONS = 'resolutions';
export const MANIFEST_FIELDS = [RESOLUTIONS, ...DEPENDENCY_TYPES];
export const SUPPORTED_NODE_VERSIONS = '>=8.5.0';
// export const PIKA_REGISTRY = 'https://registry.npmjs.org';
// export const NPM_REGISTRY_RE = /https?:\/\/registry\.npmjs\.org/g;
// export const PIKA_DOCS = 'https://yarnpkg.com/en/docs/cli/';
// export const PIKA_INSTALLER_SH = 'https://yarnpkg.com/install.sh';
// export const PIKA_INSTALLER_MSI = 'https://yarnpkg.com/latest.msi';
// export const SELF_UPDATE_VERSION_URL = 'https://www.pikapkg.com/downloads/latest-version';
// // cache version, bump whenever we make backwards incompatible changes
// export const CACHE_VERSION = 3;
// // lockfile version, bump whenever we make backwards incompatible changes
// export const LOCKFILE_VERSION = 1;
// // max amount of network requests to perform concurrently
// export const NETWORK_CONCURRENCY = 8;
// // HTTP timeout used when downloading packages
// export const NETWORK_TIMEOUT = 30 * 1000; // in milliseconds
// // max amount of child processes to execute concurrently
export const CHILD_CONCURRENCY = 5;
// export const REQUIRED_PACKAGE_KEYS = ['name', 'version', '_uid'];
// function getPreferredCacheDirectories(): Array<string> {
//   const preferredCacheDirectories = [getCacheDir()];
//   if (process.getuid) {
//     // $FlowFixMe: process.getuid exists, dammit
//     preferredCacheDirectories.push(path.join(os.tmpdir(), `.pika-cache-${process.getuid()}`));
//   }
//   preferredCacheDirectories.push(path.join(os.tmpdir(), `.pika-cache`));
//   return preferredCacheDirectories;
// }
// export const PREFERRED_MODULE_CACHE_DIRECTORIES = getPreferredCacheDirectories();
// export const CONFIG_DIRECTORY = getConfigDir();
// export const DATA_DIRECTORY = getDataDir();
// export const LINK_REGISTRY_DIRECTORY = path.join(DATA_DIRECTORY, 'link');
// export const GLOBAL_MODULE_DIRECTORY = path.join(DATA_DIRECTORY, 'global');
// export const NODE_BIN_PATH = process.execPath;
export const NODE_MODULES_FOLDER = 'node_modules';
export const NODE_PACKAGE_JSON = 'package.json';
// export const PNP_FILENAME = '.pnp';
// export const POSIX_GLOBAL_PREFIX = `${process.env.DESTDIR || ''}/usr/local`;
// export const FALLBACK_GLOBAL_PREFIX = path.join(userHome, '.pika');
// export const META_FOLDER = '.pika-meta';
// export const INTEGRITY_FILENAME = '.pika-integrity';
// export const LOCKFILE_FILENAME = 'pika.lock';
// export const LEGACY_LOCKFILE_FILENAME = 'yarn.lock';
// export const METADATA_FILENAME = '.pika-metadata.json';
// export const TARBALL_FILENAME = '.pika-tarball.tgz';
// export const CLEAN_FILENAME = '.pikaclean';
// export const NPM_LOCK_FILENAME = 'package-lock.json';
// export const NPM_SHRINKWRAP_FILENAME = 'npm-shrinkwrap.json';
export const DEFAULT_INDENT = '  ';
// export const SINGLE_INSTANCE_PORT = 31997;
// export const SINGLE_INSTANCE_FILENAME = '.pika-single-instance';
export const ENV_PATH_KEY = getPathKey(process.platform, process.env);
export function getPathKey(platform, env) {
    let pathKey = 'PATH';
    // windows calls its path "Path" usually, but this is not guaranteed.
    if (platform === 'win32') {
        pathKey = 'Path';
        for (const key in env) {
            if (key.toLowerCase() === 'path') {
                pathKey = key;
            }
        }
    }
    return pathKey;
}
// export const VERSION_COLOR_SCHEME: {[key: string]: VersionColor} = {
//   major: 'red',
//   premajor: 'red',
//   minor: 'yellow',
//   preminor: 'yellow',
//   patch: 'green',
//   prepatch: 'green',
//   prerelease: 'red',
//   unchanged: 'white',
//   unknown: 'red',
// };
// export type VersionColor = 'red' | 'yellow' | 'green' | 'white';
// export type RequestHint = 'dev' | 'optional' | 'resolution' | 'workspaces';
