import {BuilderOptions} from '@pika/types';
import chalk from 'chalk';
import {Command} from 'commander';
import * as nodeFs from 'fs';
import * as path from 'path';
import * as rollup from 'rollup';
import Config from '../config.js';
import {DEFAULT_INDENT} from '../constants.js';
import {Reporter} from '../reporters/index.js';
import * as fs from '../util/fs.js';
import {generatePrettyManifest, generatePublishManifest} from '../util/normalize-manifest/for-publish.js';

type Flags = {
  publish?: boolean,
  out?: string,
};

export function setFlags(commander: Command) {
  commander.description('Prepares your package `pkg/` directory for publishing.');
  commander.usage('build [flags]');
  commander.option('-O, --out <path>', 'Where to write to');
  commander.option('-P, --publish', 'Whether to include publish-only builds like unpkg & types.');
}

export function hasWrapper(commander: Object, args: Array<string>): boolean {
  return true;
}

export class Build {
  constructor(flags: Flags, config: Config, reporter: Reporter) {
    this.flags = flags;
    this.config = config;
    this.reporter = reporter;
    this.totalNum = 0;
    this.out = path.resolve(config.cwd, flags.out || 'pkg/');

    if (this.out === this.config.cwd) {
      throw new Error('On publish, you cannot write to cwd because a package.json is created');
    }
  }

  out: string;
  flags: Flags;
  config: Config;
  reporter: Reporter;
  totalNum: number;

  async cleanup(): Promise<void> {
    const {out} = this;
    await fs.unlink(path.join(out, 'package.json'));
    await fs.unlink(path.join(out, 'assets'));
    await fs.unlink(path.join(out, 'dist-src'));
    await fs.unlink(path.join(out, 'dist-node'));
    await fs.unlink(path.join(out, 'dist-web'));
    await fs.unlink(path.join(out, 'dist-types'));
    await fs.unlink(path.join(out, 'dist-deno'));
  }

  async init(isFull?: boolean): Promise<void> {
    const {config, flags, reporter, out} = this;
    const {cwd} = config;

    const manifest = await config.manifest;
    const distRunners = await config.getDistributions();
    const [_, srcRunnerOptions] = distRunners[0];
    const defaultEnvLoc = path.join(out, 'dist-src/env.js');
    const builderConfig: Partial<BuilderOptions> = {
      out,
      cwd,
      reporter: {
        info: msg => console.log(chalk.dim(`      » ${msg}`)),
        warning: msg => console.log(chalk.yellow(`      » ${msg}`)),
        success: msg => console.log(chalk.green(`      » ${msg}`)),
        created: (filename: string, entrypoint?: string) =>
          console.log(
            `      📝 `,
            chalk.green(path.relative(cwd, filename)),
            entrypoint ? chalk.dim(`[${entrypoint}]`) : '',
          ),
      },
      isFull,
      manifest,
      src: {
        loc: path.join(out, 'dist-src'),
        entrypoint: path.join(out, 'dist-src', 'index.js'),
        options: srcRunnerOptions,
        files: await (async (): Promise<Array<string>> => {
          const ignoreSet = new Set<string>(srcRunnerOptions.exclude || []);
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
      rollup: (distName, options) => {
        const envReplace = `/env.${distName}.`;
        const envReplaceLoc = defaultEnvLoc.replace('/env.', envReplace);
        options.input = options.input || path.join(out, 'dist-src/index.js');
        options.plugins = options.plugins || [];
        if (nodeFs.existsSync(envReplaceLoc)) {
          options.plugins.unshift({
            name: 'env-rewrite', // this name will show up in warnings and errors
            resolveId: (importee: string, importer: string) => {
              // console.log(importee, importer, envLoc);
              // console.log('  ', envReplace, importer && path.resolve(importer, '..', importee));
              const resolvedImportee = path.resolve(importer, '..', importee);
              if (defaultEnvLoc && resolvedImportee === defaultEnvLoc) {
                return envReplaceLoc;
              }
              return null; // other ids should be handled as usually
            },
            load: () => null,
          });
        }
        return rollup.rollup(options);
      },
    };
    const steps: Array<(curr: number, total: number) => Promise<{bailout: boolean} | void>> = [];
    steps.push(async (curr: number, total: number) => {
      this.reporter.step(curr, total, 'Validating source');
      for (const [runner, options] of distRunners) {
        if (runner.validate) {
          const result = await runner.validate({
            ...builderConfig,
            options,
          });
          if (result instanceof Error) {
            throw result;
          }
        }
      }
    });

    steps.push(async (curr: number, total: number) => {
      this.reporter.step(curr, total, `Preparing pipeline`);
      await this.cleanup();
      console.log(`      🚿 `, chalk.green('pkg/'));
      for (const [runner, options] of distRunners) {
        await (runner.beforeBuild &&
          runner.beforeBuild({
            ...builderConfig,
            options,
          }));
      }
    });
    for (const [runner, options] of distRunners) {
      steps.push(async (curr: number, total: number) => {
        this.reporter.step(curr, total, `Running ${chalk.bold(runner.name)}`);
        // return Promise.resolve(
        await (runner.beforeJob &&
          runner.beforeJob({
            ...builderConfig,
            options,
          }));
        await (runner.build &&
          runner.build({
            ...builderConfig,
            options,
          }));
        await (runner.afterJob &&
          runner.afterJob({
            ...builderConfig,
            options,
          }));
        // ).catch(err => {
        // console.log(chalk.red(err.message));
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
    steps.push(async (curr: number, total: number) => {
      this.reporter.step(curr, total, `Finalizing package`);
      for (const [runner, options] of distRunners) {
        await (runner.afterBuild &&
          runner.afterBuild({
            ...builderConfig,
            options,
          }));
      }
      if (await fs.exists(path.join(cwd, 'README'))) {
        fs.copyFile(path.join(cwd, 'README'), path.join(out, 'README'));
        console.log(`      📝 `, chalk.green('pkg/README'));
      } else if (await fs.exists(path.join(cwd, 'README.md'))) {
        fs.copyFile(path.join(cwd, 'README.md'), path.join(out, 'README.md'));
        console.log(`      📝 `, chalk.green('pkg/README.md'));
      }

      const publishManifest = await generatePublishManifest(manifest, config, distRunners);
      if (out === cwd) {
        console.log(`NEW MANIFEST:\n\n`);
        console.log(generatePrettyManifest(publishManifest));
        console.log(`\n\n`);
      } else {
        await fs.writeFilePreservingEol(
          path.join(out, 'package.json'),
          JSON.stringify(publishManifest, null, DEFAULT_INDENT) + '\n',
        );
        console.log(`      📝 `, chalk.green('pkg/package.json'));
      }

      console.log(`      📦 `, chalk.green('pkg/'));
    });
    let currentStep = 0;
    for (const step of steps) {
      await step(++currentStep, steps.length);
    }
  }
}
export async function run(config: Config, reporter: Reporter, flags: Flags, args: Array<string>): Promise<void> {
  const isProduction = flags.publish;
  const builder = new Build(flags, config, reporter);
  await builder.init(isProduction);
}
