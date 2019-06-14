import chalk from 'chalk';
import {Command} from 'commander';
import Config from '../config.js';
import {Reporter} from '../reporters/index.js';
import executeLifecycleScript from '../util/execute-lifecycle-script.js';

type Flags = {
  anyBranch: boolean;
  cleanup: boolean;
  yolo: boolean;
  publish: boolean;
  releaseDraft: boolean;
  tag: string;
  yarn: boolean;
  contents: string;
  otp?: string;
  out?: string;
  originalArgs: string[];
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
  commander.option('--no-release-draft', 'Skips opening a GitHub release draft');
  commander.option('--otp <code>', 'Publish with an OTP code');
}

export function hasWrapper() {
  return false;
}

export async function run(config: Config, reporter: Reporter, flags: Flags, args: Array<string>): Promise<void> {
  const contentsArg = flags.contents ? [] : ['--contents', flags.out || flags.contents || 'pkg/'];
  const manifest = await config.loadPackageManifest();
  if (!manifest.scripts.version) {
    reporter.warn(`${chalk.bold('"version" script missing!')} A fresh build is required after every bump to the master package.json version.`);
    if (manifest.scripts.build) {
      config._manifest.scripts.version = 'npm run build';
    } else {
      config._manifest.scripts.version = 'npx @pika/pack build';
    }
    await config.savePackageManifest(config._manifest);
    reporter.log(`Adding the following "version" lifecycle script to your package.json... ` + chalk.bold(`"${config._manifest.scripts.version}"`));
    reporter.log(`Please review & commit this change before publishing.`);
    return;
  }

  // TODO: Check that the "version" hook runs build or @pika/pack
  try {
    await executeLifecycleScript({
      cwd: config.cwd,
      cmd: 'npx',
      args: ['np', ...contentsArg, ...flags.originalArgs],
      isInteractive: true
    });
  } catch (err) {
    // swallow err, np will properly log it to the console
    return;
  }

  const newManifest = await config.loadPackageManifest();
  console.log(`If published publicly, you can see it at: ${chalk.underline(`https://unpkg.com/${newManifest.name}@${newManifest.version}/`)}`);
}
