import chalk from 'chalk';
import * as path from 'path';
import { DEFAULT_INDENT } from '../constants.js';
import * as fs from '../util/fs.js';
import { generatePrettyManifest, generatePublishManifest } from '../util/normalize-manifest/for-publish.js';
export function hasWrapper() {
    return true;
}
export const examples = null;
export class Build {
    constructor(flags, config, reporter) {
        this.flags = flags;
        this.config = config;
        this.reporter = reporter;
        this.totalNum = 0;
        this.out = path.resolve(config.cwd, flags.out || 'pkg/');
        if (this.out === this.config.cwd) {
            throw new Error('On publish, you cannot write to cwd because a package.json is created');
        }
    }
    async cleanup() {
        const { out } = this;
        await fs.unlink(path.join(out, '*'));
    }
    async init(isFull) {
        const { config, out, reporter, flags } = this;
        const { cwd } = config;
        const outPretty = path.relative(cwd, out) + path.sep;
        const manifest = await config.manifest;
        const { sourcemap } = manifest['@pika/pack'] || { sourcemap: true };
        const distRunners = await config.getDistributions();
        const builderConfig = {
            out,
            cwd,
            reporter: {
                info: msg => reporter.log(chalk.dim(`      » ${msg}`)),
                warning: msg => reporter.log(chalk.yellow(`      » ${msg}`)),
                success: msg => reporter.log(chalk.green(`      » ${msg}`)),
                created: (filename, entrypoint) => reporter.log(`      📝  ${chalk.green(path.relative(cwd, filename))} ${entrypoint ? chalk.dim(`[${entrypoint}]`) : ''}`),
            },
            isFull,
            manifest,
            src: {
                loc: path.join(out, 'dist-src'),
                entrypoint: path.join(out, 'dist-src', 'index.js'),
                // TODO: Deprecated, remove
                options: {},
                // TODO: Deprecated, remove
                files: await (async () => {
                    const ignoreSet = new Set([]);
                    ignoreSet.add('**/*/README.md');
                    const files = await fs.glob(`src/**/*`, {
                        cwd,
                        nodir: true,
                        absolute: true,
                        ignore: Array.from(ignoreSet).map(g => path.join('src', g)),
                    });
                    return files.filter(fileAbs => !fileAbs.endsWith('.d.ts'));
                })(),
            },
        };
        const steps = [];
        steps.push(async (curr, total) => {
            this.reporter.step(curr, total, 'Validating source');
            for (const [runner, options] of distRunners) {
                if (runner.validate) {
                    const result = await runner.validate({
                        ...builderConfig,
                        options: { sourcemap, ...options },
                    });
                    if (result instanceof Error) {
                        throw result;
                    }
                }
            }
        });
        steps.push(async (curr, total) => {
            this.reporter.step(curr, total, `Preparing pipeline`);
            await this.cleanup();
            reporter.log(`      ❇️  ${chalk.green(outPretty)}`);
            for (const [runner, options] of distRunners) {
                await (runner.beforeBuild &&
                    runner.beforeBuild({
                        ...builderConfig,
                        options: { sourcemap, ...options },
                    }));
            }
        });
        if (distRunners.length === 0) {
            steps.push(async (curr, total) => {
                this.reporter.step(curr, total, `Pipeline is empty! See ${chalk.underline('https://github.com/pikapkg/pack')} for help getting started`);
            });
        }
        for (const [runner, options] of distRunners) {
            steps.push(async (curr, total) => {
                this.reporter.step(curr, total, `Running ${chalk.bold(runner.name)}`);
                // return Promise.resolve(
                try {
                    await (runner.beforeJob &&
                        runner.beforeJob({
                            ...builderConfig,
                            options: { sourcemap, ...options },
                        }));
                    await (runner.build &&
                        runner.build({
                            ...builderConfig,
                            options: { sourcemap, ...options },
                        }));
                    await (runner.afterJob &&
                        runner.afterJob({
                            ...builderConfig,
                            options: { sourcemap, ...options },
                        }));
                }
                catch (err) {
                    if (flags.force) {
                        console.log('      ❗️  ', chalk.red(err.message), chalk.dim('--force, continuing...'));
                    }
                    else {
                        throw err;
                    }
                }
                // ).catch(err => {
                // log(chalk.red(err.message));
                // reporter.log(
                //   reporter.lang("distFailed", runner.name, err.code, err.message),
                //   { force: true }
                // );
                // if (err.forceExit === true) {
                // reporter.log(reporter.lang("distExiting"));
                // throw err;
                // return;
                // }
                // reporter.log(reporter.lang("distContinuing"));
                // });
            });
        }
        steps.push(async (curr, total) => {
            this.reporter.step(curr, total, `Finalizing package`);
            for (const [runner, options] of distRunners) {
                await (runner.afterBuild &&
                    runner.afterBuild({
                        ...builderConfig,
                        options: { sourcemap, ...options },
                    }));
            }
            if (await fs.exists(path.join(cwd, 'CHANGELOG'))) {
                fs.copyFile(path.join(cwd, 'CHANGELOG'), path.join(out, 'CHANGELOG'));
                reporter.log(chalk.dim(`      » copying CHANGELOG...`));
            }
            else if (await fs.exists(path.join(cwd, 'CHANGELOG.md'))) {
                fs.copyFile(path.join(cwd, 'CHANGELOG.md'), path.join(out, 'CHANGELOG.md'));
                reporter.log(chalk.dim(`      » copying CHANGELOG.md...`));
            }
            if (await fs.exists(path.join(cwd, 'LICENSE'))) {
                fs.copyFile(path.join(cwd, 'LICENSE'), path.join(out, 'LICENSE'));
                reporter.log(chalk.dim(`      » copying LICENSE...`));
            }
            else if (await fs.exists(path.join(cwd, 'LICENSE.md'))) {
                fs.copyFile(path.join(cwd, 'LICENSE.md'), path.join(out, 'LICENSE.md'));
                reporter.log(chalk.dim(`      » copying LICENSE.md...`));
            }
            if (await fs.exists(path.join(cwd, 'README'))) {
                fs.copyFile(path.join(cwd, 'README'), path.join(out, 'README'));
                reporter.log(chalk.dim(`      » copying README...`));
            }
            else if (await fs.exists(path.join(cwd, 'README.md'))) {
                fs.copyFile(path.join(cwd, 'README.md'), path.join(out, 'README.md'));
                reporter.log(chalk.dim(`      » copying README.md...`));
            }
            const publishManifest = await generatePublishManifest(config._manifest, config, distRunners);
            if (out === cwd) {
                reporter.log(`NEW MANIFEST:\n\n`);
                reporter.log(generatePrettyManifest(publishManifest));
                reporter.log(`\n\n`);
            }
            else {
                await fs.writeFilePreservingEol(path.join(out, 'package.json'), JSON.stringify(publishManifest, null, DEFAULT_INDENT) + '\n');
                reporter.log(`      📝  ` + chalk.green(outPretty + 'package.json'));
            }
            reporter.log(`      📦  ` + chalk.green(outPretty));
        });
        let currentStep = 0;
        for (const step of steps) {
            await step(++currentStep, steps.length);
        }
    }
}
export async function run(config, reporter, flags, args) {
    const isProduction = flags.publish;
    const builder = new Build(flags, config, reporter);
    await builder.init(isProduction);
}
