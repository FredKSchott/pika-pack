import chalk from 'chalk';
import {Command} from 'commander';
import execa from 'execa';
import githubUrlFromGit from 'github-url-from-git';
import hasYarn from 'has-yarn';
import hostedGitInfo from 'hosted-git-info';
import * as path from 'path';
import Config from '../config.js';
import {Reporter} from '../reporters/index.js';
import * as fs from '../util/fs.js';
import {hasUpstream} from '../util/publish/git-util.js';
import prerequisiteTasks from '../util/publish/prerequisite.js';
import {publish} from '../util/publish/publish.js';
import {release} from '../util/publish/release.js';
import ui from '../util/publish/ui.js';
import {Build} from './build.js';

type Flags = {
  branch: boolean,
  cleanup: boolean,
  yolo: boolean,
  publish: boolean,
  tag: boolean,
  yarn: boolean,
  contents: boolean,
  otp?: string,
  out?: string,
};

export function setFlags(commander: Command) {
  commander.description('Publish');
  commander.usage('publish [version] [...flags]');
  commander.option('--any-branch', 'Allow publishing from any branch');
  commander.option('--no-cleanup', 'Skips cleanup of node_modules');
  commander.option('--yolo', 'Skips cleanup and testing');
  commander.option('--no-publish', 'Skips publishing');
  commander.option('--tag', ' Publish under a given dist-tag');
  commander.option('--no-yarn', " Don't use Yarn");
  commander.option('--contents', 'Subdirectory to publish', 'pkg/');
  commander.option('--otp <code>', 'Publish with an OTP code');
  commander.option('--out <dir>', 'Directory to publish');
}

export function hasWrapper() {
  return true;
}

export class Publish {
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

  async init(input = 'patch') {
    const {out, flags, config, reporter} = this;
    const {manifest} = config;
    const repoUrl =
      manifest.repository &&
      githubUrlFromGit(manifest.repository.url, {
        extraBaseUrls: ['gitlab.com'],
      });
    const options: Flags = {
      cleanup: true,
      publish: true,
      ...flags,
      yarn: hasYarn(),
    };

    if (!hasYarn() && options.yarn) {
      throw new Error('Could not use Yarn without yarn.lock file');
    }

    const runTests = !options.yolo;
    const runCleanup = options.cleanup && !options.yolo;
    const runPublish = options.publish;
    const pkgManager = options.yarn === true ? 'yarn' : 'npm';
    const isOnGitHub = repoUrl && hostedGitInfo.fromUrl(repoUrl).type === 'github';

    const steps: Array<(curr: number, total: number) => Promise<{bailout: boolean} | void>> = [];

    steps.push(async (curr: number, total: number) => {
      this.reporter.step(curr, total, 'Prerequisite checks', '✨');
      runPublish && (await prerequisiteTasks(input, manifest, options));
      // title: 'Check current branch',
      const {stdout: branch} = await execa('git', ['symbolic-ref', '--short', 'HEAD']);
      if (branch !== 'master') {
        throw new Error('Not on `master` branch. Use --any-branch to publish anyway.');
      }
      // title: 'Check local working tree',
      const {stdout: status} = await execa('git', ['status', '--porcelain']);
      if (status !== '') {
        throw new Error('Unclean working tree. Commit or stash changes first.');
      }
      // title: 'Check remote history',
      let stdout;
      try {
        // Gracefully handle no remote set up.
        stdout = await execa.stdout('git', ['rev-list', '--count', '--left-only', '@{u}...HEAD']);
      } catch (_) {}

      if (stdout && stdout !== '0') {
        throw new Error('Remote history differs. Please pull changes.');
      }
    });

    if (runCleanup) {
      steps.push(async (curr: number, total: number) => {
        this.reporter.step(curr, total, 'Cleanup', '✨');
        await fs.unlink('package-lock.json');
        await fs.unlink('yarn.lock');
        await fs.unlink('node_modules');
        await fs.unlink('pkg');

        if (options.yarn) {
          return execa('yarn', ['install', '--production=false']);
        } else {
          return execa('npm', ['install', '--no-production']);
        }
      });
    }

    if (runTests) {
      steps.push(async (curr: number, total: number) => {
        this.reporter.step(curr, total, 'Test', '✨');

        if (!options.yarn) {
          await execa('npm', ['test']);
          return;
        }

        try {
          await execa('yarn', ['test']);
        } catch (err) {
          if (err.message.includes('Command "test" not found')) {
            return;
          }
          throw err;
        }
      });
    }

    steps.push(async (curr: number, total: number) => {
      this.reporter.step(curr, total, 'Bump Version', '✨');
      await execa('npm', ['version', input, '--force']);
      await config.loadPackageManifest();
    });

    steps.push(async (curr: number, total: number) => {
      this.reporter.step(curr, total, 'Building Package', '✨');
      const oldIsSilent = reporter.isSilent;
      reporter.isSilent = true;
      const builder = new Build({out, publish: true, silent: true}, config, reporter);
      reporter.isSilent = oldIsSilent;
      await builder.init(true);
    });

    if (runPublish && !manifest.private) {
      steps.push(async (curr: number, total: number) => {
        this.reporter.step(curr, total, 'Publishing Package', '✨');
        await publish(pkgManager, 'Publishing Package', options, input);
      });
    }

    steps.push(async (curr: number, total: number) => {
      this.reporter.step(curr, total, 'Pushing Changes', '✨');
      !(await hasUpstream()) && (await execa('git', ['push', '--follow-tags']));
      isOnGitHub === true && release(options);
    });

    let currentStep = 0;
    for (const step of steps) {
      await step(++currentStep, steps.length);
    }
  }
}

export async function run(config, reporter, flags, args) {
  await config.loadPackageManifest();
  const options =
    args.length > 0
      ? {
          ...flags,
          yarn: hasYarn(),
          confirm: true,
          version: args[0],
        }
      : await ui({...flags, yarn: hasYarn()}, config.manifest);

  if (!options.confirm) {
    return;
  }

  const publish = new Publish(flags, config, reporter);
  await publish.init(options.version);
  const newManifest = await config.loadPackageManifest();
  console.log(chalk.bold(`\n🎉  ${newManifest.name} v${newManifest.version} published!`));
  console.log(`You can see it at: ${chalk.underline(`https://unpkg.com/${newManifest.name}@${newManifest.version}/`)}`);
}