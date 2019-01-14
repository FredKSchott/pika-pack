
declare function __non_webpack_require__(m: string): any;

import * as path from 'path';
import * as constants from './constants';
import { MessageError } from './errors';
import { Manifest } from './types';
import * as fs from './util/fs';
import normalizeManifest from './util/normalize-manifest/index';
import BaseReporter from './reporters/base-reporter';
import detectIndent from 'detect-indent';
import executeLifecycleScript from './util/execute-lifecycle-script';
import importFrom from 'import-from';
import * as srcBuilder from '@pika/src-builder';

export type ConfigOptions = {
  cwd?: string,
  _cacheRootFolder?: string,
  tempFolder?: string,
  ignoreScripts?: boolean,
  ignorePlatform?: boolean,
  ignoreEngines?: boolean,
  // cafile??: string,
  production?: boolean,
  binLinks?: boolean,
  // scriptsPrependNodePath?: boolean,
  commandName?: string,
  otp?: string,
};


export default class Config {
  cwd: string;
  reporter: BaseReporter;
  _manifest: any;
  manifest: Manifest;
  manifestIndent?: string;

  constructor(reporter: BaseReporter, cwd?: string) {
    this.reporter = reporter;
    // Ensure the cwd is always an absolute path.
    this.cwd = path.resolve(cwd || process.cwd());
  }

  async loadPackageManifest() {
    const loc = path.join(this.cwd, constants.NODE_PACKAGE_JSON);
    if (await fs.exists(loc)) {
      const info = await this.readJson(loc, fs.readJsonAndFile);
      this._manifest = info.object;
      this.manifestIndent = detectIndent(info.content).indent || undefined;
      this.manifest = await normalizeManifest(info.object, this.cwd, this, true);
      return this.manifest;
    } else {
      return null;
    }
  }

  readJson(loc: string, factory: (filename: string) => Promise<any> = fs.readJson): Promise<any> {
    try {
      return factory(loc);
    } catch (err) {
      if (err instanceof SyntaxError) {
        throw new MessageError(this.reporter.lang('jsonError', loc, err.message));
      } else {
        throw err;
      }
    }
  }

  async savePackageManifest(newManifestData: object) {
    const loc = path.join(this.cwd, constants.NODE_PACKAGE_JSON);
    const manifest = {
      ...this._manifest,
      ...newManifestData
    };
    await fs.writeFilePreservingEol(loc, JSON.stringify(manifest, null, this.manifestIndent || constants.DEFAULT_INDENT) + '\n');
    return this.loadPackageManifest();
  }

  async getDistributions(): Promise<Array<[any, any]>> {
    const raw = this.manifest.distributions || {};
    raw.defaults = raw.defaults || {};
    raw.plugins = raw.plugins || [];

    async function cleanRawDistObject(rawVal, defaultRunner, cwd, canBeFalsey): Promise<false | any[]> {
      if (rawVal === undefined || rawVal === true) {
        if (!defaultRunner) {
          throw new Error('no plugin default');
        }
          return [{...defaultRunner, name: '@pika/src-builder'}, {}];
      }
      if (Array.isArray(rawVal)) {
        if (rawVal[0] === true && defaultRunner) {
          return [{...defaultRunner, name: '@pika/src-builder'}, rawVal[1] || {}];
        }
        let importStr = (rawVal[0].startsWith('./') ||rawVal[0].startsWith('../')) ? path.join(cwd, rawVal[0]) : rawVal[0];
        return [{...importFrom(cwd, importStr), name: rawVal[0]}, rawVal[1] || {}];
      }
      if (rawVal && typeof rawVal === 'object') {
        if (!defaultRunner) {
          throw new Error('no plugin default');
        }
        return [defaultRunner, rawVal];
      }
      if (typeof rawVal === 'string') {
        return [{build: ({cwd}) => {
          return executeLifecycleScript({
          config: this,
          cwd,
          cmd: rawVal,
          isInteractive: false});
        }}, {}];
      }
      if (!rawVal && !canBeFalsey) {
        throw new Error('Cannot be false');
      }
      return false;
    }
    return (await Promise.all([
      ...(raw.assets || []).map(rawVal => {
        return cleanRawDistObject(rawVal, false, this.cwd, false);
      }),
      ...(raw.src || []).map(rawVal => {
        return cleanRawDistObject(rawVal, srcBuilder, this.cwd, false);
      }),
      ...(raw.plugins || []).map(rawVal => {
        return cleanRawDistObject(rawVal, false, this.cwd, false);
      }),
    ])).filter(Boolean);
  }
}

