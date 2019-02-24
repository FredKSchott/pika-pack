import * as path from 'path';
import * as constants from './constants.js';
import { MessageError } from '@pika/types';
import * as fs from './util/fs.js';
import normalizeManifest from './util/normalize-manifest/index.js';
import detectIndent from 'detect-indent';
import executeLifecycleScript from './util/execute-lifecycle-script.js';
import importFrom from 'import-from';
export default class Config {
    constructor(reporter, cwd) {
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
        }
        else {
            return null;
        }
    }
    readJson(loc, factory = fs.readJson) {
        try {
            return factory(loc);
        }
        catch (err) {
            if (err instanceof SyntaxError) {
                throw new MessageError(this.reporter.lang('jsonError', loc, err.message));
            }
            else {
                throw err;
            }
        }
    }
    async savePackageManifest(newManifestData) {
        const loc = path.join(this.cwd, constants.NODE_PACKAGE_JSON);
        const manifest = Object.assign({}, this._manifest, newManifestData);
        await fs.writeFilePreservingEol(loc, JSON.stringify(manifest, null, this.manifestIndent || constants.DEFAULT_INDENT) + '\n');
        return this.loadPackageManifest();
    }
    async getDistributions() {
        const raw = this.manifest[`@pika/pack`] || {};
        raw.defaults = raw.defaults || {};
        raw.plugins = raw.plugins || [];
        async function cleanRawDistObject(rawVal, cwd, canBeFalsey) {
            if (Array.isArray(rawVal)) {
                let importStr = (rawVal[0].startsWith('./') || rawVal[0].startsWith('../')) ? path.join(cwd, rawVal[0]) : rawVal[0];
                return [Object.assign({}, importFrom(cwd, importStr), { name: rawVal[0] }), rawVal[1] || {}];
            }
            if (typeof rawVal === 'string') {
                return [{ build: ({ cwd }) => {
                            return executeLifecycleScript({
                                config: this,
                                cwd,
                                cmd: rawVal,
                                isInteractive: false
                            });
                        } }, {}];
            }
            if (!rawVal && !canBeFalsey) {
                throw new Error('Cannot be false');
            }
            return false;
        }
        return (await Promise.all([
            ...((raw.pipeline || []).map(rawVal => {
                return cleanRawDistObject(rawVal, this.cwd, false);
            })),
        ])).filter(Boolean);
    }
}
