'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = require('path');
var commander$1 = require('commander');
var fs = require('fs');
var invariant = _interopDefault(require('invariant'));
var loudRejection = _interopDefault(require('loud-rejection'));
var semver = _interopDefault(require('semver'));
var chalk = _interopDefault(require('chalk'));
var inquirer = require('inquirer');
var inquirer__default = _interopDefault(inquirer);
var read = _interopDefault(require('read'));
var readline = require('readline');
var stripAnsi = _interopDefault(require('strip-ansi'));
var tty = require('tty');
var util = require('util');
require('camelcase');
var isCI = require('is-ci');
var os = require('os');
var events = require('events');
var _rimraf = _interopDefault(require('rimraf'));
var _mkdirp = _interopDefault(require('mkdirp'));
var _glob = _interopDefault(require('glob'));
var stripBOM = _interopDefault(require('strip-bom'));
var execa = _interopDefault(require('execa'));
var githubUrlFromGit = _interopDefault(require('github-url-from-git'));
var hasYarn = _interopDefault(require('has-yarn'));
var hostedGitInfo = _interopDefault(require('hosted-git-info'));
var pTimeout = _interopDefault(require('p-timeout'));
require('issue-regex');
var isScoped = _interopDefault(require('is-scoped'));
var types = require('@pika/types');
var isBuiltinModule = _interopDefault(require('is-builtin-module'));
var validateLicense = _interopDefault(require('validate-npm-package-license'));
var nodeUrl = require('url');
var detectIndent = _interopDefault(require('detect-indent'));
var child_process = require('child_process');
var importFrom = _interopDefault(require('import-from'));
var uri2path = _interopDefault(require('file-uri-to-path'));

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toArray(arr) {
  return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

/* @flow */
function sortAlpha(a, b) {
  // sort alphabetically in a deterministic way
  const shortLen = Math.min(a.length, b.length);

  for (let i = 0; i < shortLen; i++) {
    const aChar = a.charCodeAt(i);
    const bChar = b.charCodeAt(i);

    if (aChar !== bChar) {
      return aChar - bChar;
    }
  }

  return a.length - b.length;
}
function sortOptionsByFlags(a, b) {
  const aOpt = a.flags.replace(/-/g, '');
  const bOpt = b.flags.replace(/-/g, '');
  return sortAlpha(aOpt, bOpt);
}
function removeSuffix(pattern, suffix) {
  if (pattern.endsWith(suffix)) {
    return pattern.slice(0, -suffix.length);
  }

  return pattern;
}

function formatFunction(...strs) {
  return strs.join(' ');
}

const defaultFormatter = {
  bold: formatFunction,
  dim: formatFunction,
  italic: formatFunction,
  underline: formatFunction,
  inverse: formatFunction,
  strikethrough: formatFunction,
  black: formatFunction,
  red: formatFunction,
  green: formatFunction,
  yellow: formatFunction,
  blue: formatFunction,
  magenta: formatFunction,
  cyan: formatFunction,
  white: formatFunction,
  gray: formatFunction,
  grey: formatFunction,
  stripColor: formatFunction
};

const messages = {
  upToDate: 'Already up-to-date.',
  folderInSync: 'Folder in sync.',
  nothingToInstall: 'Nothing to install.',
  resolvingPackages: 'Resolving packages',
  checkingManifest: 'Validating package.json',
  fetchingPackages: 'Fetching packages',
  linkingDependencies: 'Linking dependencies',
  rebuildingPackages: 'Rebuilding all packages',
  buildingFreshPackages: 'Building fresh packages',
  cleaningModules: 'Cleaning modules',
  bumpingVersion: 'Bumping version',
  savingHar: 'Saving HAR file: $0',
  answer: 'Answer?',
  usage: 'Usage',
  installCommandRenamed: '`install` has been replaced with `add` to add new dependencies. Run $0 instead.',
  globalFlagRemoved: '`--global` has been deprecated. Please run $0 instead.',
  waitingInstance: 'Waiting for the other pika instance to finish (pid $0, inside $1)',
  waitingNamedInstance: 'Waiting for the other pika instance to finish ($0)',
  offlineRetrying: 'There appears to be trouble with your network connection. Retrying...',
  internalServerErrorRetrying: 'There appears to be trouble with the npm registry (returned $1). Retrying...',
  clearedCache: 'Cleared cache.',
  couldntClearPackageFromCache: "Couldn't clear package $0 from cache",
  clearedPackageFromCache: 'Cleared package $0 from cache',
  packWroteTarball: 'Wrote tarball to $0.',
  helpExamples: '  Examples:\n$0\n',
  helpCommands: '  Commands:\n$0\n',
  helpCommandsMore: '  Run `$0` for more information on specific commands.',
  helpLearnMore: '  Visit $0 to learn more about Pika.\n',
  manifestPotentialTypo: 'Potential typo $0, did you mean $1?',
  manifestBuiltinModule: '$0 is also the name of a node core module',
  manifestNameDot: "Name can't start with a dot",
  manifestNameIllegalChars: 'Name contains illegal characters',
  manifestNameBlacklisted: 'Name is blacklisted',
  manifestLicenseInvalid: 'License should be a valid SPDX license expression',
  manifestLicenseNone: 'No license field',
  manifestStringExpected: '$0 is not a string',
  manifestDependencyCollision: '$0 has dependency $1 with range $2 that collides with a dependency in $3 of the same name with version $4',
  manifestDirectoryNotFound: 'Unable to read $0 directory of module $1',
  verboseFileCopy: 'Copying $0 to $1.',
  verboseFileLink: 'Creating hardlink at $0 to $1.',
  verboseFileSymlink: 'Creating symlink at $0 to $1.',
  verboseFileSkip: 'Skipping copying of file $0 as the file at $1 is the same size ($2) and mtime ($3).',
  verboseFileSkipSymlink: 'Skipping copying of $0 as the file at $1 is the same symlink ($2).',
  verboseFileSkipHardlink: 'Skipping copying of $0 as the file at $1 is the same hardlink ($2).',
  verboseFileRemoveExtraneous: 'Removing extraneous file $0.',
  verboseFilePhantomExtraneous: "File $0 would be marked as extraneous but has been removed as it's listed as a phantom file.",
  verboseFileSkipArtifact: 'Skipping copying of $0 as the file is marked as a built artifact and subject to change.',
  verboseFileFolder: 'Creating directory $0.',
  verboseRequestStart: 'Performing $0 request to $1.',
  verboseRequestFinish: 'Request $0 finished with status code $1.',
  configSet: 'Set $0 to $1.',
  configDelete: 'Deleted $0.',
  configNpm: 'npm config',
  configPika: 'pika config',
  couldntFindPackagejson: "Couldn't find a package.json file in $0",
  couldntFindMatch: "Couldn't find match for $0 in $1 for $2.",
  couldntFindPackageInCache: "Couldn't find any versions for $0 that matches $1 in our cache (possible versions are $2). This is usually caused by a missing entry in the lockfile, running Pika without the --offline flag may help fix this issue.",
  couldntFindVersionThatMatchesRange: "Couldn't find any versions for $0 that matches $1",
  chooseVersionFromList: 'Please choose a version of $0 from this list:',
  moduleNotInManifest: "This module isn't specified in a package.json file.",
  moduleAlreadyInManifest: '$0 is already in $1. Please remove existing entry first before adding it to $2.',
  unknownFolderOrTarball: "Passed folder/tarball doesn't exist,",
  unknownPackage: "Couldn't find package $0.",
  unknownPackageName: "Couldn't find package name.",
  unknownUser: "Couldn't find user $0.",
  unknownRegistryResolver: 'Unknown registry resolver $0',
  userNotAnOwner: "User $0 isn't an owner of this package.",
  invalidVersionArgument: 'Use the $0 flag to create a new version.',
  invalidVersion: 'Invalid version supplied.',
  requiredVersionInRange: 'Required version in range.',
  packageNotFoundRegistry: "Couldn't find package $0 on the $1 registry.",
  requiredPackageNotFoundRegistry: "Couldn't find package $0 required by $1 on the $2 registry.",
  doesntExist: "Package $1 refers to a non-existing file '$0'.",
  missingRequiredPackageKey: `Package $0 doesn't have a $1.`,
  invalidAccess: 'Invalid argument for access, expected public or restricted.',
  invalidCommand: 'Invalid subcommand. Try $0',
  invalidGistFragment: 'Invalid gist fragment $0.',
  invalidHostedGitFragment: 'Invalid hosted git fragment $0.',
  invalidFragment: 'Invalid fragment $0.',
  invalidPackageName: 'Invalid package name.',
  invalidPackageVersion: "Can't add $0: invalid package version $1.",
  couldntFindManifestIn: "Couldn't find manifest in $0.",
  shrinkwrapWarning: 'npm-shrinkwrap.json found. This will not be updated or respected. See https://yarnpkg.com/en/docs/migrating-from-npm for more information.',
  npmLockfileWarning: 'package-lock.json found. Your project contains lock files generated by tools other than Pika. It is advised not to mix package managers in order to avoid resolution inconsistencies caused by unsynchronized lock files. To clear this warning, remove package-lock.json.',
  lockfileOutdated: 'Outdated lockfile. Please run `pika install` and try again.',
  lockfileMerged: 'Merge conflict detected in pika.lock and successfully merged.',
  lockfileConflict: 'A merge conflict was found in pika.lock but it could not be successfully merged, regenerating pika.lock from scratch.',
  ignoredScripts: 'Ignored scripts due to flag.',
  missingAddDependencies: 'Missing list of packages to add to your project.',
  yesWarning: 'The yes flag has been set. This will automatically answer yes to all questions, which may have security implications.',
  networkWarning: "You don't appear to have an internet connection. Try the --offline flag to use the cache for registry queries.",
  flatGlobalError: 'The package $0 requires a flat dependency graph. Add `"flat": true` to your package.json and try again.',
  noName: `Package doesn't have a name.`,
  noVersion: `Package doesn't have a version.`,
  answerRequired: 'An answer is required.',
  missingWhyDependency: 'Missing package name, folder or path to file to identify why a package has been installed',
  bugReport: 'If you think this is a bug, please open a bug report with the information provided in $0.',
  unexpectedError: 'An unexpected error occurred: $0.',
  jsonError: 'Error parsing JSON at $0, $1.',
  noPermission: 'Cannot create $0 due to insufficient permissions.',
  noGlobalFolder: 'Cannot find a suitable global folder. Tried these: $0',
  allDependenciesUpToDate: 'All of your dependencies are up to date.',
  legendColorsForVersionUpdates: 'Color legend : \n $0    : Major Update backward-incompatible updates \n $1 : Minor Update backward-compatible features \n $2  : Patch Update backward-compatible bug fixes',
  frozenLockfileError: 'Your lockfile needs to be updated, but pika was run with `--frozen-lockfile`.',
  fileWriteError: 'Could not write file $0: $1',
  fileDeleteError: 'Could not delete file $0: $1',
  multiplePackagesCantUnpackInSameDestination: 'Pattern $0 is trying to unpack in the same destination $1 as pattern $2. This could result in non-deterministic behavior, skipping.',
  incorrectLockfileEntry: 'Lockfile has incorrect entry for $0. Ignoring it.',
  invalidResolutionName: 'Resolution field $0 does not end with a valid package name and will be ignored',
  invalidResolutionVersion: 'Resolution field $0 has an invalid version entry and may be ignored',
  incompatibleResolutionVersion: 'Resolution field $0 is incompatible with requested version $1',
  pikaOutdated: "Your current version of Pika is out of date. The latest version is $0, while you're on $1.",
  pikaOutdatedInstaller: 'To upgrade, download the latest installer at $0.',
  pikaOutdatedCommand: 'To upgrade, run the following command:',
  tooManyArguments: 'Too many arguments, maximum of $0.',
  tooFewArguments: 'Not enough arguments, expected at least $0.',
  noArguments: "This command doesn't require any arguments.",
  ownerRemoving: 'Removing owner $0 from package $1.',
  ownerRemoved: 'Owner removed.',
  ownerRemoveError: "Couldn't remove owner.",
  ownerGetting: 'Getting owners for package $0',
  ownerGettingFailed: "Couldn't get list of owners.",
  ownerAlready: 'This user is already an owner of this package.',
  ownerAdded: 'Added owner.',
  ownerAdding: 'Adding owner $0 to package $1',
  ownerAddingFailed: "Couldn't add owner.",
  ownerNone: 'No owners.',
  teamCreating: 'Creating team',
  teamRemoving: 'Removing team',
  teamAddingUser: 'Adding user to team',
  teamRemovingUser: 'Removing user from team',
  teamListing: 'Listing teams',
  distFailed: `⚠️  Distribution "$0" failed to build: $1 $2`,
  distExiting: `   Exiting...`,
  distContinuing: `   Continuing...`,
  cleaning: 'Cleaning modules',
  cleanCreatingFile: 'Creating $0',
  cleanCreatedFile: 'Created $0. Please review the contents of this file then run "pika autoclean --force" to perform a clean.',
  cleanAlreadyExists: '$0 already exists. To revert to the default file, delete $0 then rerun this command.',
  cleanRequiresForce: 'This command required the "--force" flag to perform the clean. This is a destructive operation. Files specified in $0 will be deleted.',
  cleanDoesNotExist: '$0 does not exist. Autoclean will delete files specified by $0. Run "autoclean --init" to create $0 with the default entries.',
  binLinkCollision: "There's already a linked binary called $0 in your global Pika bin. Could not link this package's $0 bin entry.",
  linkCollision: "There's already a package called $0 registered. This command has had no effect. If this command was run in another folder with the same name, the other folder is still linked. Please run pika unlink in the other folder if you want to register this folder.",
  linkMissing: 'No registered package found called $0.',
  linkRegistered: 'Registered $0.',
  linkRegisteredMessage: 'You can now run `pika link $0` in the projects where you want to use this package and it will be used instead.',
  linkUnregistered: 'Unregistered $0.',
  linkUnregisteredMessage: 'You can now run `pika unlink $0` in the projects where you no longer want to use this package.',
  linkUsing: 'Using linked package for $0.',
  linkDisusing: 'Removed linked package $0.',
  linkDisusingMessage: 'You will need to run `pika` to re-install the package that was linked.',
  linkTargetMissing: 'The target of linked package $0 is missing. Removing link.',
  createInvalidBin: 'Invalid bin entry found in package $0.',
  createMissingPackage: 'Package not found - this is probably an internal error, and should be reported at https://github.com/yarnpkg/yarn/issues.',
  workspacesAddRootCheck: 'Running this command will add the dependency to the workspace root rather than the workspace itself, which might not be what you want - if you really meant it, make it explicit by running this command again with the -W flag (or --ignore-workspace-root-check).',
  workspacesRemoveRootCheck: 'Running this command will remove the dependency from the workspace root rather than the workspace itself, which might not be what you want - if you really meant it, make it explicit by running this command again with the -W flag (or --ignore-workspace-root-check).',
  workspacesFocusRootCheck: 'This command can only be run inside an individual workspace.',
  workspacesRequirePrivateProjects: 'Workspaces can only be enabled in private projects.',
  workspacesSettingMustBeArray: 'The workspaces field in package.json must be an array.',
  workspacesDisabled: 'Your project root defines workspaces but the feature is disabled in your Pika config. Please check "workspaces-experimental" in your .pikarc file.',
  workspacesNohoistRequirePrivatePackages: 'nohoist config is ignored in $0 because it is not a private package. If you think nohoist should be allowed in public packages, please submit an issue for your use case.',
  workspacesNohoistDisabled: `$0 defines nohoist but the feature is disabled in your Pika config ("workspaces-nohoist-experimental" in .pikarc file)`,
  workspaceRootNotFound: "Cannot find the root of your workspace - are you sure you're currently in a workspace?",
  workspaceMissingWorkspace: 'Missing workspace name.',
  workspaceMissingCommand: 'Missing command name.',
  workspaceUnknownWorkspace: 'Unknown workspace $0.',
  workspaceVersionMandatory: 'Missing version in workspace at $0, ignoring.',
  workspaceNameMandatory: 'Missing name in workspace at $0, ignoring.',
  workspaceNameDuplicate: 'There are more than one workspace with name $0',
  cacheFolderSkipped: 'Skipping preferred cache folder $0 because it is not writable.',
  cacheFolderMissing: "Pika hasn't been able to find a cache folder it can use. Please use the explicit --cache-folder option to tell it what location to use, or make one of the preferred locations writable.",
  cacheFolderSelected: 'Selected the next writable cache folder in the list, will be $0.',
  execMissingCommand: 'Missing command name.',
  noScriptsAvailable: 'There are no scripts specified inside package.json.',
  noBinAvailable: 'There are no binary scripts available.',
  dashDashDeprecation: `From Pika 1.0 onwards, scripts don't require "--" for options to be forwarded. In a future version, any explicit "--" will be forwarded as-is to the scripts.`,
  commandNotSpecified: 'No command specified.',
  binCommands: 'Commands available from binary scripts: ',
  possibleCommands: 'Project commands',
  commandQuestion: 'Which command would you like to run?',
  commandFailedWithCode: 'Command failed with exit code $0.',
  commandFailedWithSignal: 'Command failed with signal $0.',
  packageRequiresNodeGyp: 'This package requires node-gyp, which is not currently installed. Pika will attempt to automatically install it. If this fails, you can run "pika global add node-gyp" to manually install it.',
  nodeGypAutoInstallFailed: 'Failed to auto-install node-gyp. Please run "pika global add node-gyp" manually. Error: $0',
  foundIncompatible: 'Found incompatible module',
  incompatibleEngine: 'The engine $0 is incompatible with this module. Expected version $1. Got $2',
  incompatibleCPU: 'The CPU architecture $0 is incompatible with this module.',
  incompatibleOS: 'The platform $0 is incompatible with this module.',
  invalidEngine: 'The engine $0 appears to be invalid.',
  optionalCompatibilityExcluded: '$0 is an optional dependency and failed compatibility check. Excluding it from installation.',
  optionalModuleFail: 'This module is OPTIONAL, you can safely ignore this error',
  optionalModuleScriptFail: 'Error running install script for optional dependency: $0',
  optionalModuleCleanupFail: 'Could not cleanup build artifacts from failed install: $0',
  unmetPeer: '$0 has unmet peer dependency $1.',
  incorrectPeer: '$0 has incorrect peer dependency $1.',
  selectedPeer: 'Selecting $1 at level $2 as the peer dependency of $0.',
  missingBundledDependency: '$0 is missing a bundled dependency $1. This should be reported to the package maintainer.',
  savedNewDependency: 'Saved 1 new dependency.',
  savedNewDependencies: 'Saved $0 new dependencies.',
  directDependencies: 'Direct dependencies',
  allDependencies: 'All dependencies',
  foundWarnings: 'Found $0 warnings.',
  foundErrors: 'Found $0 errors.',
  savedLockfile: 'Saved lockfile.',
  noRequiredLockfile: 'No lockfile in this directory. Run `pika install` to generate one.',
  noLockfileFound: 'No lockfile found.',
  invalidSemver: 'Invalid semver version',
  newVersion: 'New version',
  currentVersion: 'Current version',
  noVersionOnPublish: 'Proceeding with current version',
  manualVersionResolution: 'Unable to find a suitable version for $0, please choose one by typing one of the numbers below:',
  manualVersionResolutionOption: '$0 which resolved to $1',
  createdTag: 'Created tag.',
  createdTagFail: "Couldn't add tag.",
  deletedTag: 'Deleted tag.',
  deletedTagFail: "Couldn't delete tag.",
  gettingTags: 'Getting tags',
  deletingTags: 'Deleting tag',
  creatingTag: 'Creating tag $0 = $1',
  whyStart: 'Why do we have the module $0?',
  whyFinding: 'Finding dependency',
  whyCalculating: 'Calculating file sizes',
  whyUnknownMatch: "We couldn't find a match!",
  whyInitGraph: 'Initialising dependency graph',
  whyWhoKnows: "We don't know why this module exists",
  whyDiskSizeWithout: 'Disk size without dependencies: $0',
  whyDiskSizeUnique: 'Disk size with unique dependencies: $0',
  whyDiskSizeTransitive: 'Disk size with transitive dependencies: $0',
  whySharedDependencies: 'Number of shared dependencies: $0',
  whyHoistedTo: `Has been hoisted to $0`,
  whyHoistedFromSimple: `This module exists because it's hoisted from $0.`,
  whyNotHoistedSimple: `This module exists here because it's in the nohoist list $0.`,
  whyDependedOnSimple: `This module exists because $0 depends on it.`,
  whySpecifiedSimple: `This module exists because it's specified in $0.`,
  whyReasons: 'Reasons this module exists',
  whyHoistedFrom: 'Hoisted from $0',
  whyNotHoisted: `in the nohoist list $0`,
  whyDependedOn: '$0 depends on it',
  whySpecified: `Specified in $0`,
  whyMatch: `\r=> Found $0`,
  uninstalledPackages: 'Uninstalled packages.',
  uninstallRegenerate: 'Regenerating lockfile and installing missing dependencies',
  cleanRemovedFiles: 'Removed $0 files',
  cleanSavedSize: 'Saved $0 MB.',
  configFileFound: 'Found configuration file $0.',
  configPossibleFile: 'Checking for configuration file $0.',
  npmUsername: 'npm username',
  npmPassword: 'npm password',
  npmEmail: 'npm email',
  npmOneTimePassword: 'npm one-time password',
  loggingIn: 'Logging in',
  loggedIn: 'Logged in.',
  notRevokingEnvToken: 'Not revoking login token, specified via environment variable.',
  notRevokingConfigToken: 'Not revoking login token, specified via config file.',
  noTokenToRevoke: 'No login token to revoke.',
  revokingToken: 'Revoking token',
  revokedToken: 'Revoked login token.',
  loginAsPublic: 'Logging in as public',
  incorrectCredentials: 'Incorrect username or password.',
  incorrectOneTimePassword: 'Incorrect one-time password.',
  twoFactorAuthenticationEnabled: 'Two factor authentication enabled.',
  clearedCredentials: 'Cleared login credentials.',
  publishFail: "Couldn't publish package: $0",
  publishPrivate: 'Package marked as private, not publishing.',
  published: 'Published.',
  publishing: 'Publishing',
  nonInteractiveNoVersionSpecified: 'You must specify a new version with --new-version when running with --non-interactive.',
  nonInteractiveNoToken: "No token found and can't prompt for login when running with --non-interactive.",
  infoFail: 'Received invalid response from npm.',
  malformedRegistryResponse: 'Received malformed response from registry for $0. The registry may be down.',
  registryNoVersions: 'No valid versions found for $0. The package may be unpublished.',
  cantRequestOffline: "Can't make a request in offline mode ($0)",
  requestManagerNotSetupHAR: 'RequestManager was not setup to capture HAR files',
  requestError: 'Request $0 returned a $1',
  requestFailed: 'Request failed $0',
  tarballNotInNetworkOrCache: '$0: Tarball is not in network and can not be located in cache ($1)',
  fetchBadHashWithPath: "Integrity check failed for $0 (computed integrity doesn't match our records, got $2)",
  fetchBadIntegrityAlgorithm: 'Integrity checked failed for $0 (none of the specified algorithms are supported)',
  fetchErrorCorrupt: '$0. Mirror tarball appears to be corrupt. You can resolve this by running:\n\n  rm -rf $1\n  pika install',
  errorExtractingTarball: 'Extracting tar content of $1 failed, the file appears to be corrupt: $0',
  updateInstalling: 'Installing $0...',
  hostedGitResolveError: 'Error connecting to repository. Please, check the url.',
  unknownFetcherFor: 'Unknown fetcher for $0',
  downloadGitWithoutCommit: 'Downloading the git repo $0 over plain git without a commit hash',
  downloadHTTPWithoutCommit: 'Downloading the git repo $0 over HTTP without a commit hash',
  unplugDisabled: "Packages can only be unplugged when Plug'n'Play is enabled.",
  plugnplayWindowsSupport: "Plug'n'Play on Windows doesn't support the cache and project to be kept on separate drives",
  packageInstalledWithBinaries: 'Installed $0 with binaries:',
  packageHasBinaries: '$0 has binaries:',
  packageHasNoBinaries: '$0 has no binaries',
  packageBinaryNotFound: "Couldn't find a binary named $0",
  couldBeDeduped: '$0 could be deduped from $1 to $2',
  lockfileNotContainPattern: 'Lockfile does not contain pattern: $0',
  integrityCheckFailed: 'Integrity check failed',
  noIntegrityFile: "Couldn't find an integrity file",
  integrityFailedExpectedIsNotAJSON: 'Integrity check: integrity file is not a json',
  integrityCheckLinkedModulesDontMatch: "Integrity check: Linked modules don't match",
  integrityFlagsDontMatch: "Integrity check: Flags don't match",
  integrityLockfilesDontMatch: "Integrity check: Lock files don't match",
  integrityFailedFilesMissing: 'Integrity check: Files are missing',
  integrityPatternsDontMatch: "Integrity check: Top level patterns don't match",
  integrityModulesFoldersMissing: 'Integrity check: Some module folders are missing',
  integritySystemParamsDontMatch: "Integrity check: System parameters don't match",
  packageNotInstalled: '$0 not installed',
  optionalDepNotInstalled: 'Optional dependency $0 not installed',
  packageWrongVersion: '$0 is wrong version: expected $1, got $2',
  packageDontSatisfy: "$0 doesn't satisfy found match of $1",
  lockfileExists: 'Lockfile already exists, not migrating.',
  pikaManifestExists: 'pika.package.json manifest already exists, not migrating.',
  noManifestExists: 'No package.json manifest found. Run `pika init` to generate a new pika.package.json manifest.',
  skippingImport: 'Skipping import of $0 for $1',
  importFailed: 'Import of $0 for $1 failed, resolving normally.',
  importResolveFailed: 'Import of $0 failed starting in $1',
  importResolvedRangeMatch: 'Using version $0 of $1 instead of $2 for $3',
  importSourceFilesCorrupted: 'Failed to import from package-lock.json, source file(s) corrupted',
  importPackageLock: 'found npm package-lock.json, converting to pika.lock',
  importYarnLock: 'found yarn.lock, converting to pika.lock',
  importNodeModules: 'creating pika.lock from local node_modules folder',
  packageContainsPikaAsGlobal: 'Installing Pika via Pika will result in you having two separate versions of Pika installed at the same time, which is not recommended. To update Pika please follow https://yarnpkg.com/en/docs/install .',
  watchStarting: `Starting up`,
  watchRunning: `Ready! Watching source tree for changes`,
  watchRebuild: `Rebuilding...`,
  watchError: `Build error!`,
  noValidationErrors: `0 Validation Errors found.`,
  validationErrors: `$0 Validation Error(s) found. Resolve before publishing.`,
  scopeNotValid: 'The specified scope is not valid.',
  deprecatedCommand: '$0 is deprecated. Please use $1.',
  deprecatedListArgs: 'Filtering by arguments is deprecated. Please use the pattern option instead.',
  implicitFileDeprecated: 'Using the "file:" protocol implicitly is deprecated. Please either prepend the protocol or prepend the path $0 with "./".',
  unsupportedNodeVersion: 'You are using Node $0 which is not supported and may encounter bugs or unexpected behavior. Pika supports the following semver range: $1',
  verboseUpgradeBecauseRequested: 'Considering upgrade of $0 to $1 because it was directly requested.',
  verboseUpgradeBecauseOutdated: 'Considering upgrade of $0 to $1 because a newer version exists in the registry.',
  verboseUpgradeNotUnlocking: 'Not unlocking $0 in the lockfile because it is a new or direct dependency.',
  verboseUpgradeUnlocking: 'Unlocking $0 in the lockfile.',
  folderMissing: "Directory $0 doesn't exist",
  mutexPortBusy: 'Cannot use the network mutex on port $0. It is probably used by another app.',
  auditRunning: 'Auditing packages',
  auditSummary: '$0 vulnerabilities found - Packages audited: $1',
  auditSummarySeverity: 'Severity:',
  auditCritical: '$0 Critical',
  auditHigh: '$0 High',
  auditModerate: '$0 Moderate',
  auditLow: '$0 Low',
  auditInfo: '$0 Info',
  auditResolveCommand: '# Run $0 to resolve $1 $2',
  auditSemverMajorChange: 'SEMVER WARNING: Recommended action is a potentially breaking change',
  auditManualReview: 'Manual Review\nSome vulnerabilities require your attention to resolve\n\nVisit https://go.npm.me/audit-guide for additional guidance',
  auditRunAuditForDetails: 'Security audit found potential problems. Run "pika audit" for additional details.',
  auditOffline: 'Skipping audit. Security audit cannot be performed in offline mode.'
};



var languages = /*#__PURE__*/Object.freeze({
  en: messages
});

function stringifyLangArgs(args) {
  return args.map(function (val) {
    if (val != null && val.inspect) {
      return val.inspect();
    } else {
      try {
        const str = JSON.stringify(val) || val + ''; // should match all literal line breaks and
        // "u001b" that follow an odd number of backslashes and convert them to ESC
        // we do this because the JSON.stringify process has escaped these characters

        return str.replace(/((?:^|[^\\])(?:\\{2})*)\\u001[bB]/g, '$1\u001b').replace(/[\\]r[\\]n|([\\])?[\\]n/g, (match, precededBacklash) => {
          // precededBacklash not null when "\n" is preceded by a backlash ("\\n")
          // match will be "\\n" and we don't replace it with os.EOL
          return precededBacklash ? match : os.EOL;
        });
      } catch (e) {
        return util.inspect(val);
      }
    }
  });
}
class BaseReporter {
  constructor(opts = {}) {
    const lang = 'en';
    this.language = lang;
    this.stdout = opts.stdout || process.stdout;
    this.stderr = opts.stderr || process.stderr;
    this.stdin = opts.stdin || this._getStandardInput();
    this.emoji = !!opts.emoji;
    this.nonInteractive = !!opts.nonInteractive;
    this.noProgress = !!opts.noProgress || isCI;
    this.isVerbose = !!opts.verbose; // @ts-ignore

    this.isTTY = this.stdout.isTTY;
    this.peakMemory = 0;
    this.startTime = Date.now();
    this.format = defaultFormatter;
  }

  lang(key, ...args) {
    const msg = languages[this.language][key] || messages[key];

    if (!msg) {
      throw new ReferenceError(`No message defined for language key ${key}`);
    } // stringify args


    const stringifiedArgs = stringifyLangArgs(args); // replace $0 placeholders with args

    return msg.replace(/\$(\d+)/g, (str, i) => {
      return stringifiedArgs[i];
    });
  }
  /**
   * `stringifyLangArgs` run `JSON.stringify` on strings too causing
   * them to appear quoted. This marks them as "raw" and prevents
   * the quoting and escaping
   */


  rawText(str) {
    return {
      inspect() {
        return str;
      }

    };
  }

  verbose(msg) {
    if (this.isVerbose) {
      this._verbose(msg);
    }
  }

  verboseInspect(val) {
    if (this.isVerbose) {
      this._verboseInspect(val);
    }
  }

  _verbose(msg) {}

  _verboseInspect(val) {}

  _getStandardInput() {
    let standardInput; // Accessing stdin in a win32 headless process (e.g., Visual Studio) may throw an exception.

    try {
      standardInput = process.stdin;
    } catch (e) {
      console.warn(e.message);
      delete process.stdin; // @ts-ignore

      process.stdin = new events.EventEmitter();
      standardInput = process.stdin;
    }

    return standardInput;
  }

  initPeakMemoryCounter() {
    this.checkPeakMemory();
    this.peakMemoryInterval = setInterval(() => {
      this.checkPeakMemory();
    }, 1000); // $FlowFixMe: Node's setInterval returns a Timeout, not a Number

    this.peakMemoryInterval.unref();
  }

  checkPeakMemory() {
    const _process$memoryUsage = process.memoryUsage(),
          heapTotal = _process$memoryUsage.heapTotal;

    if (heapTotal > this.peakMemory) {
      this.peakMemory = heapTotal;
    }
  }

  close() {
    if (this.peakMemoryInterval) {
      clearInterval(this.peakMemoryInterval);
      this.peakMemoryInterval = null;
    }
  }

  getTotalTime() {
    return Date.now() - this.startTime;
  } // TODO


  list(key, items, hints) {} // Outputs basic tree structure to console


  tree(key, obj, {
    force = false
  } = {}) {} // called whenever we begin a step in the CLI.


  step(current, total, message, emoji) {} // a error message has been triggered. this however does not always meant an abrupt
  // program end.


  error(message) {} // an info message has been triggered. this provides things like stats and diagnostics.


  info(message) {} // a warning message has been triggered.


  warn(message) {} // a success message has been triggered.


  success(message) {} // a simple log message
  // TODO: rethink the {force} parameter. In the meantime, please don't use it (cf comments in #4143).


  log(message, {
    force = false
  } = {}) {} // a shell command has been executed


  command(command) {} // inspect and pretty-print any value


  inspect(value) {} // the screen shown at the very start of the CLI


  header(command, pkg) {} // the screen shown at the very end of the CLI


  footer(showPeakMemory) {} // a table structure


  table(head, body) {} // render an activity spinner and return a function that will trigger an update


  activity() {
    return {
      tick(name) {},

      end() {}

    };
  } //


  activitySet(total, workers) {
    return {
      spinners: Array(workers).fill({
        clear() {},

        setPrefix() {},

        tick() {},

        end() {}

      }),

      end() {}

    };
  } //


  question(question, options = {}) {
    return Promise.reject(new Error('Not implemented'));
  } //


  questionAffirm(question) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const condition = true; // trick eslint

      if (_this.nonInteractive) {
        return true;
      }

      while (condition) {
        let answer = yield _this.question(question);
        answer = answer.toLowerCase();

        if (answer === 'y' || answer === 'yes') {
          return true;
        }

        if (answer === 'n' || answer === 'no') {
          return false;
        }

        _this.error('Invalid answer for question');
      }

      return false;
    })();
  } // prompt the user to select an option from an array


  select(header, question, options) {
    return Promise.reject(new Error('Not implemented'));
  } // render a progress bar and return a function which when called will trigger an update


  progress(total) {
    return function () {};
  } // utility function to disable progress bar


  disableProgress() {
    this.noProgress = true;
  } //


  prompt(message, choices, options = {}) {
    return Promise.reject(new Error('Not implemented'));
  }

}

// public
function sortTrees(trees) {
  return trees.sort(function (tree1, tree2) {
    return tree1.name.localeCompare(tree2.name);
  });
}
function recurseTree(tree, prefix, recurseFunc) {
  const treeLen = tree.length;
  const treeEnd = treeLen - 1;

  for (let i = 0; i < treeLen; i++) {
    const atEnd = i === treeEnd;
    recurseFunc(tree[i], prefix + getLastIndentChar(atEnd), prefix + getNextIndentChar(atEnd));
  }
}
function getFormattedOutput(fmt) {
  const item = formatColor(fmt.color, fmt.name, fmt.formatter);
  const suffix = getSuffix(fmt.hint, fmt.formatter);
  return `${fmt.prefix}─ ${item}${suffix}\n`;
}

function getNextIndentChar(end) {
  return end ? '   ' : '│  ';
}

function getLastIndentChar(end) {
  return end ? '└' : '├';
}

function getSuffix(hint, formatter) {
  return hint ? ` (${formatter.grey(hint)})` : '';
}

function formatColor(color, strToFormat, formatter) {
  return color ? formatter[color](strToFormat) : strToFormat;
}

const CLEAR_WHOLE_LINE = 0;
const CLEAR_RIGHT_OF_CURSOR = 1;
function clearLine(stdout) {
  if (!chalk.supportsColor) {
    if (stdout instanceof tty.WriteStream) {
      if (stdout.columns > 0) {
        stdout.write(`\r${' '.repeat(stdout.columns - 1)}`);
      }

      stdout.write(`\r`);
    }

    return;
  }

  readline.clearLine(stdout, CLEAR_WHOLE_LINE);
  readline.cursorTo(stdout, 0);
}
function toStartOfLine(stdout) {
  if (!chalk.supportsColor) {
    stdout.write('\r');
    return;
  }

  readline.cursorTo(stdout, 0);
}
function writeOnNthLine(stdout, n, msg) {
  if (!chalk.supportsColor) {
    return;
  }

  if (n == 0) {
    readline.cursorTo(stdout, 0);
    stdout.write(msg);
    readline.clearLine(stdout, CLEAR_RIGHT_OF_CURSOR);
    return;
  }

  readline.cursorTo(stdout, 0);
  readline.moveCursor(stdout, 0, -n);
  stdout.write(msg);
  readline.clearLine(stdout, CLEAR_RIGHT_OF_CURSOR);
  readline.cursorTo(stdout, 0);
  readline.moveCursor(stdout, 0, n);
}
function clearNthLine(stdout, n) {
  if (!chalk.supportsColor) {
    return;
  }

  if (n == 0) {
    clearLine(stdout);
    return;
  }

  readline.cursorTo(stdout, 0);
  readline.moveCursor(stdout, 0, -n);
  readline.clearLine(stdout, CLEAR_WHOLE_LINE);
  readline.moveCursor(stdout, 0, n);
}

class ProgressBar {
  constructor(total, stdout = process.stderr, callback) {
    this.stdout = stdout;
    this.total = total;
    this.chars = ProgressBar.bars[0];
    this.delay = 60;
    this.curr = 0;
    this._callback = callback;
    clearLine(stdout);
  }

  tick() {
    if (this.curr >= this.total) {
      return;
    }

    this.curr++; // schedule render

    if (!this.id) {
      this.id = setTimeout(() => this.render(), this.delay);
    }
  }

  cancelTick() {
    if (this.id) {
      clearTimeout(this.id);
      this.id = null;
    }
  }

  stop() {
    // "stop" by setting current to end so `tick` becomes noop
    this.curr = this.total;
    this.cancelTick();
    clearLine(this.stdout);

    if (this._callback) {
      this._callback(this);
    }
  }

  render() {
    // clear throttle
    this.cancelTick();
    let ratio = this.curr / this.total;
    ratio = Math.min(Math.max(ratio, 0), 1); // progress without bar

    let bar = ` ${this.curr}/${this.total}`; // calculate size of actual bar
    // $FlowFixMe: investigate process.stderr.columns flow error
    // @ts-ignore

    const availableSpace = Math.max(0, this.stdout.columns - bar.length - 3);
    const width = Math.min(this.total, availableSpace);
    const completeLength = Math.round(width * ratio);
    const complete = this.chars[0].repeat(completeLength);
    const incomplete = this.chars[1].repeat(width - completeLength);
    bar = `[${complete}${incomplete}]${bar}`;
    toStartOfLine(this.stdout);
    this.stdout.write(bar);
  }

}
ProgressBar.bars = [['#', '-']];

class Spinner {
  constructor(stdout = process.stderr, lineNumber = 0) {
    this.current = 0;
    this.prefix = '';
    this.lineNumber = lineNumber;
    this.stdout = stdout;
    this.delay = 60;
    this.chars = Spinner.spinners[28].split('');
    this.text = '';
    this.id = null;
  }

  setPrefix(prefix) {
    this.prefix = prefix;
  }

  setText(text) {
    this.text = text;
  }

  start() {
    this.current = 0;
    this.render();
  }

  render() {
    if (this.id) {
      clearTimeout(this.id);
    } // build line ensuring we don't wrap to the next line


    let msg = `${this.prefix}${this.chars[this.current]} ${this.text}`; // @ts-ignore

    const columns = typeof this.stdout.columns === 'number' ? this.stdout.columns : 100;
    msg = msg.slice(0, columns);
    writeOnNthLine(this.stdout, this.lineNumber, msg);
    this.current = ++this.current % this.chars.length;
    this.id = setTimeout(() => this.render(), this.delay);
  }

  stop() {
    if (this.id) {
      clearTimeout(this.id);
      this.id = null;
    }

    clearNthLine(this.stdout, this.lineNumber);
  }

}
Spinner.spinners = ['|/-\\', '⠂-–—–-', '◐◓◑◒', '◴◷◶◵', '◰◳◲◱', '▖▘▝▗', '■□▪▫', '▌▀▐▄', '▉▊▋▌▍▎▏▎▍▌▋▊▉', '▁▃▄▅▆▇█▇▆▅▄▃', '←↖↑↗→↘↓↙', '┤┘┴└├┌┬┐', '◢◣◤◥', '.oO°Oo.', '.oO@*', '🌍🌎🌏', '◡◡ ⊙⊙ ◠◠', '☱☲☴', '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏', '⠋⠙⠚⠞⠖⠦⠴⠲⠳⠓', '⠄⠆⠇⠋⠙⠸⠰⠠⠰⠸⠙⠋⠇⠆', '⠋⠙⠚⠒⠂⠂⠒⠲⠴⠦⠖⠒⠐⠐⠒⠓⠋', '⠁⠉⠙⠚⠒⠂⠂⠒⠲⠴⠤⠄⠄⠤⠴⠲⠒⠂⠂⠒⠚⠙⠉⠁', '⠈⠉⠋⠓⠒⠐⠐⠒⠖⠦⠤⠠⠠⠤⠦⠖⠒⠐⠐⠒⠓⠋⠉⠈', '⠁⠁⠉⠙⠚⠒⠂⠂⠒⠲⠴⠤⠄⠄⠤⠠⠠⠤⠦⠖⠒⠐⠐⠒⠓⠋⠉⠈⠈', '⢄⢂⢁⡁⡈⡐⡠', '⢹⢺⢼⣸⣇⡧⡗⡏', '⣾⣽⣻⢿⡿⣟⣯⣷', '⠁⠂⠄⡀⢀⠠⠐⠈'];

const auditSeverityColors = {
  info: chalk.bold,
  low: chalk.bold,
  moderate: chalk.yellow,
  high: chalk.red,
  critical: chalk.bgRed
}; // fixes bold on windows

if (process.platform === 'win32' && !(process.env.TERM && /^xterm/i.test(process.env.TERM))) {
  // @ts-ignore
  chalk.bold._styles[0].close += '\u001b[m';
}

class ConsoleReporter extends BaseReporter {
  constructor(opts) {
    super(opts);
    this._lastCategorySize = 0;
    this._spinners = new Set();
    this.format = chalk;
    this.format.stripColor = stripAnsi;
    this.isSilent = !!opts.isSilent;
  }

  _prependEmoji(msg, emoji) {
    if (this.emoji && emoji && this.isTTY) {
      msg = `${emoji}  ${msg}`;
    }

    return msg;
  }

  _logCategory(category, color, msg) {
    this._lastCategorySize = category.length;

    this._log(`${this.format[color](category)} ${msg}`);
  }

  _verbose(msg) {
    this._logCategory('verbose', 'grey', `${process.uptime()} ${msg}`);
  }

  _verboseInspect(obj) {
    this.inspect(obj);
  }

  close() {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this._spinners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        const spinner = _step.value;
        spinner.stop();
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    this._spinners.clear();

    this.stopProgress();
    super.close();
  }

  table(head, body) {
    //
    head = head.map(field => this.format.underline(field)); //

    const rows = [head].concat(body); // get column widths

    const cols = [];

    for (let i = 0; i < head.length; i++) {
      const widths = rows.map(row => this.format.stripColor(row[i]).length);
      cols[i] = Math.max(...widths);
    } //


    const builtRows = rows.map(row => {
      for (let i = 0; i < row.length; i++) {
        const field = row[i];
        const padding = cols[i] - this.format.stripColor(field).length;
        row[i] = field + ' '.repeat(padding);
      }

      return row.join(' ');
    });
    this.log(builtRows.join('\n'));
  }

  step(current, total, msg, emoji) {
    msg = this._prependEmoji(msg, emoji);

    if (msg.endsWith('?')) {
      msg = `${removeSuffix(msg, '?')}...?`;
    } else {
      msg += '...';
    }

    this.log(`${this.format.dim(`[${current}/${total}]`)} ${msg}`);
  }

  inspect(value) {
    if (typeof value !== 'number' && typeof value !== 'string') {
      value = util.inspect(value, {
        breakLength: 0,
        colors: this.isTTY,
        depth: null,
        maxArrayLength: null
      });
    }

    this.log(String(value), {
      force: true
    });
  }

  list(key, items, hints) {
    const gutterWidth = (this._lastCategorySize || 2) - 1;

    if (hints) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = items[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          const item = _step2.value;

          this._log(`${' '.repeat(gutterWidth)}- ${this.format.bold(item)}`);

          this._log(`  ${' '.repeat(gutterWidth)} ${hints[item]}`);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    } else {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = items[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          const item = _step3.value;

          this._log(`${' '.repeat(gutterWidth)}- ${item}`);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }

  header(command, pkg) {
    this.log(this.format.bold(`${pkg.name} ${command} v${pkg.version}`));
  }

  footer(showPeakMemory) {
    this.stopProgress();
    const totalTime = (this.getTotalTime() / 1000).toFixed(2);
    let msg = `Done in ${totalTime}s.`;

    if (showPeakMemory) {
      const peakMemory = (this.peakMemory / 1024 / 1024).toFixed(2);
      msg += ` Peak memory usage ${peakMemory}MB.`;
    }

    this.log(this._prependEmoji(msg, '✨'));
  }

  log(msg, {
    force = false
  } = {}) {
    this._lastCategorySize = 0;

    this._log(msg, {
      force
    });
  }

  _log(msg, {
    force = false
  } = {}) {
    if (this.isSilent && !force) {
      return;
    }

    clearLine(this.stdout);
    this.stdout.write(`${msg}\n`);
  }

  success(msg) {
    this._logCategory('success', 'green', msg);
  }

  error(msg) {
    clearLine(this.stderr);
    this.stderr.write(`${this.format.red('error')} ${msg}\n`);
  }

  info(msg) {
    this._logCategory('info', 'blue', msg);
  }

  command(command) {
    this.log(this.format.dim(`$ ${command}`));
  }

  warn(msg) {
    clearLine(this.stderr);
    this.stderr.write(`${this.format.yellow('warning')} ${msg}\n`);
  }

  question(question, options = {}) {
    if (!process.stdout.isTTY) {
      return Promise.reject(new Error("Can't answer a question unless a user TTY"));
    }

    return new Promise((resolve, reject) => {
      read({
        prompt: `${this.format.dim('question')} ${question}: `,
        silent: !!options.password,
        output: this.stdout,
        input: this.stdin
      }, (err, answer) => {
        if (err) {
          if (err.message === 'canceled') {
            process.exitCode = 1;
          }

          reject(err);
        } else {
          if (!answer && options.required) {
            this.error(this.lang('answerRequired'));
            resolve(this.question(question, options));
          } else {
            resolve(answer);
          }
        }
      });
    });
  } // handles basic tree output to console


  tree(key, trees, {
    force = false
  } = {}) {
    this.stopProgress(); //

    if (this.isSilent && !force) {
      return;
    }

    const output = ({
      name,
      children,
      hint,
      color
    }, titlePrefix, childrenPrefix) => {
      const formatter = this.format;
      const out = getFormattedOutput({
        prefix: titlePrefix,
        hint,
        color,
        name,
        formatter
      });
      this.stdout.write(out);

      if (children && children.length) {
        recurseTree(sortTrees(children), childrenPrefix, output);
      }
    };

    recurseTree(sortTrees(trees), '', output);
  }

  activitySet(total, workers) {
    if (!this.isTTY || this.noProgress) {
      return super.activitySet(total, workers);
    }

    const spinners = [];
    const reporterSpinners = this._spinners;

    for (let i = 1; i < workers; i++) {
      this.log('');
    }

    for (let i = 0; i < workers; i++) {
      const spinner = new Spinner(this.stderr, i);
      reporterSpinners.add(spinner);
      spinner.start();
      let prefix = null;
      let current = 0;

      const updatePrefix = () => {
        spinner.setPrefix(`${this.format.dim(`[${current === 0 ? '-' : current}/${total}]`)} `);
      };

      const clear = () => {
        prefix = null;
        current = 0;
        updatePrefix();
        spinner.setText('waiting...');
      };

      clear();
      spinners.unshift({
        clear,

        setPrefix(_current, _prefix) {
          current = _current;
          prefix = _prefix;
          spinner.setText(prefix);
          updatePrefix();
        },

        tick(msg) {
          if (prefix) {
            msg = `${prefix}: ${msg}`;
          }

          spinner.setText(msg);
        },

        end() {
          spinner.stop();
          reporterSpinners.delete(spinner);
        }

      });
    }

    return {
      spinners,
      end: () => {
        for (var _i = 0; _i < spinners.length; _i++) {
          const spinner = spinners[_i];
          spinner.end();
        }

        readline.moveCursor(this.stdout, 0, -workers + 1);
      }
    };
  }

  activity() {
    if (!this.isTTY) {
      return {
        tick() {},

        end() {}

      };
    }

    const reporterSpinners = this._spinners;
    const spinner = new Spinner(this.stderr);
    spinner.start();
    reporterSpinners.add(spinner);
    return {
      tick(name) {
        spinner.setText(name);
      },

      end() {
        spinner.stop();
        reporterSpinners.delete(spinner);
      }

    };
  }

  select(header, question, options) {
    if (!this.isTTY) {
      return Promise.reject(new Error("Can't answer a question unless a user TTY"));
    }

    const rl = readline.createInterface({
      input: this.stdin,
      output: this.stdout,
      terminal: true
    });
    const questions = options.map(opt => opt.name);
    const answers = options.map(opt => opt.value);

    function toIndex(input) {
      const index = answers.indexOf(input);

      if (index >= 0) {
        return index;
      } else {
        return +input;
      }
    }

    return new Promise(resolve => {
      this.info(header);

      for (let i = 0; i < questions.length; i++) {
        this.log(`  ${this.format.dim(`${i + 1})`)} ${questions[i]}`);
      }

      const ask = () => {
        rl.question(`${question}: `, input => {
          let index = toIndex(input);

          if (isNaN(index)) {
            this.log('Not a number');
            ask();
            return;
          }

          if (index <= 0 || index > options.length) {
            this.log('Outside answer range');
            ask();
            return;
          } // get index


          index--;
          rl.close();
          resolve(answers[index]);
        });
      };

      ask();
    });
  }

  progress(count) {
    if (this.noProgress || count <= 0) {
      return function () {// noop
      };
    }

    if (!this.isTTY) {
      return function () {// TODO what should the behaviour here be? we could buffer progress messages maybe
      };
    } // Clear any potentially old progress bars


    this.stopProgress();
    const bar = this._progressBar = new ProgressBar(count, this.stderr, progress => {
      if (progress === this._progressBar) {
        this._progressBar = null;
      }
    });
    bar.render();
    return function () {
      bar.tick();
    };
  }

  stopProgress() {
    if (this._progressBar) {
      this._progressBar.stop();
    }
  }

  prompt(message, choices, options = {}) {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (!process.stdout.isTTY) {
        return Promise.reject(new Error("Can't answer a question unless a user TTY"));
      }

      let pageSize;

      if (process.stdout instanceof tty.WriteStream) {
        pageSize = process.stdout.rows - 2;
      }

      const rl = readline.createInterface({
        input: _this.stdin,
        output: _this.stdout,
        terminal: true
      }); // $FlowFixMe: Need to update the type of Inquirer

      const prompt = inquirer.createPromptModule({
        input: _this.stdin,
        output: _this.stdout
      });
      const _options$name = options.name,
            name = _options$name === void 0 ? 'prompt' : _options$name,
            _options$type = options.type,
            type = _options$type === void 0 ? 'input' : _options$type,
            validate = options.validate;
      const answers = yield prompt([{
        name,
        type,
        message,
        choices,
        pageSize,
        validate,
        default: options.default
      }]);
      rl.close();
      return answers[name];
    })();
  }

}

class JSONReporter extends BaseReporter {
  constructor(opts) {
    super(opts);
    this._activityId = 0;
    this._progressId = 0;
  }

  _dump(type, data, error) {
    let stdout = this.stdout;

    if (error) {
      stdout = this.stderr;
    }

    stdout.write(`${JSON.stringify({
      type,
      data
    })}\n`);
  }

  _verbose(msg) {
    this._dump('verbose', msg);
  }

  list(type, items, hints) {
    this._dump('list', {
      type,
      items,
      hints
    });
  }

  tree(type, trees) {
    this._dump('tree', {
      type,
      trees
    });
  }

  step(current, total, message) {
    this._dump('step', {
      message,
      current,
      total
    });
  }

  inspect(value) {
    this._dump('inspect', value);
  }

  footer(showPeakMemory) {
    this._dump('finished', this.getTotalTime());
  }

  log(msg) {
    this._dump('log', msg);
  }

  command(msg) {
    this._dump('command', msg);
  }

  table(head, body) {
    this._dump('table', {
      head,
      body
    });
  }

  success(msg) {
    this._dump('success', msg);
  }

  error(msg) {
    this._dump('error', msg, true);
  }

  warn(msg) {
    this._dump('warning', msg, true);
  }

  info(msg) {
    this._dump('info', msg);
  }

  activitySet(total, workers) {
    if (!this.isTTY || this.noProgress) {
      return super.activitySet(total, workers);
    }

    const id = this._activityId++;

    this._dump('activitySetStart', {
      id,
      total,
      workers
    });

    const spinners = [];

    for (let i = 0; i < workers; i++) {
      let current = 0;
      let header = '';
      spinners.push({
        clear() {},

        setPrefix(_current, _header) {
          current = _current;
          header = _header;
        },

        tick: msg => {
          this._dump('activitySetTick', {
            id,
            header,
            current,
            worker: i,
            message: msg
          });
        },

        end() {}

      });
    }

    return {
      spinners,
      end: () => {
        this._dump('activitySetEnd', {
          id
        });
      }
    };
  }

  activity() {
    return this._activity({});
  }

  _activity(data) {
    if (!this.isTTY || this.noProgress) {
      return {
        tick() {},

        end() {}

      };
    }

    const id = this._activityId++;

    this._dump('activityStart', Object.assign({
      id
    }, data));

    return {
      tick: name => {
        this._dump('activityTick', {
          id,
          name
        });
      },
      end: () => {
        this._dump('activityEnd', {
          id
        });
      }
    };
  }

  progress(total) {
    if (this.noProgress) {
      return function () {// noop
      };
    }

    const id = this._progressId++;
    let current = 0;

    this._dump('progressStart', {
      id,
      total
    });

    return () => {
      current++;

      this._dump('progressTick', {
        id,
        current
      });

      if (current === total) {
        this._dump('progressFinish', {
          id
        });
      }
    };
  }

}

// import os from 'os';
// import * as path from 'path';
// import userHome from './util/user-home-dir.js';
// import {getCacheDir, getConfigDir, getDataDir} from './util/user-dirs.js';
const DEPENDENCY_TYPES = ['devDependencies', 'dependencies', 'legacyDependencies']; // export const OWNED_DEPENDENCY_TYPES = ['devDependencies', 'dependencies', 'legacyDependencies'];

const RESOLUTIONS = 'resolutions';
const MANIFEST_FIELDS = [RESOLUTIONS, ...DEPENDENCY_TYPES];
const SUPPORTED_NODE_VERSIONS = '>=8.5.0'; // export const PIKA_REGISTRY = 'https://registry.npmjs.org';
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

const CHILD_CONCURRENCY = 5; // export const REQUIRED_PACKAGE_KEYS = ['name', 'version', '_uid'];
const NODE_PACKAGE_JSON = 'package.json'; // export const PNP_FILENAME = '.pnp';
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

const DEFAULT_INDENT = '  '; // export const SINGLE_INSTANCE_PORT = 31997;
// export const SINGLE_INSTANCE_FILENAME = '.pika-single-instance';

const ENV_PATH_KEY = getPathKey(process.platform, process.env);
function getPathKey(platform, env) {
  let pathKey = 'PATH'; // windows calls its path "Path" usually, but this is not guaranteed.

  if (platform === 'win32') {
    pathKey = 'Path';

    for (const key in env) {
      if (key.toLowerCase() === 'path') {
        pathKey = key;
      }
    }
  }

  return pathKey;
} // export const VERSION_COLOR_SCHEME: {[key: string]: VersionColor} = {
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

function nullify(obj) {
  if (Array.isArray(obj)) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = obj[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        const item = _step.value;
        nullify(item);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  } else if (obj !== null && typeof obj === 'object' || typeof obj === 'function') {
    Object.setPrototypeOf(obj, null); // for..in can only be applied to 'object', not 'function'

    if (typeof obj === 'object') {
      for (const key in obj) {
        nullify(obj[key]);
      }
    }
  }

  return obj;
}

const unlink = util.promisify(_rimraf);
const glob = util.promisify(_glob);
const mkdirp = util.promisify(_mkdirp); //
const open = util.promisify(fs.open);
const writeFile = util.promisify(fs.writeFile);
const readlink = util.promisify(fs.readlink);
const realpath = util.promisify(fs.realpath);
const readdir = util.promisify(fs.readdir);
const rename = util.promisify(fs.rename);
const access = util.promisify(fs.access);
const stat = util.promisify(fs.stat);
const exists = util.promisify(fs.exists);
const lstat = util.promisify(fs.lstat);
const chmod = util.promisify(fs.chmod);
const link = util.promisify(fs.link);
const copyFile = util.promisify(fs.copyFile);
const readFileBuffer = util.promisify(fs.readFile);
const readFile = path => {
  return util.promisify(fs.readFile)(path, {
    encoding: 'utf-8'
  });
}; // export {unlink};
// export type CopyQueueItem = {
//   src: string,
//   dest: string,
//   type?: string,
//   onFresh?: () => void,
//   onDone?: () => void,
// };
// type CopyQueue = Array<CopyQueueItem>;
// type LinkFileAction = {
//   src: string,
//   dest: string,
//   removeDest: boolean,
// };
// type CopySymlinkAction = {
//   dest: string,
//   linkname: string,
// };
// type CopyActions = {
//   file: Array<CopyFileAction>,
//   symlink: Array<CopySymlinkAction>,
//   link: Array<LinkFileAction>,
// };
// type CopyOptions = {
//   onProgress: (dest: string) => void,
//   onStart: (num: number) => void,
//   possibleExtraneous: Set<string>,
//   ignoreBasenames: Array<string>,
//   artifactFiles: Array<string>,
// };
// type FailedFolderQuery = {
//   error: Error,
//   folder: string,
// };
// type FolderQueryResult = {
//   skipped: Array<FailedFolderQuery>,
//   folder?: string,
// };
// async function buildActionsForCopy(
//   queue: CopyQueue,
//   events: CopyOptions,
//   possibleExtraneous: Set<string>,
//   reporter: Reporter,
// ): Promise<CopyActions> {
//   const artifactFiles: Set<string> = new Set(events.artifactFiles || []);
//   const files: Set<string> = new Set();
//   // initialise events
//   for (const item of queue) {
//     const onDone = item.onDone;
//     item.onDone = () => {
//       events.onProgress(item.dest);
//       if (onDone) {
//         onDone();
//       }
//     };
//   }
//   events.onStart(queue.length);
//   // start building actions
//   const actions: CopyActions = {
//     file: [],
//     symlink: [],
//     link: [],
//   };
//   // custom concurrency logic as we're always executing stacks of CONCURRENT_QUEUE_ITEMS queue items
//   // at a time due to the requirement to push items onto the queue
//   while (queue.length) {
//     const items = queue.splice(0, CONCURRENT_QUEUE_ITEMS);
//     await Promise.all(items.map(build));
//   }
//   // simulate the existence of some files to prevent considering them extraneous
//   for (const file of artifactFiles) {
//     if (possibleExtraneous.has(file)) {
//       reporter.verbose(reporter.lang('verboseFilePhantomExtraneous', file));
//       possibleExtraneous.delete(file);
//     }
//   }
//   for (const loc of possibleExtraneous) {
//     if (files.has(loc.toLowerCase())) {
//       possibleExtraneous.delete(loc);
//     }
//   }
//   return actions;
//   //
//   async function build(data: CopyQueueItem): Promise<void> {
//     const {src, dest, type} = data;
//     const onFresh = data.onFresh || noop;
//     const onDone = data.onDone || noop;
//     // TODO https://github.com/yarnpkg/yarn/issues/3751
//     // related to bundled dependencies handling
//     if (files.has(dest.toLowerCase())) {
//       reporter.verbose(`The case-insensitive file ${dest} shouldn't be copied twice in one bulk copy`);
//     } else {
//       files.add(dest.toLowerCase());
//     }
//     if (type === 'symlink') {
//       await mkdirp(path.dirname(dest));
//       onFresh();
//       actions.symlink.push({
//         dest,
//         linkname: src,
//       });
//       onDone();
//       return;
//     }
//     if (events.ignoreBasenames.indexOf(path.basename(src)) >= 0) {
//       // ignored file
//       return;
//     }
//     const srcStat = await lstat(src);
//     let srcFiles;
//     if (srcStat.isDirectory()) {
//       srcFiles = await readdir(src);
//     }
//     let destStat;
//     try {
//       // try accessing the destination
//       destStat = await lstat(dest);
//     } catch (e) {
//       // proceed if destination doesn't exist, otherwise error
//       if (e.code !== 'ENOENT') {
//         throw e;
//       }
//     }
//     // if destination exists
//     if (destStat) {
//       const bothSymlinks = srcStat.isSymbolicLink() && destStat.isSymbolicLink();
//       const bothFolders = srcStat.isDirectory() && destStat.isDirectory();
//       const bothFiles = srcStat.isFile() && destStat.isFile();
//       // EINVAL access errors sometimes happen which shouldn't because node shouldn't be giving
//       // us modes that aren't valid. investigate this, it's generally safe to proceed.
//       /* if (srcStat.mode !== destStat.mode) {
//         try {
//           await access(dest, srcStat.mode);
//         } catch (err) {}
//       } */
//       if (bothFiles && artifactFiles.has(dest)) {
//         // this file gets changed during build, likely by a custom install script. Don't bother checking it.
//         onDone();
//         reporter.verbose(reporter.lang('verboseFileSkipArtifact', src));
//         return;
//       }
//       if (bothFiles && srcStat.size === destStat.size && fileDatesEqual(srcStat.mtime, destStat.mtime)) {
//         // we can safely assume this is the same file
//         onDone();
//         reporter.verbose(reporter.lang('verboseFileSkip', src, dest, srcStat.size, +srcStat.mtime));
//         return;
//       }
//       if (bothSymlinks) {
//         const srcReallink = await readlink(src);
//         if (srcReallink === (await readlink(dest))) {
//           // if both symlinks are the same then we can continue on
//           onDone();
//           reporter.verbose(reporter.lang('verboseFileSkipSymlink', src, dest, srcReallink));
//           return;
//         }
//       }
//       if (bothFolders) {
//         // mark files that aren't in this folder as possibly extraneous
//         const destFiles = await readdir(dest);
//         invariant(srcFiles, 'src files not initialised');
//         for (const file of destFiles) {
//           if (srcFiles.indexOf(file) < 0) {
//             const loc = path.join(dest, file);
//             possibleExtraneous.add(loc);
//             if ((await lstat(loc)).isDirectory()) {
//               for (const file of await readdir(loc)) {
//                 possibleExtraneous.add(path.join(loc, file));
//               }
//             }
//           }
//         }
//       }
//     }
//     if (destStat && destStat.isSymbolicLink()) {
//       await unlink(dest);
//       destStat = null;
//     }
//     if (srcStat.isSymbolicLink()) {
//       onFresh();
//       const linkname = await readlink(src);
//       actions.symlink.push({
//         dest,
//         linkname,
//       });
//       onDone();
//     } else if (srcStat.isDirectory()) {
//       if (!destStat) {
//         reporter.verbose(reporter.lang('verboseFileFolder', dest));
//         await mkdirp(dest);
//       }
//       const destParts = dest.split(path.sep);
//       while (destParts.length) {
//         files.add(destParts.join(path.sep).toLowerCase());
//         destParts.pop();
//       }
//       // push all files to queue
//       invariant(srcFiles, 'src files not initialised');
//       let remaining = srcFiles.length;
//       if (!remaining) {
//         onDone();
//       }
//       for (const file of srcFiles) {
//         queue.push({
//           dest: path.join(dest, file),
//           onFresh,
//           onDone: () => {
//             if (--remaining === 0) {
//               onDone();
//             }
//           },
//           src: path.join(src, file),
//         });
//       }
//     } else if (srcStat.isFile()) {
//       onFresh();
//       actions.file.push({
//         src,
//         dest,
//         atime: srcStat.atime,
//         mtime: srcStat.mtime,
//         mode: srcStat.mode,
//       });
//       onDone();
//     } else {
//       throw new Error(`unsure how to copy this: ${src}`);
//     }
//   }
// }
// async function buildActionsForHardlink(
//   queue: CopyQueue,
//   events: CopyOptions,
//   possibleExtraneous: Set<string>,
//   reporter: Reporter,
// ): Promise<CopyActions> {
//   const artifactFiles: Set<string> = new Set(events.artifactFiles || []);
//   const files: Set<string> = new Set();
//   // initialise events
//   for (const item of queue) {
//     const onDone = item.onDone || noop;
//     item.onDone = () => {
//       events.onProgress(item.dest);
//       onDone();
//     };
//   }
//   events.onStart(queue.length);
//   // start building actions
//   const actions: CopyActions = {
//     file: [],
//     symlink: [],
//     link: [],
//   };
//   // custom concurrency logic as we're always executing stacks of CONCURRENT_QUEUE_ITEMS queue items
//   // at a time due to the requirement to push items onto the queue
//   while (queue.length) {
//     const items = queue.splice(0, CONCURRENT_QUEUE_ITEMS);
//     await Promise.all(items.map(build));
//   }
//   // simulate the existence of some files to prevent considering them extraneous
//   for (const file of artifactFiles) {
//     if (possibleExtraneous.has(file)) {
//       reporter.verbose(reporter.lang('verboseFilePhantomExtraneous', file));
//       possibleExtraneous.delete(file);
//     }
//   }
//   for (const loc of possibleExtraneous) {
//     if (files.has(loc.toLowerCase())) {
//       possibleExtraneous.delete(loc);
//     }
//   }
//   return actions;
//   //
//   async function build(data: CopyQueueItem): Promise<void> {
//     const {src, dest} = data;
//     const onFresh = data.onFresh || noop;
//     const onDone = data.onDone || noop;
//     if (files.has(dest.toLowerCase())) {
//       // Fixes issue https://github.com/yarnpkg/yarn/issues/2734
//       // When bulk hardlinking we have A -> B structure that we want to hardlink to A1 -> B1,
//       // package-linker passes that modules A1 and B1 need to be hardlinked,
//       // the recursive linking algorithm of A1 ends up scheduling files in B1 to be linked twice which will case
//       // an exception.
//       onDone();
//       return;
//     }
//     files.add(dest.toLowerCase());
//     if (events.ignoreBasenames.indexOf(path.basename(src)) >= 0) {
//       // ignored file
//       return;
//     }
//     const srcStat = await lstat(src);
//     let srcFiles;
//     if (srcStat.isDirectory()) {
//       srcFiles = await readdir(src);
//     }
//     const destExists = await exists(dest);
//     if (destExists) {
//       const destStat = await lstat(dest);
//       const bothSymlinks = srcStat.isSymbolicLink() && destStat.isSymbolicLink();
//       const bothFolders = srcStat.isDirectory() && destStat.isDirectory();
//       const bothFiles = srcStat.isFile() && destStat.isFile();
//       if (srcStat.mode !== destStat.mode) {
//         try {
//           await access(dest, srcStat.mode);
//         } catch (err) {
//           // EINVAL access errors sometimes happen which shouldn't because node shouldn't be giving
//           // us modes that aren't valid. investigate this, it's generally safe to proceed.
//           reporter.verbose(err);
//         }
//       }
//       if (bothFiles && artifactFiles.has(dest)) {
//         // this file gets changed during build, likely by a custom install script. Don't bother checking it.
//         onDone();
//         reporter.verbose(reporter.lang('verboseFileSkipArtifact', src));
//         return;
//       }
//       // correct hardlink
//       if (bothFiles && srcStat.ino !== null && srcStat.ino === destStat.ino) {
//         onDone();
//         reporter.verbose(reporter.lang('verboseFileSkip', src, dest, srcStat.ino));
//         return;
//       }
//       if (bothSymlinks) {
//         const srcReallink = await readlink(src);
//         if (srcReallink === (await readlink(dest))) {
//           // if both symlinks are the same then we can continue on
//           onDone();
//           reporter.verbose(reporter.lang('verboseFileSkipSymlink', src, dest, srcReallink));
//           return;
//         }
//       }
//       if (bothFolders) {
//         // mark files that aren't in this folder as possibly extraneous
//         const destFiles = await readdir(dest);
//         invariant(srcFiles, 'src files not initialised');
//         for (const file of destFiles) {
//           if (srcFiles.indexOf(file) < 0) {
//             const loc = path.join(dest, file);
//             possibleExtraneous.add(loc);
//             if ((await lstat(loc)).isDirectory()) {
//               for (const file of await readdir(loc)) {
//                 possibleExtraneous.add(path.join(loc, file));
//               }
//             }
//           }
//         }
//       }
//     }
//     if (srcStat.isSymbolicLink()) {
//       onFresh();
//       const linkname = await readlink(src);
//       actions.symlink.push({
//         dest,
//         linkname,
//       });
//       onDone();
//     } else if (srcStat.isDirectory()) {
//       reporter.verbose(reporter.lang('verboseFileFolder', dest));
//       await mkdirp(dest);
//       const destParts = dest.split(path.sep);
//       while (destParts.length) {
//         files.add(destParts.join(path.sep).toLowerCase());
//         destParts.pop();
//       }
//       // push all files to queue
//       invariant(srcFiles, 'src files not initialised');
//       let remaining = srcFiles.length;
//       if (!remaining) {
//         onDone();
//       }
//       for (const file of srcFiles) {
//         queue.push({
//           onFresh,
//           src: path.join(src, file),
//           dest: path.join(dest, file),
//           onDone: () => {
//             if (--remaining === 0) {
//               onDone();
//             }
//           },
//         });
//       }
//     } else if (srcStat.isFile()) {
//       onFresh();
//       actions.link.push({
//         src,
//         dest,
//         removeDest: destExists,
//       });
//       onDone();
//     } else {
//       throw new Error(`unsure how to copy this: ${src}`);
//     }
//   }
// }
// export function copy(src: string, dest: string, reporter: Reporter): Promise<void> {
//   return copyBulk([{src, dest}], reporter);
// }
// export async function copyBulk(
//   queue: CopyQueue,
//   reporter: Reporter,
//   _events?: {
//     onProgress?: (dest: string) => void,
//     onStart?: (num: number) => void,
//     possibleExtraneous: Set<string>,
//     ignoreBasenames?: Array<string>,
//     artifactFiles?: Array<string>,
//   },
// ): Promise<void> {
//   const events: CopyOptions = {
//     onStart: (_events && _events.onStart) || noop,
//     onProgress: (_events && _events.onProgress) || noop,
//     possibleExtraneous: _events ? _events.possibleExtraneous : new Set(),
//     ignoreBasenames: (_events && _events.ignoreBasenames) || [],
//     artifactFiles: (_events && _events.artifactFiles) || [],
//   };
//   const actions: CopyActions = await buildActionsForCopy(queue, events, events.possibleExtraneous, reporter);
//   events.onStart(actions.file.length + actions.symlink.length + actions.link.length);
//   const fileActions: Array<CopyFileAction> = actions.file;
//   const currentlyWriting: Map<string, Promise<void>> = new Map();
//   await promise.queue(
//     fileActions,
//     async (data: CopyFileAction): Promise<void> => {
//       let writePromise;
//       while ((writePromise = currentlyWriting.get(data.dest))) {
//         await writePromise;
//       }
//       reporter.verbose(reporter.lang('verboseFileCopy', data.src, data.dest));
//       const copier = copyFile(data, () => currentlyWriting.delete(data.dest));
//       currentlyWriting.set(data.dest, copier);
//       events.onProgress(data.dest);
//       return copier;
//     },
//     CONCURRENT_QUEUE_ITEMS,
//   );
//   // we need to copy symlinks last as they could reference files we were copying
//   const symlinkActions: Array<CopySymlinkAction> = actions.symlink;
//   await promise.queue(symlinkActions, (data): Promise<void> => {
//     const linkname = path.resolve(path.dirname(data.dest), data.linkname);
//     reporter.verbose(reporter.lang('verboseFileSymlink', data.dest, linkname));
//     return symlink(linkname, data.dest);
//   });
// }
// export async function hardlinkBulk(
//   queue: CopyQueue,
//   reporter: Reporter,
//   _events?: {
//     onProgress?: (dest: string) => void,
//     onStart?: (num: number) => void,
//     possibleExtraneous: Set<string>,
//     artifactFiles?: Array<string>,
//   },
// ): Promise<void> {
//   const events: CopyOptions = {
//     onStart: (_events && _events.onStart) || noop,
//     onProgress: (_events && _events.onProgress) || noop,
//     possibleExtraneous: _events ? _events.possibleExtraneous : new Set(),
//     artifactFiles: (_events && _events.artifactFiles) || [],
//     ignoreBasenames: [],
//   };
//   const actions: CopyActions = await buildActionsForHardlink(queue, events, events.possibleExtraneous, reporter);
//   events.onStart(actions.file.length + actions.symlink.length + actions.link.length);
//   const fileActions: Array<LinkFileAction> = actions.link;
//   await promise.queue(
//     fileActions,
//     async (data): Promise<void> => {
//       reporter.verbose(reporter.lang('verboseFileLink', data.src, data.dest));
//       if (data.removeDest) {
//         await unlink(data.dest);
//       }
//       await link(data.src, data.dest);
//     },
//     CONCURRENT_QUEUE_ITEMS,
//   );
//   // we need to copy symlinks last as they could reference files we were copying
//   const symlinkActions: Array<CopySymlinkAction> = actions.symlink;
//   await promise.queue(symlinkActions, (data): Promise<void> => {
//     const linkname = path.resolve(path.dirname(data.dest), data.linkname);
//     reporter.verbose(reporter.lang('verboseFileSymlink', data.dest, linkname));
//     return symlink(linkname, data.dest);
//   });
// }
// function _readFile(loc: string, encoding: string): Promise<any> {
//   return new Promise((resolve, reject) => {
//     fs.readFile(loc, encoding, function(err, content) {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(content);
//       }
//     });
//   });
// }
// export function readFile(loc: string): Promise<string> {
//   return _readFile(loc, 'utf8').then(normalizeOS);
// }
// export function readFileRaw(loc: string): Promise<Buffer> {
//   return _readFile(loc, 'binary');
// }
// export async function readFileAny(files: Array<string>): Promise<string | null> {
//   for (const file of files) {
//     if (await exists(file)) {
//       return readFile(file);
//     }
//   }
//   return null;
// }

function readJson(_x) {
  return _readJson.apply(this, arguments);
}

function _readJson() {
  _readJson = _asyncToGenerator(function* (loc) {
    return (yield readJsonAndFile(loc)).object;
  });
  return _readJson.apply(this, arguments);
}

function readJsonAndFile(_x2) {
  return _readJsonAndFile.apply(this, arguments);
}

function _readJsonAndFile() {
  _readJsonAndFile = _asyncToGenerator(function* (loc) {
    const file = yield readFile(loc);

    try {
      return {
        object: nullify(JSON.parse(stripBOM(file))),
        content: file
      };
    } catch (err) {
      err.message = `${loc}: ${err.message}`;
      throw err;
    }
  });
  return _readJsonAndFile.apply(this, arguments);
}

const cr = '\r'.charCodeAt(0);
const lf = '\n'.charCodeAt(0);

function getEolFromFile(_x5) {
  return _getEolFromFile.apply(this, arguments);
}

function _getEolFromFile() {
  _getEolFromFile = _asyncToGenerator(function* (path) {
    if (!(yield exists(path))) {
      return undefined;
    }

    const buffer = yield readFileBuffer(path);

    for (let i = 0; i < buffer.length; ++i) {
      if (buffer[i] === cr) {
        return '\r\n';
      }

      if (buffer[i] === lf) {
        return '\n';
      }
    }

    return undefined;
  });
  return _getEolFromFile.apply(this, arguments);
}

function writeFilePreservingEol(_x6, _x7) {
  return _writeFilePreservingEol.apply(this, arguments);
} // export async function hardlinksWork(dir: string): Promise<boolean> {
//   const filename = 'test-file' + Math.random();
//   const file = path.join(dir, filename);
//   const fileLink = path.join(dir, filename + '-link');
//   try {
//     await writeFile(file, 'test');
//     await link(file, fileLink);
//   } catch (err) {
//     return false;
//   } finally {
//     await unlink(file);
//     await unlink(fileLink);
//   }
//   return true;
// }
// // not a strict polyfill for Node's fs.mkdtemp
// export async function makeTempDir(prefix?: string): Promise<string> {
//   const dir = path.join(os.tmpdir(), `pika-${prefix || ''}-${Date.now()}-${Math.random()}`);
//   await unlink(dir);
//   await mkdirp(dir);
//   return dir;
// }
// export async function readFirstAvailableStream(paths: Iterable<string>): Promise<?ReadStream> {
//   for (const path of paths) {
//     try {
//       const fd = await open(path, 'r');
//       return fs.createReadStream(path, {fd});
//     } catch (err) {
//       // Try the next one
//     }
//   }
//   return null;
// }
// export async function getFirstSuitableFolder(
//   paths: Iterable<string>,
//   mode: number = constants.W_OK | constants.X_OK, // eslint-disable-line no-bitwise
// ): Promise<FolderQueryResult> {
//   const result: FolderQueryResult = {
//     skipped: [],
//     folder: null,
//   };
//   for (const folder of paths) {
//     try {
//       await mkdirp(folder);
//       await access(folder, mode);
//       result.folder = folder;
//       return result;
//     } catch (error) {
//       result.skipped.push({
//         error,
//         folder,
//       });
//     }
//   }
//   return result;
// }

function _writeFilePreservingEol() {
  _writeFilePreservingEol = _asyncToGenerator(function* (path, data) {
    const eol = (yield getEolFromFile(path)) || os.EOL;

    if (eol !== '\n') {
      data = data.replace(/\n/g, eol);
    }

    yield writeFile(path, data);
  });
  return _writeFilePreservingEol.apply(this, arguments);
}

function generatePublishManifest(_x, _x2, _x3) {
  return _generatePublishManifest.apply(this, arguments);
}

function _generatePublishManifest() {
  _generatePublishManifest = _asyncToGenerator(function* (manifest, config, _dists) {
    const name = manifest.name,
          version = manifest.version,
          description = manifest.description,
          keywords = manifest.keywords,
          homepage = manifest.homepage,
          bugs = manifest.bugs,
          bin = manifest.bin,
          license = manifest.license,
          authors = manifest.authors,
          contributors = manifest.contributors,
          man = manifest.man,
          repository = manifest.repository,
          dependencies = manifest.dependencies,
          peerDependencies = manifest.peerDependencies,
          devDependencies = manifest.devDependencies,
          bundledDependencies = manifest.bundledDependencies,
          optionalDependencies = manifest.optionalDependencies,
          engines = manifest.engines,
          enginesStrict = manifest.enginesStrict,
          priv = manifest.private,
          publishConfig = manifest.publishConfig;
    const newManifest = {
      name,
      description,
      version,
      license,
      bin
    };
    const dists = _dists || (yield config.getDistributions());
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = dists[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        const _step$value = _slicedToArray(_step.value, 2),
              runner = _step$value[0],
              options = _step$value[1];

        if (runner.manifest) {
          yield runner.manifest(newManifest, {
            cwd: config.cwd,
            isFull: true,
            manifest,
            options
          });
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return Object.assign({}, newManifest, {
      pika: true,
      sideEffects: manifest.sideEffects || false,
      keywords,
      files: ['dist-*/', 'assets/', 'bin/'],
      homepage,
      bugs,
      authors,
      contributors,
      man,
      repository,
      dependencies: manifest.dependencies || {},
      peerDependencies,
      devDependencies,
      bundledDependencies,
      optionalDependencies,
      engines,
      enginesStrict,
      private: priv,
      publishConfig
    });
  });
  return _generatePublishManifest.apply(this, arguments);
}

function generatePrettyManifest(manifest) {
  return JSON.stringify(Object.assign({}, manifest, {
    dependencies: Object.keys(manifest.dependencies).length === 0 ? {} : '{ ... }'
  }), null, 2);
}

function setFlags(commander) {
  commander.description('Prepares your package out directory (pkg/) for publishing.');
  commander.usage('build [flags]');
  commander.option('-O, --out <path>', 'Where to write to');
  commander.option('--force', 'Whether to ignore failed build plugins and continue through errors.');
  commander.option('-P, --publish', 'Whether to include publish-only builds like unpkg & types.');
}
function hasWrapper(commander, args) {
  return true;
}
class Build {
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

  cleanup() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const out = _this.out;
      yield unlink(path.join(out, '*'));
    })();
  }

  init(isFull) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const config = _this2.config,
            out = _this2.out,
            reporter = _this2.reporter,
            flags = _this2.flags;
      const cwd = config.cwd;
      const outPretty = path.relative(cwd, out) + path.sep;
      const manifest = yield config.manifest;
      const distRunners = yield config.getDistributions();
      const builderConfig = {
        out,
        cwd,
        reporter: {
          info: msg => reporter.log(chalk.dim(`      » ${msg}`)),
          warning: msg => reporter.log(chalk.yellow(`      » ${msg}`)),
          success: msg => reporter.log(chalk.green(`      » ${msg}`)),
          created: (filename, entrypoint) => reporter.log(`      📝  ${chalk.green(path.relative(cwd, filename))} ${entrypoint ? chalk.dim(`[${entrypoint}]`) : ''}`)
        },
        isFull,
        manifest,
        src: {
          loc: path.join(out, 'dist-src'),
          entrypoint: path.join(out, 'dist-src', 'index.js'),
          // TODO: Deprecated, remove
          options: {},
          // TODO: Deprecated, remove
          files: yield _asyncToGenerator(function* () {
            const ignoreSet = new Set([]);
            ignoreSet.add('**/*/README.md');
            const files = yield glob(`src/**/*`, {
              cwd,
              nodir: true,
              absolute: true,
              ignore: Array.from(ignoreSet).map(g => path.join('src', g))
            });
            return files.filter(fileAbs => !fileAbs.endsWith('.d.ts'));
          })()
        }
      };
      const steps = [];
      steps.push(
      /*#__PURE__*/
      function () {
        var _ref2 = _asyncToGenerator(function* (curr, total) {
          _this2.reporter.step(curr, total, 'Validating source');

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = distRunners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              const _step$value = _slicedToArray(_step.value, 2),
                    runner = _step$value[0],
                    options = _step$value[1];

              if (runner.validate) {
                const result = yield runner.validate(Object.assign({}, builderConfig, {
                  options
                }));

                if (result instanceof Error) {
                  throw result;
                }
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        });

        return function (_x, _x2) {
          return _ref2.apply(this, arguments);
        };
      }());
      steps.push(
      /*#__PURE__*/
      function () {
        var _ref3 = _asyncToGenerator(function* (curr, total) {
          _this2.reporter.step(curr, total, `Preparing pipeline`);

          yield _this2.cleanup();
          reporter.log(`      ❇️  ${chalk.green(outPretty)}`);
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = distRunners[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              const _step2$value = _slicedToArray(_step2.value, 2),
                    runner = _step2$value[0],
                    options = _step2$value[1];

              yield runner.beforeBuild && runner.beforeBuild(Object.assign({}, builderConfig, {
                options
              }));
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        });

        return function (_x3, _x4) {
          return _ref3.apply(this, arguments);
        };
      }());

      if (distRunners.length === 0) {
        steps.push(
        /*#__PURE__*/
        function () {
          var _ref4 = _asyncToGenerator(function* (curr, total) {
            _this2.reporter.step(curr, total, `Pipeline is empty! See ${chalk.underline('https://github.com/pikapkg/pack')} for help getting started`);
          });

          return function (_x5, _x6) {
            return _ref4.apply(this, arguments);
          };
        }());
      }

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = distRunners[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          const _step3$value = _slicedToArray(_step3.value, 2),
                runner = _step3$value[0],
                options = _step3$value[1];

          steps.push(
          /*#__PURE__*/
          function () {
            var _ref6 = _asyncToGenerator(function* (curr, total) {
              _this2.reporter.step(curr, total, `Running ${chalk.bold(runner.name)}`); // return Promise.resolve(


              try {
                yield runner.beforeJob && runner.beforeJob(Object.assign({}, builderConfig, {
                  options
                }));
                yield runner.build && runner.build(Object.assign({}, builderConfig, {
                  options
                }));
                yield runner.afterJob && runner.afterJob(Object.assign({}, builderConfig, {
                  options
                }));
              } catch (err) {
                if (flags.force) {
                  console.log('      ❗️  ', chalk.red(err.message), chalk.dim('--force, continuing...'));
                } else {
                  throw err;
                }
              } // ).catch(err => {
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

            return function (_x9, _x10) {
              return _ref6.apply(this, arguments);
            };
          }());
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      steps.push(
      /*#__PURE__*/
      function () {
        var _ref5 = _asyncToGenerator(function* (curr, total) {
          _this2.reporter.step(curr, total, `Finalizing package`);

          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = distRunners[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              const _step4$value = _slicedToArray(_step4.value, 2),
                    runner = _step4$value[0],
                    options = _step4$value[1];

              yield runner.afterBuild && runner.afterBuild(Object.assign({}, builderConfig, {
                options
              }));
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }

          if (yield exists(path.join(cwd, 'CHANGELOG'))) {
            copyFile(path.join(cwd, 'CHANGELOG'), path.join(out, 'CHANGELOG'));
            reporter.log(chalk.dim(`      » copying CHANGELOG...`));
          } else if (yield exists(path.join(cwd, 'CHANGELOG.md'))) {
            copyFile(path.join(cwd, 'CHANGELOG.md'), path.join(out, 'CHANGELOG.md'));
            reporter.log(chalk.dim(`      » copying CHANGELOG.md...`));
          }

          if (yield exists(path.join(cwd, 'LICENSE'))) {
            copyFile(path.join(cwd, 'LICENSE'), path.join(out, 'LICENSE'));
            reporter.log(chalk.dim(`      » copying LICENSE...`));
          } else if (yield exists(path.join(cwd, 'LICENSE.md'))) {
            copyFile(path.join(cwd, 'LICENSE.md'), path.join(out, 'LICENSE.md'));
            reporter.log(chalk.dim(`      » copying LICENSE.md...`));
          }

          if (yield exists(path.join(cwd, 'README'))) {
            copyFile(path.join(cwd, 'README'), path.join(out, 'README'));
            reporter.log(chalk.dim(`      » copying README...`));
          } else if (yield exists(path.join(cwd, 'README.md'))) {
            copyFile(path.join(cwd, 'README.md'), path.join(out, 'README.md'));
            reporter.log(chalk.dim(`      » copying README.md...`));
          }

          const publishManifest = yield generatePublishManifest(config._manifest, config, distRunners);

          if (out === cwd) {
            reporter.log(`NEW MANIFEST:\n\n`);
            reporter.log(generatePrettyManifest(publishManifest));
            reporter.log(`\n\n`);
          } else {
            yield writeFilePreservingEol(path.join(out, 'package.json'), JSON.stringify(publishManifest, null, DEFAULT_INDENT) + '\n');
            reporter.log(`      📝  ` + chalk.green(outPretty + 'package.json'));
          }

          reporter.log(`      📦  ` + chalk.green(outPretty));
        });

        return function (_x7, _x8) {
          return _ref5.apply(this, arguments);
        };
      }());
      let currentStep = 0;

      for (var _i = 0; _i < steps.length; _i++) {
        const step = steps[_i];
        yield step(++currentStep, steps.length);
      }
    })();
  }

}
function run(_x11, _x12, _x13, _x14) {
  return _run.apply(this, arguments);
}

function _run() {
  _run = _asyncToGenerator(function* (config, reporter, flags, args) {
    const isProduction = flags.publish;
    const builder = new Build(flags, config, reporter);
    yield builder.init(isProduction);
  });
  return _run.apply(this, arguments);
}

var build = /*#__PURE__*/Object.freeze({
  setFlags: setFlags,
  hasWrapper: hasWrapper,
  Build: Build,
  run: run
});

const latestTag = () => execa.stdout('git', ['describe', '--abbrev=0']);

const firstCommit = () => execa.stdout('git', ['rev-list', '--max-parents=0', 'HEAD']);

function latestTagOrFirstCommit() {
  return _latestTagOrFirstCommit.apply(this, arguments);
}

function _latestTagOrFirstCommit() {
  _latestTagOrFirstCommit = _asyncToGenerator(function* () {
    let latest;

    try {
      // In case a previous tag exists, we use it to compare the current repo status to.
      latest = yield latestTag();
    } catch (_) {
      // Otherwise, we fallback to using the first commit for comparison.
      latest = yield firstCommit();
    }

    return latest;
  });
  return _latestTagOrFirstCommit.apply(this, arguments);
}
function hasUpstream() {
  return _hasUpstream.apply(this, arguments);
}

function _hasUpstream() {
  _hasUpstream = _asyncToGenerator(function* () {
    const _ref = yield execa('git', ['status', '--short', '--branch', '--porcelain=2']),
          stdout = _ref.stdout;

    return /^# branch\.upstream [\w\-/]+$/m.test(stdout);
  });
  return _hasUpstream.apply(this, arguments);
}

const SEMVER_INCREMENTS = ["patch", "minor", "major", "prepatch", "preminor", "premajor", "prerelease"];
const PRERELEASE_VERSIONS = ["prepatch", "preminor", "premajor", "prerelease"];

const isValidVersion = input => Boolean(semver.valid(input));

function isValidVersionInput(input) {
  return SEMVER_INCREMENTS.includes(input) || isValidVersion(input);
}
function isPrereleaseVersion(version) {
  return PRERELEASE_VERSIONS.includes(version) || Boolean(semver.prerelease(version));
}
function getNewVersion(oldVersion, input) {
  if (!isValidVersionInput(input)) {
    throw new Error(`Version should be either ${SEMVER_INCREMENTS.join(", ")} or a valid semver version.`);
  }

  return SEMVER_INCREMENTS.includes(input) ? semver.inc(oldVersion, input) : input;
}
function isVersionGreater(oldVersion, newVersion) {
  if (!isValidVersion(newVersion)) {
    throw new Error("Version should be a valid semver version.");
  }

  return semver.gt(newVersion, oldVersion);
}

function linkifyCommitRange(url, commitRange) {
  return `${commitRange} (${url}/compare/${commitRange})`;
}
let tagVersionPrefix;
function getTagVersionPrefix(_x) {
  return _getTagVersionPrefix.apply(this, arguments);
}

function _getTagVersionPrefix() {
  _getTagVersionPrefix = _asyncToGenerator(function* (options) {
    if (tagVersionPrefix) {
      return tagVersionPrefix;
    }

    try {
      if (options.yarn) {
        tagVersionPrefix = yield execa.stdout('yarn', ['config', 'get', 'version-tag-prefix']);
      } else {
        tagVersionPrefix = yield execa.stdout('npm', ['config', 'get', 'tag-version-prefix']);
      }
    } catch (_) {
      tagVersionPrefix = 'v';
    }

    return tagVersionPrefix;
  });
  return _getTagVersionPrefix.apply(this, arguments);
}

function prerequisites(_x, _x2) {
  return _prerequisites.apply(this, arguments);
}

function _prerequisites() {
  _prerequisites = _asyncToGenerator(function* (pkg, options) {
    const isExternalRegistry = typeof pkg.publishConfig === 'object' && typeof pkg.publishConfig.registry === 'string';
    let newVersion = null; // title: 'Ping npm registry',

    if (!(pkg.private || isExternalRegistry)) {
      yield pTimeout(_asyncToGenerator(function* () {
        try {
          yield execa('npm', ['ping']);
        } catch (_) {
          throw new Error('Connection to npm registry failed');
        }
      })(), 15000, 'Connection to npm registry timed out');
    } // title: 'Verify user is authenticated',


    if (!(process.env.NODE_ENV === 'test' || pkg.private || isExternalRegistry)) {
      let username;

      try {
        username = yield execa.stdout('npm', ['whoami']);
      } catch (error) {
        throw new Error(/ENEEDAUTH/.test(error.stderr) ? 'You must be logged in to publish packages. Use `npm login` and try again.' : 'Authentication error. Use `npm whoami` to troubleshoot.');
      }

      let collaborators;

      try {
        collaborators = yield execa.stdout('npm', ['access', 'ls-collaborators', pkg.name]);
      } catch (error) {
        // Ignore non-existing package error
        if (error.stderr.includes('code E404')) {
          return;
        } // Workaround for npm issue, see https://github.com/pikapkg/pack/issues/18


        if (error.stderr.includes('This command is only available for scoped packages.')) {
          return;
        }

        throw error;
      }

      const json = JSON.parse(collaborators);
      const permissions = json[username];

      if (!permissions || !permissions.includes('write')) {
        throw new Error('You do not have write permissions required to publish this package.');
      }
    } // title: 'Check git remote',


    try {
      yield execa('git', ['ls-remote', 'origin', 'HEAD']);
    } catch (error) {
      throw new Error(error.stderr.replace('fatal:', 'Git fatal error:'));
    } // title: 'Validate version',


    if (!isValidVersionInput(options.version)) {
      throw new Error(`Version should be either ${SEMVER_INCREMENTS.join(', ')}, or a valid semver version.`);
    }

    newVersion = getNewVersion(pkg.version, options.version);

    if (!isVersionGreater(pkg.version, newVersion)) {
      throw new Error(`New version \`${newVersion}\` should be higher than current version \`${pkg.version}\``);
    } // title: 'Check for pre-release version',


    if (!pkg.private && isPrereleaseVersion(newVersion) && !options.tag) {
      throw new Error('You must specify a dist-tag using --tag when publishing a pre-release version. This prevents accidentally tagging unstable versions as "latest". https://docs.npmjs.com/cli/dist-tag');
    } // title: 'Check git tag existence',


    yield execa('git', ['fetch']);
    const tagPrefix = yield getTagVersionPrefix(options);

    try {
      const _ref2 = yield execa.stdout('git', ['rev-parse', '--quiet', '--verify', `refs/tags/${tagPrefix}${newVersion}`]),
            revInfo = _ref2.stdout;

      if (revInfo) {
        throw new Error(`Git tag \`${tagPrefix}${newVersion}\` already exists.`);
      }
    } catch (error) {
      // Command fails with code 1 and no output if the tag does not exist, even though `--quiet` is provided
      // https://github.com/sindresorhus/np/pull/73#discussion_r72385685
      if (error.stdout !== '' || error.stderr !== '') {
        throw error;
      }
    }
  });
  return _prerequisites.apply(this, arguments);
}

const pkgPublish = (pkgManager, options) => {
  const args = ["publish"];

  if (options.contents) {
    args.push(options.contents);
  } else {
    args.push('pkg');
  }

  if (options.yarn) {
    args.push("--new-version", options.version);
  }

  if (options.tag) {
    args.push("--tag", options.tag);
  }

  if (options.otp) {
    args.push("--otp", options.otp);
  }

  if (options.publishScoped) {
    args.push("--access", "public");
  }

  return execa(pkgManager, args);
};

function handleError(_x, _x2, _x3, _x4) {
  return _handleError.apply(this, arguments);
}

function _handleError() {
  _handleError = _asyncToGenerator(function* (error, pkgManager, task, options) {
    if (error.stderr.includes("one-time pass") || error.message.includes("user TTY") || error.message.includes("One-Time-Password")) {
      const answers = yield inquirer__default.prompt([{
        type: "input",
        name: "otp",
        message: `[${task}] 2FA/OTP code required:`
      }]);
      return pkgPublish(pkgManager, Object.assign({}, options, {
        otp: answers.otp
      })).catch(err => {
        return handleError(err, pkgManager, task, options);
      });
    }
  });
  return _handleError.apply(this, arguments);
}

function publish(pkgManager, task, options) {
  return pkgPublish(pkgManager, options).catch(err => {
    return handleError(err, pkgManager, task, options);
  });
}

function prettyVersionDiff(oldVersion, inc) {
  const newVersion = getNewVersion(oldVersion, inc).split('.');
  oldVersion = oldVersion.split('.');
  let firstVersionChange = false;
  const output = [];

  for (let i = 0; i < newVersion.length; i++) {
    if (newVersion[i] !== oldVersion[i] && !firstVersionChange) {
      output.push(`${chalk.dim.cyan(newVersion[i])}`);
      firstVersionChange = true;
    } else if (newVersion[i].indexOf('-') >= 1) {
      let preVersion = [];
      preVersion = newVersion[i].split('-');
      output.push(`${chalk.dim.cyan(`${preVersion[0]}-${preVersion[1]}`)}`);
    } else {
      output.push(chalk.reset.dim(newVersion[i]));
    }
  }

  return output.join(chalk.reset.dim('.'));
}

const printCommitLog =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (repoUrl) {
    const latest = yield latestTagOrFirstCommit();

    const _ref2 = yield execa('git', ['log', '--format=%s %h', `${latest}..HEAD`]),
          log = _ref2.stdout;

    if (!log) {
      return {
        hasCommits: false,
        releaseNotes: null
      };
    }

    const commits = log.split('\n').map(commit => {
      const splitIndex = commit.lastIndexOf(' ');
      return {
        message: commit.slice(0, splitIndex),
        id: commit.slice(splitIndex + 1)
      };
    });
    const history = commits.map(commit => {
      const commitMessage = commit.message; // util.linkifyIssues(repoUrl, commit.message);

      const commitId = ''; //util.linkifyCommit(repoUrl, commit.id);

      return `- ${commitMessage}  ${commitId}`;
    }).join('\n');

    const releaseNotes = nextTag => commits.map(commit => `- ${commit.message}  ${commit.id}`).join('\n') + `\n\n${repoUrl}/compare/${latest}...${nextTag}`;

    const commitRange = linkifyCommitRange(repoUrl, `${latest}...master`);
    console.log(`${chalk.bold('Commits:')}\n${history}\n\n${chalk.bold('Commit Range:')}\n${commitRange}\n`);
    return {
      hasCommits: true,
      releaseNotes
    };
  });

  return function printCommitLog(_x) {
    return _ref.apply(this, arguments);
  };
}();

function ui (_x2, _x3) {
  return _ref3.apply(this, arguments);
}

function _ref3() {
  _ref3 = _asyncToGenerator(function* (options, pkg) {
    const oldVersion = pkg.version;
    const extraBaseUrls = ['gitlab.com'];
    const repoUrl = pkg.repository && githubUrlFromGit(pkg.repository.url, {
      extraBaseUrls
    });
    console.log(`\nPublish a new version of ${chalk.bold.magenta(pkg.name)} ${chalk.dim(`(current: ${oldVersion})`)}\n`);
    const prompts = [{
      type: 'list',
      name: 'version',
      message: 'Select semver increment or specify new version',
      pageSize: SEMVER_INCREMENTS.length + 2,
      choices: SEMVER_INCREMENTS.map(inc => ({
        name: `${inc} 	${prettyVersionDiff(oldVersion, inc)}`,
        value: inc
      })).concat([new inquirer__default.Separator(), {
        name: 'Other (specify)',
        value: null
      }]),
      filter: input => isValidVersionInput(input) ? getNewVersion(oldVersion, input) : input
    }, {
      type: 'input',
      name: 'version',
      message: 'Version',
      when: answers => !answers.version,
      filter: input => isValidVersionInput(input) ? getNewVersion(pkg.version, input) : input,
      validate: input => {
        if (!isValidVersionInput(input)) {
          return 'Please specify a valid semver, for example, `1.2.3`. See http://semver.org';
        }

        if (!isVersionGreater(oldVersion, input)) {
          return `Version must be greater than ${oldVersion}`;
        }

        return true;
      }
    }, {
      type: 'list',
      name: 'tag',
      message: 'How should this pre-release version be tagged in npm?',
      when: answers => !pkg.private && isPrereleaseVersion(answers.version) && !options.tag,
      choices: function () {
        var _choices = _asyncToGenerator(function* () {
          const _ref4 = yield execa('npm', ['view', '--json', pkg.name, 'dist-tags']),
                stdout = _ref4.stdout;

          const existingPrereleaseTags = Object.keys(JSON.parse(stdout)).filter(tag => tag !== 'latest');

          if (existingPrereleaseTags.length === 0) {
            existingPrereleaseTags.push('next');
          }

          return [...existingPrereleaseTags, new inquirer__default.Separator(), {
            name: 'Other (specify)',
            value: null
          }];
        });

        function choices() {
          return _choices.apply(this, arguments);
        }

        return choices;
      }()
    }, {
      type: 'input',
      name: 'tag',
      message: 'Tag',
      when: answers => !pkg.private && isPrereleaseVersion(answers.version) && !options.tag && !answers.tag,
      validate: input => {
        if (input.length === 0) {
          return 'Please specify a tag, for example, `next`.';
        }

        if (input.toLowerCase() === 'latest') {
          return 'It\'s not possible to publish pre-releases under the `latest` tag. Please specify something else, for example, `next`.';
        }

        return true;
      }
    }, {
      type: 'confirm',
      name: 'confirm',
      message: answers => {
        const tag = answers.tag || options.tag;
        const tagPart = tag ? ` and tag this release in npm as ${tag}` : '';
        return `Will bump from ${chalk.cyan(oldVersion)} to ${chalk.cyan(answers.version + tagPart)}. Continue?`;
      }
    }, {
      type: 'confirm',
      name: 'publishScoped',
      when: isScoped(pkg.name) && options.publish && !pkg.private,
      message: `${chalk.bold.magenta(pkg.name)} is a scoped package. Do you want to publish it publicly?`,
      default: true
    }];

    const _ref5 = yield printCommitLog(repoUrl),
          hasCommits = _ref5.hasCommits,
          releaseNotes = _ref5.releaseNotes;

    if (!hasCommits) {
      const answers = yield inquirer__default.prompt([{
        type: 'confirm',
        name: 'confirm',
        message: 'No commits found since previous release, continue?',
        default: false
      }]);

      if (!answers.confirm) {
        return Object.assign({}, options, answers);
      }
    }

    const answers = yield inquirer__default.prompt(prompts);
    return Object.assign({}, options, answers, {
      repoUrl,
      releaseNotes
    });
  });
  return _ref3.apply(this, arguments);
}

function setFlags$1(commander) {
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
function hasWrapper$1() {
  return false;
}
class Publish {
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

  init(options) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const out = _this.out,
            config = _this.config,
            reporter = _this.reporter;
      const manifest = config.manifest;
      const repoUrl = manifest.repository && githubUrlFromGit(manifest.repository.url, {
        extraBaseUrls: ['gitlab.com']
      });

      if (!hasYarn() && options.yarn) {
        throw new Error('Could not use Yarn without yarn.lock file');
      }

      const runTests = !options.yolo;
      const runCleanup = options.cleanup && !options.yolo;
      const runPublish = options.publish;
      const pkgManager = options.yarn === true ? 'yarn' : 'npm';
      const isOnGitHub = repoUrl && hostedGitInfo.fromUrl(repoUrl).type === 'github';
      const steps = [];
      steps.push(
      /*#__PURE__*/
      function () {
        var _ref = _asyncToGenerator(function* (curr, total) {
          _this.reporter.step(curr, total, 'Prerequisite checks', '✨');

          runPublish && (yield prerequisites(manifest, options)); // title: 'Check current branch',

          const _ref2 = yield execa('git', ['symbolic-ref', '--short', 'HEAD']),
                branch = _ref2.stdout;

          if (branch !== 'master' && !options.anyBranch) {
            throw new Error('Not on `master` branch. Use --any-branch to publish anyway.');
          } // title: 'Check local working tree',


          const _ref3 = yield execa('git', ['status', '--porcelain']),
                status = _ref3.stdout;

          if (status !== '') {
            throw new Error('Unclean working tree. Commit or stash changes first.');
          } // title: 'Check remote history',


          let stdout;

          try {
            // Gracefully handle no remote set up.
            stdout = yield execa.stdout('git', ['rev-list', '--count', '--left-only', '@{u}...HEAD']);
          } catch (_) {}

          if (stdout && stdout !== '0') {
            throw new Error('Remote history differs. Please pull changes.');
          }
        });

        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }());

      if (runCleanup) {
        steps.push(
        /*#__PURE__*/
        function () {
          var _ref4 = _asyncToGenerator(function* (curr, total) {
            _this.reporter.step(curr, total, 'Cleanup', '✨');

            yield unlink('package-lock.json');
            yield unlink('yarn.lock');
            yield unlink('node_modules');
            yield unlink('pkg');

            if (options.yarn) {
              return execa('yarn', ['install', '--production=false']);
            } else {
              return execa('npm', ['install', '--no-production']);
            }
          });

          return function (_x3, _x4) {
            return _ref4.apply(this, arguments);
          };
        }());
      }

      steps.push(
      /*#__PURE__*/
      function () {
        var _ref5 = _asyncToGenerator(function* (curr, total) {
          _this.reporter.step(curr, total, 'Bump Version', '✨');

          yield execa('npm', ['version', options.version, '--force']);
          yield config.loadPackageManifest();
        });

        return function (_x5, _x6) {
          return _ref5.apply(this, arguments);
        };
      }());
      steps.push(
      /*#__PURE__*/
      function () {
        var _ref6 = _asyncToGenerator(function* (curr, total) {
          _this.reporter.step(curr, total, 'Building Package', '✨');

          const oldIsSilent = reporter.isSilent;
          reporter.isSilent = true;
          const builder = new Build({
            out,
            publish: true,
            silent: true
          }, config, reporter);
          yield builder.init(true);
          reporter.isSilent = oldIsSilent;
        });

        return function (_x7, _x8) {
          return _ref6.apply(this, arguments);
        };
      }());

      if (runTests) {
        steps.push(
        /*#__PURE__*/
        function () {
          var _ref7 = _asyncToGenerator(function* (curr, total) {
            _this.reporter.step(curr, total, 'Test', '✨');

            if (!options.yarn) {
              yield execa('npm', ['test']);
              return;
            }

            try {
              yield execa('yarn', ['test']);
            } catch (err) {
              if (err.message.includes('Command "test" not found')) {
                return;
              }

              throw err;
            }
          });

          return function (_x9, _x10) {
            return _ref7.apply(this, arguments);
          };
        }());
      }

      if (runPublish && !manifest.private) {
        steps.push(
        /*#__PURE__*/
        function () {
          var _ref8 = _asyncToGenerator(function* (curr, total) {
            _this.reporter.step(curr, total, 'Publishing Package', '✨');

            yield publish(pkgManager, 'Publishing Package', options);
          });

          return function (_x11, _x12) {
            return _ref8.apply(this, arguments);
          };
        }());
      }

      steps.push(
      /*#__PURE__*/
      function () {
        var _ref9 = _asyncToGenerator(function* (curr, total) {
          _this.reporter.step(curr, total, 'Pushing Changes', '✨');

          !(yield hasUpstream()) && (yield execa('git', ['push', '--follow-tags'])); // isOnGitHub === true && release(options);
        });

        return function (_x13, _x14) {
          return _ref9.apply(this, arguments);
        };
      }());
      console.log('');
      let currentStep = 0;

      for (var _i = 0; _i < steps.length; _i++) {
        const step = steps[_i];
        yield step(++currentStep, steps.length);
      }
    })();
  }

}
function run$1(_x15, _x16, _x17, _x18) {
  return _run$1.apply(this, arguments);
}

function _run$1() {
  _run$1 = _asyncToGenerator(function* (config, reporter, flags, args) {
    yield config.loadPackageManifest();
    const options = args.length > 0 ? Object.assign({
      cleanup: true
    }, flags, {
      yarn: hasYarn(),
      version: args[0]
    }) : yield ui(Object.assign({}, flags, {
      yarn: hasYarn()
    }), config.manifest);

    if (!options.confirm) {
      return;
    }

    const publish = new Publish(flags, config, reporter);
    yield publish.init(options);
    const newManifest = yield config.loadPackageManifest();
    console.log(chalk.bold(`\n🎉  ${newManifest.name} v${newManifest.version} published!`));
    console.log(`You can see it at: ${chalk.underline(`https://unpkg.com/${newManifest.name}@${newManifest.version}/`)}`);
  });
  return _run$1.apply(this, arguments);
}

var publish$1 = /*#__PURE__*/Object.freeze({
  setFlags: setFlags$1,
  hasWrapper: hasWrapper$1,
  Publish: Publish,
  run: run$1
});

const commands = {
  build,
  publish: publish$1
};

/* @flow */
function hasWrapper$2(flags, args) {
  return false;
}
function setFlags$2(commander) {
  commander.description('Displays help information.');
}
function run$2(config, reporter, commander, args) {
  if (args.length) {
    const commandName = args.shift();

    if (Object.prototype.hasOwnProperty.call(commands, commandName)) {
      const command = commands[commandName];

      if (command) {
        command.setFlags(commander);
        const examples = (command && command.examples || []).map(example => `    $ pika ${example}`);

        if (examples.length) {
          commander.on('--help', () => {
            reporter.log(reporter.lang('helpExamples', reporter.rawText(examples.join('\n'))));
          });
        } // eslint-disable-next-line pika-internal/warn-language
        // commander.on('--help', () => reporter.log('  ' + getDocsInfo(commandName) + '\n'));


        commander.help();
        return Promise.resolve();
      }
    }
  }

  commander.options.sort(sortOptionsByFlags);
  commander.help();
  return Promise.resolve();
}

var helpCommand = /*#__PURE__*/Object.freeze({
  hasWrapper: hasWrapper$2,
  setFlags: setFlags$2,
  run: run$2
});

var typos = {
  autohr: 'author',
  autor: 'author',
  contributers: 'contributors',
  depdenencies: 'dependencies',
  dependancies: 'dependencies',
  dependecies: 'dependencies',
  depends: 'dependencies',
  'dev-dependencies': 'devDependencies',
  devDependences: 'devDependencies',
  devDepenencies: 'devDependencies',
  devEependencies: 'devDependencies',
  devdependencies: 'devDependencies',
  hampage: 'homepage',
  hompage: 'homepage',
  prefereGlobal: 'preferGlobal',
  publicationConfig: 'publishConfig',
  repo: 'repository',
  repostitory: 'repository',
  script: 'scripts'
};

const strings = ['name', 'version'];
const dependencyKeys = [// npm registry will include optionalDependencies in dependencies and we'll want to dedupe them from the
// other fields first
'optionalDependencies', // it's seemingly common to include a dependency in dependencies and devDependencies of the same name but
// different ranges, this can cause a lot of issues with our determinism and the behaviour of npm is
// currently unspecified.
'dependencies', 'devDependencies'];

function isValidName(name) {
  return !name.match(/[\/@\s\+%:]/) && encodeURIComponent(name) === name;
}

function isValidScopedName(name) {
  if (name[0] !== '@') {
    return false;
  }

  const parts = name.slice(1).split('/');
  return parts.length === 2 && isValidName(parts[0]) && isValidName(parts[1]);
}

function isValidPackageName(name) {
  return isValidName(name) || isValidScopedName(name);
}
function validate (info, isRoot, reporter, warn) {
  if (isRoot) {
    for (const key in typos) {
      if (key in info) {
        warn(reporter.lang('manifestPotentialTypo', key, typos[key]));
      }
    }
  } // validate name


  const name = info.name;

  if (typeof name === 'string') {
    if (isRoot && isBuiltinModule(name)) {
      warn(reporter.lang('manifestBuiltinModule', name));
    } // cannot start with a dot


    if (name[0] === '.') {
      throw new types.MessageError(reporter.lang('manifestNameDot'));
    } // cannot contain the following characters


    if (!isValidPackageName(name)) {
      throw new types.MessageError(reporter.lang('manifestNameIllegalChars'));
    } // cannot equal node_modules or favicon.ico


    const lower = name.toLowerCase();

    if (lower === 'node_modules' || lower === 'favicon.ico') {
      throw new types.MessageError(reporter.lang('manifestNameBlacklisted'));
    }
  } // Only care if you are trying to publish to npm.
  // // validate license
  // if (isRoot && !info.private) {
  //   if (typeof info.license === 'string') {
  //     const license = info.license.replace(/\*$/g, '');
  //     if (!isValidLicense(license)) {
  //       warn(reporter.lang('manifestLicenseInvalid'));
  //     }
  //   } else {
  //     warn(reporter.lang('manifestLicenseNone'));
  //   }
  // }
  // validate strings


  for (var _i = 0; _i < strings.length; _i++) {
    const key = strings[_i];
    const val = info[key];

    if (val && typeof val !== 'string') {
      throw new types.MessageError(reporter.lang('manifestStringExpected', key));
    }
  }

  cleanDependencies(info, isRoot, reporter, warn);
}
function cleanDependencies(info, isRoot, reporter, warn) {
  // get dependency objects
  const depTypes = [];

  for (var _i2 = 0; _i2 < dependencyKeys.length; _i2++) {
    const type = dependencyKeys[_i2];
    const deps = info[type];

    if (!deps || typeof deps !== 'object') {
      continue;
    }

    depTypes.push([type, deps]);
  } // aggregate all non-trivial deps (not '' or '*')


  const nonTrivialDeps = new Map();

  for (var _i3 = 0; _i3 < depTypes.length; _i3++) {
    const _depTypes$_i = _slicedToArray(depTypes[_i3], 2),
          type = _depTypes$_i[0],
          deps = _depTypes$_i[1];

    var _arr = Object.keys(deps);

    for (var _i5 = 0; _i5 < _arr.length; _i5++) {
      const name = _arr[_i5];
      const version = deps[name];

      if (!nonTrivialDeps.has(name) && version && version !== '*') {
        nonTrivialDeps.set(name, {
          type,
          version
        });
      }
    }
  } // overwrite first dep of package with non-trivial version, remove the rest


  const setDeps = new Set();

  for (var _i4 = 0; _i4 < depTypes.length; _i4++) {
    const _depTypes$_i2 = _slicedToArray(depTypes[_i4], 2),
          type = _depTypes$_i2[0],
          deps = _depTypes$_i2[1];

    var _arr2 = Object.keys(deps);

    for (var _i6 = 0; _i6 < _arr2.length; _i6++) {
      const name = _arr2[_i6];
      let version = deps[name];
      const dep = nonTrivialDeps.get(name);

      if (dep) {
        if (version && version !== '*' && version !== dep.version && isRoot) {
          // only throw a warning when at the root
          warn(reporter.lang('manifestDependencyCollision', dep.type, name, dep.version, type, version));
        }

        version = dep.version;
      }

      if (setDeps.has(name)) {
        delete deps[name];
      } else {
        deps[name] = version;
        setDeps.add(name);
      }
    }
  }
}

function isValidLicense(license) {
  return !!license && validateLicense(license).validForNewPackages;
}
function stringifyPerson(person) {
  if (!person || typeof person !== 'object') {
    return person;
  }

  const parts = [];

  if (person.name) {
    parts.push(person.name);
  }

  const email = person.email || person.mail;

  if (typeof email === 'string') {
    parts.push(`<${email}>`);
  }

  const url = person.url || person.web;

  if (typeof url === 'string') {
    parts.push(`(${url})`);
  }

  return parts.join(' ');
}
function parsePerson(person) {
  if (typeof person !== 'string') {
    return person;
  } // format: name (url) <email>


  const obj = {};
  let name = person.match(/^([^\(<]+)/);

  if (name && name[0].trim()) {
    obj.name = name[0].trim();
  }

  const email = person.match(/<([^>]+)>/);

  if (email) {
    obj.email = email[1];
  }

  const url = person.match(/\(([^\)]+)\)/);

  if (url) {
    obj.url = url[1];
  }

  return obj;
}
function normalizePerson(person) {
  return parsePerson(stringifyPerson(person));
}
function extractDescription(readme) {
  if (typeof readme !== 'string' || readme === '') {
    return undefined;
  } // split into lines


  const lines = readme.trim().split('\n').map(line => line.trim()); // find the start of the first paragraph, ignore headings

  let start = 0;

  for (; start < lines.length; start++) {
    const line = lines[start];

    if (line && line.match(/^(#|$)/)) {
      // line isn't empty and isn't a heading so this is the start of a paragraph
      start++;
      break;
    }
  } // skip newlines from the header to the first line


  while (start < lines.length && !lines[start]) {
    start++;
  } // continue to the first non empty line


  let end = start;

  while (end < lines.length && lines[end]) {
    end++;
  }

  return lines.slice(start, end).join(' ');
}

var LICENSES = {
  'Apache-2.0': new RegExp('(licensed under the apache license version the license you may not use this file except in compliance with the license you may obtain a copy of the license at http www apache org licenses license unless required by applicable law or agreed to in writing software distributed under the license is distributed on an as is basis without warranties or conditions of any kind either express or implied see the license for the specific language governing permissions and limitations under the license$|apache license version january http www apache org licenses terms and conditions for use reproduction and distribution definitions license shall mean the terms and conditions for use reproduction and distribution as defined by sections through of this document licensor shall mean the copyright owner or entity authorized by the copyright owner that is granting the license legal entity shall mean the union of the acting entity and all other entities that control are controlled by or are under common control with that entity for the purposes of this definition control means i the power direct or indirect to cause the direction or management of such entity whether by contract or otherwise or ii ownership of fifty percent or more of the outstanding shares or iii beneficial ownership of such entity you or your shall mean an individual or legal entity exercising permissions granted by this license source form shall mean the preferred form for making modifications including but not limited to software source code documentation source and configuration files object form shall mean any form resulting from mechanical transformation or translation of a source form including but not limited to compiled object code generated documentation and conversions to other media types work shall mean the work of authorship whether in source or object form made available under the license as indicated by a copyright notice that is included in or attached to the work an example is provided in the appendix below derivative works shall mean any work whether in source or object form that is based on or derived from the work and for which the editorial revisions annotations elaborations or other modifications represent as a whole an original work of authorship for the purposes of this license derivative works shall not include works that remain separable from or merely link or bind by name to the interfaces of the work and derivative works thereof contribution shall mean any work of authorship including the original version of the work and any modifications or additions to that work or derivative works thereof that is intentionally submitted to licensor for inclusion in the work by the copyright owner or by an individual or legal entity authorized to submit on behalf of the copyright owner for the purposes of this definition submitted means any form of electronic verbal or written communication sent to the licensor or its representatives including but not limited to communication on electronic mailing lists source code control systems and issue tracking systems that are managed by or on behalf of the licensor for the purpose of discussing and improving the work but excluding communication that is conspicuously marked or otherwise designated in writing by the copyright owner as not a contribution contributor shall mean licensor and any individual or legal entity on behalf of whom a contribution has been received by licensor and subsequently incorporated within the work grant of copyright license subject to the terms and conditions of this license each contributor hereby grants to you a perpetual worldwide non exclusive no charge royalty free irrevocable copyright license to reproduce prepare derivative works of publicly display publicly perform sublicense and distribute the work and such derivative works in source or object form grant of patent license subject to the terms and conditions of this license each contributor hereby grants to you a perpetual worldwide non exclusive no charge royalty free irrevocable except as stated in this section patent license to make have made use offer to sell sell import and otherwise transfer the work where such license applies only to those patent claims licensable by such contributor that are necessarily infringed by their contribution s alone or by combination of their contribution s with the work to which such contribution s was submitted if you institute patent litigation against any entity including a cross claim or counterclaim in a lawsuit alleging that the work or a contribution incorporated within the work constitutes direct or contributory patent infringement then any patent licenses granted to you under this license for that work shall terminate as of the date such litigation is filed redistribution you may reproduce and distribute copies of the work or derivative works thereof in any medium with or without modifications and in source or object form provided that you meet the following conditions a you must give any other recipients of the work or derivative works a copy of this license and b you must cause any modified files to carry prominent notices stating that you changed the files and c you must retain in the source form of any derivative works that you distribute all copyright patent trademark and attribution notices from the source form of the work excluding those notices that do not pertain to any part of the derivative works and d if the work includes a notice text file as part of its distribution then any derivative works that you distribute must include a readable copy of the attribution notices contained within such notice file excluding those notices that do not pertain to any part of the derivative works in at least one of the following places within a notice text file distributed as part of the derivative works within the source form or documentation if provided along with the derivative works or within a display generated by the derivative works if and wherever such third party notices normally appear the contents of the notice file are for informational purposes only and do not modify the license you may add your own attribution notices within derivative works that you distribute alongside or as an addendum to the notice text from the work provided that such additional attribution notices cannot be construed as modifying the license you may add your own copyright statement to your modifications and may provide additional or different license terms and conditions for use reproduction or distribution of your modifications or for any such derivative works as a whole provided your use reproduction and distribution of the work otherwise complies with the conditions stated in this license submission of contributions unless you explicitly state otherwise any contribution intentionally submitted for inclusion in the work by you to the licensor shall be under the terms and conditions of this license without any additional terms or conditions notwithstanding the above nothing herein shall supersede or modify the terms of any separate license agreement you may have executed with licensor regarding such contributions trademarks this license does not grant permission to use the trade names trademarks service marks or product names of the licensor except as required for reasonable and customary use in describing the origin of the work and reproducing the content of the notice file disclaimer of warranty unless required by applicable law or agreed to in writing licensor provides the work and each contributor provides its contributions on an as is basis without warranties or conditions of any kind either express or implied including without limitation any warranties or conditions of title non infringement merchantability or fitness for a particular purpose you are solely responsible for determining the appropriateness of using or redistributing the work and assume any risks associated with your exercise of permissions under this license limitation of liability in no event and under no legal theory whether in tort including negligence contract or otherwise unless required by applicable law such as deliberate and grossly negligent acts or agreed to in writing shall any contributor be liable to you for damages including any direct indirect special incidental or consequential damages of any character arising as a result of this license or out of the use or inability to use the work including but not limited to damages for loss of goodwill work stoppage computer failure or malfunction or any and all other commercial damages or losses even if such contributor has been advised of the possibility of such damages accepting warranty or additional liability while redistributing the work or derivative works thereof you may choose to offer and charge a fee for acceptance of support warranty indemnity or other liability obligations and or rights consistent with this license however in accepting such obligations you may act only on your own behalf and on your sole responsibility not on behalf of any other contributor and only if you agree to indemnify defend and hold each contributor harmless for any liability incurred by or claims asserted against such contributor by reason of your accepting any such warranty or additional liability end of terms and conditions$)', 'g'),
  'BSD-2-Clause': new RegExp('(redistribution and use in source and binary forms with or without modification are permitted provided that the following conditions are met redistributions of source code must retain the above copyright notice this list of conditions and the following disclaimer redistributions in binary form must reproduce the above copyright notice this list of conditions and the following disclaimer in the documentation and or other materials provided with the distribution this(.*?| )is provided by the copyright holders and contributors as is and any express or implied warranties including but not limited to the implied warranties of merchantability and fitness for a particular purpose are disclaimed in no event shall(.*?| )be liable for any direct indirect incidental special exemplary or consequential damages including but not limited to procurement of substitute goods or services loss of use data or profits or business interruption however caused and on any theory of liability whether in contract strict liability or tort including negligence or otherwise arising in any way out of the use of this(.*?| )even if advised of the possibility of such damage$|redistribution and use in source and binary forms with or without modification are permitted provided that the following conditions are met redistributions of source code must retain the above copyright notice this list of conditions and the following disclaimer redistributions in binary form must reproduce the above copyright notice this list of conditions and the following disclaimer in the documentation and or other materials provided with the distribution this software is provided by the copyright holders and contributors as is and any express or implied warranties including but not limited to the implied warranties of merchantability and fitness for a particular purpose are disclaimed in no event shall(.*?| )be liable for any direct indirect incidental special exemplary or consequential damages including but not limited to procurement of substitute goods or services loss of use data or profits or business interruption however caused and on any theory of liability whether in contract strict liability or tort including negligence or otherwise arising in any way out of the use of this software even if advised of the possibility of such damage$)', 'g'),
  'BSD-3-Clause': new RegExp('(redistribution and use in source and binary forms with or without modification are permitted provided that the following conditions are met redistributions of source code must retain the above copyright notice this list of conditions and the following disclaimer redistributions in binary form must reproduce the above copyright notice this list of conditions and the following disclaimer in the documentation and or other materials provided with the distribution neither the name of(.*?| )nor the names of the contributors may be used to endorse or promote products derived from this software without specific prior written permission this software is provided by the copyright holders and contributors as is and any express or implied warranties including but not limited to the implied warranties of merchantability and fitness for a particular purpose are disclaimed in no event shall(.*?| )be liable for any direct indirect incidental special exemplary or consequential damages including but not limited to procurement of substitute goods or services loss of use data or profits or business interruption however caused and on any theory of liability whether in contract strict liability or tort including negligence or otherwise arising in any way out of the use of this software even if advised of the possibility of such damage$|(redistribution and use in source and binary forms with or without modification are permitted provided that the following conditions are met redistributions of source code must retain the above copyright notice this list of conditions and the following disclaimer redistributions in binary form must reproduce the above copyright notice this list of conditions and the following disclaimer in the documentation and or other materials provided with the distribution the names of any contributors may not be used to endorse or promote products derived from this software without specific prior written permission this software is provided by the copyright holders and contributors as is and any express or implied warranties including but not limited to the implied warranties of merchantability and fitness for a particular purpose are disclaimed in no event shall the copyright holders and contributors be liable for any direct indirect incidental special exemplary or consequential damages including but not limited to procurement of substitute goods or services loss of use data or profits or business interruption however caused and on any theory of liability whether in contract strict liability or tort including negligence or otherwise arising in any way out of the use of this software even if advised of the possibility of such damage$|redistribution and use in source and binary forms with or without modification are permitted provided that the following conditions are met redistributions of source code must retain the above copyright notice this list of conditions and the following disclaimer redistributions in binary form must reproduce the above copyright notice this list of conditions and the following disclaimer in the documentation and or other materials provided with the distribution neither the name(.*?| )nor the names of(.*?| )contributors may be used to endorse or promote products derived from this software without specific prior written permission this software is provided by(.*?| )as is and any express or implied warranties including but not limited to the implied warranties of merchantability and fitness for a particular purpose are disclaimed in no event shall(.*?| )be liable for any direct indirect incidental special exemplary or consequential damages including but not limited to procurement of substitute goods or services loss of use data or profits or business interruption however caused and on any theory of liability whether in contract strict liability or tort including negligence or otherwise arising in any way out of the use of this software even if advised of the possibility of such damage$))', 'g'),
  MIT: new RegExp('permission is hereby granted free of charge to any person obtaining a copy of this software and associated documentation files the software to deal in the software without restriction including without limitation the rights to use copy modify merge publish distribute sublicense and or sell copies of the software and to permit persons to whom the software is furnished to do so subject to the following conditions the above copyright notice and this permission notice shall be included in all copies or substantial portions of the software the software is provided as is without warranty of any kind express or implied including but not limited to the warranties of merchantability fitness for a particular purpose and noninfringement in no event shall the authors or copyright holders be liable for any claim damages or other liability whether in an action of contract tort or otherwise arising from out of or in connection with the software or the use or other dealings in the software$', 'g'),
  Unlicense: new RegExp('this is free and unencumbered software released into the public domain anyone is free to copy modify publish use compile sell or distribute this software either in source code form or as a compiled binary for any purpose commercial or non commercial and by any means in jurisdictions that recognize copyright laws the author or authors of this software dedicate any and all copyright interest in the software to the public domain we make this dedication for the benefit of the public at large and to the detriment of our heirs and successors we intend this dedication to be an overt act of relinquishment in perpetuity of all present and future rights to this software under copyright law the software is provided as is without warranty of any kind express or implied including but not limited to the warranties of merchantability fitness for a particular purpose and noninfringement in no event shall the authors be liable for any claim damages or other liability whether in an action of contract tort or otherwise arising from out of or in connection with the software or the use or other dealings in the software for more information please refer to wildcard$', 'g')
};

function clean(str) {
  return str.replace(/[^A-Za-z\s]/g, ' ').replace(/[\s]+/g, ' ').trim().toLowerCase();
}

const REGEXES = {
  Apache: [/Apache License\b/],
  BSD: [/BSD\b/],
  ISC: [/The ISC License/, /ISC\b/],
  MIT: [/MIT\b/],
  Unlicense: [/http:\/\/unlicense.org\//],
  WTFPL: [/DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE/, /WTFPL\b/]
};
function inferLicense(license) {
  // check if we have any explicit licenses
  const cleanLicense = clean(license);

  for (const licenseName in LICENSES) {
    const testLicense = LICENSES[licenseName];

    if (cleanLicense.search(testLicense) >= 0) {
      return licenseName;
    }
  } // infer based on some keywords


  for (const licenseName in REGEXES) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = REGEXES[licenseName][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        const regex = _step.value;

        if (license.search(regex) >= 0) {
          return `${licenseName}*`;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  return null;
}

const LICENSE_RENAMES = {
  'MIT/X11': 'MIT',
  X11: 'MIT'
};
var fix = /*#__PURE__*/
(function () {
  var _ref = _asyncToGenerator(function* (info, moduleLoc, reporter, warn) {
    const files = yield readdir(moduleLoc); // clean info.version

    if (typeof info.version === 'string') {
      info.version = semver.clean(info.version) || info.version;
    } // if name or version aren't set then set them to empty strings


    info.name = info.name || '';
    info.version = info.version || ''; // if the man field is a string then coerce it to an array

    if (typeof info.man === 'string') {
      info.man = [info.man];
    } // if the keywords field is a string then split it on any whitespace


    if (typeof info.keywords === 'string') {
      info.keywords = info.keywords.split(/\s+/g);
    } // if there's no contributors field but an authors field then expand it


    if (!info.contributors && files.indexOf('AUTHORS') >= 0) {
      const authorsFilepath = path.join(moduleLoc, 'AUTHORS');
      const authorsFilestats = yield stat(authorsFilepath);

      if (authorsFilestats.isFile()) {
        let authors = yield readFile(authorsFilepath);
        info.contributors = authors.split(/\r?\n/g) // split on lines
        .map(line => line.replace(/^\s*#.*$/, '').trim()) // remove comments
        .filter(line => !!line); // remove empty lines;
      }
    } // expand people fields to objects


    if (typeof info.author === 'string' || typeof info.author === 'object') {
      info.author = normalizePerson(info.author);
    }

    if (Array.isArray(info.contributors)) {
      info.contributors = info.contributors.map(normalizePerson);
    }

    if (Array.isArray(info.maintainers)) {
      info.maintainers = info.maintainers.map(normalizePerson);
    } // if there's no readme field then load the README file from the cwd


    if (!info.readme) {
      const readmeCandidates = files.filter(filename => {
        const lower = filename.toLowerCase();
        return lower === 'readme' || lower.indexOf('readme.') === 0;
      }).sort((filename1, filename2) => {
        // favor files with extensions
        return filename2.indexOf('.') - filename1.indexOf('.');
      });
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = readmeCandidates[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          const readmeFilename = _step.value;
          const readmeFilepath = path.join(moduleLoc, readmeFilename);
          const readmeFileStats = yield stat(readmeFilepath);

          if (readmeFileStats.isFile()) {
            info.readmeFilename = readmeFilename;
            info.readme = yield readFile(readmeFilepath);
            break;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    } // if there's no description then take the first paragraph from the readme


    if (!info.description && info.readme) {
      const desc = extractDescription(info.readme);

      if (desc) {
        info.description = desc;
      }
    } // support array of engine keys


    if (Array.isArray(info.engines)) {
      const engines = {};
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = info.engines[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          const str = _step2.value;

          if (typeof str === 'string') {
            const _str$trim$split = str.trim().split(/ +/g),
                  _str$trim$split2 = _toArray(_str$trim$split),
                  name = _str$trim$split2[0],
                  patternParts = _str$trim$split2.slice(1);

            engines[name] = patternParts.join(' ');
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      info.engines = engines;
    } // allow bugs to be specified as a string, expand it to an object with a single url prop


    if (typeof info.bugs === 'string') {
      info.bugs = {
        url: info.bugs
      };
    } // normalize homepage url to http


    if (typeof info.homepage === 'string') {
      const parts = nodeUrl.parse(info.homepage);
      parts.protocol = parts.protocol || 'http:';

      if (parts.pathname && !parts.hostname) {
        parts.hostname = parts.pathname;
        parts.pathname = '';
      }

      info.homepage = nodeUrl.format(parts);
    } // if the `bin` field is as string then expand it to an object with a single property
    // based on the original `bin` field and `name field`
    // { name: "foo", bin: "cli.js" } -> { name: "foo", bin: { foo: "cli.js" } }


    if (typeof info.name === 'string' && typeof info.bin === 'string' && info.bin.length > 0) {
      // Remove scoped package name for consistency with NPM's bin field fixing behaviour
      const name = info.name.replace(/^@[^\/]+\//, '');
      info.bin = {
        [name]: info.bin
      };
    } // bundleDependencies is an alias for bundledDependencies


    if (info.bundledDependencies) {
      info.bundleDependencies = info.bundledDependencies;
      delete info.bundledDependencies;
    }

    let scripts; // dummy script object to shove file inferred scripts onto

    if (info.scripts && typeof info.scripts === 'object') {
      scripts = info.scripts;
    } else {
      scripts = {};
    } // if there's a server.js file and no start script then set it to `node server.js`


    if (!scripts.start && files.indexOf('server.js') >= 0) {
      scripts.start = 'node server';
    } // if there's a binding.gyp file and no install script then set it to `node-gyp rebuild`


    if (!scripts.install && files.indexOf('binding.gyp') >= 0) {
      scripts.install = 'node-gyp rebuild';
    } // set scripts if we've polluted the empty object


    if (Object.keys(scripts).length) {
      info.scripts = scripts;
    }

    const dirs = info.directories;

    if (dirs && typeof dirs === 'object') {
      const binDir = dirs.bin;

      if (!info.bin && binDir && typeof binDir === 'string') {
        const bin = info.bin = {};
        const fullBinDir = path.join(moduleLoc, binDir);

        if (yield exists(fullBinDir)) {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = (yield readdir(fullBinDir))[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              const scriptName = _step3.value;

              if (scriptName[0] === '.') {
                continue;
              }

              bin[scriptName] = path.join('.', binDir, scriptName);
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        } else {
          warn(reporter.lang('manifestDirectoryNotFound', binDir, info.name));
        }
      }

      const manDir = dirs.man;

      if (!info.man && typeof manDir === 'string') {
        const man = info.man = [];
        const fullManDir = path.join(moduleLoc, manDir);

        if (yield exists(fullManDir)) {
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = (yield readdir(fullManDir))[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              const filename = _step4.value;

              if (/^(.*?)\.[0-9]$/.test(filename)) {
                man.push(path.join('.', manDir, filename));
              }
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }
        } else {
          warn(reporter.lang('manifestDirectoryNotFound', manDir, info.name));
        }
      }
    }

    delete info.directories; // normalize licenses field

    const licenses = info.licenses;

    if (Array.isArray(licenses) && !info.license) {
      let licenseTypes = [];
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = licenses[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          let license = _step5.value;

          if (license && typeof license === 'object') {
            license = license.type;
          }

          if (typeof license === 'string') {
            licenseTypes.push(license);
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      licenseTypes = licenseTypes.filter(isValidLicense);

      if (licenseTypes.length === 1) {
        info.license = licenseTypes[0];
      } else if (licenseTypes.length) {
        info.license = `(${licenseTypes.join(' OR ')})`;
      }
    }

    const license = info.license; // normalize license

    if (license && typeof license === 'object') {
      info.license = license.type;
    } // get license file


    const licenseFile = files.find(filename => {
      const lower = filename.toLowerCase();
      return lower === 'license' || lower.startsWith('license.') || lower === 'unlicense' || lower.startsWith('unlicense.');
    });

    if (licenseFile) {
      const licenseFilepath = path.join(moduleLoc, licenseFile);
      const licenseFileStats = yield stat(licenseFilepath);

      if (licenseFileStats.isFile()) {
        const licenseContent = yield readFile(licenseFilepath);
        const inferredLicense = inferLicense(licenseContent);
        info.licenseText = licenseContent;
        const license = info.license;

        if (typeof license === 'string') {
          if (inferredLicense && isValidLicense(inferredLicense) && !isValidLicense(license)) {
            // some packages don't specify their license version but we can infer it based on their license file
            const basicLicense = license.toLowerCase().replace(/(-like|\*)$/g, '');
            const expandedLicense = inferredLicense.toLowerCase();

            if (expandedLicense.startsWith(basicLicense)) {
              // TODO consider doing something to notify the user
              info.license = inferredLicense;
            }
          }
        } else if (inferredLicense) {
          // if there's no license then infer it based on the license file
          info.license = inferredLicense;
        } else {
          // valid expression to refer to a license in a file
          info.license = `SEE LICENSE IN ${licenseFile}`;
        }
      }
    }

    if (typeof info.license === 'string') {
      // sometimes licenses are known by different names, reduce them
      info.license = LICENSE_RENAMES[info.license] || info.license;
    } else if (typeof info.readme === 'string') {
      // the license might be at the bottom of the README
      const inferredLicense = inferLicense(info.readme);

      if (inferredLicense) {
        info.license = inferredLicense;
      }
    } // get notice file


    const noticeFile = files.find(filename => {
      const lower = filename.toLowerCase();
      return lower === 'notice' || lower.startsWith('notice.');
    });

    if (noticeFile) {
      const noticeFilepath = path.join(moduleLoc, noticeFile);
      const noticeFileStats = yield stat(noticeFilepath);

      if (noticeFileStats.isFile()) {
        info.noticeText = yield readFile(noticeFilepath);
      }
    }

    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = MANIFEST_FIELDS[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        const dependencyType = _step6.value;
        const dependencyList = info[dependencyType];

        if (dependencyList && typeof dependencyList === 'object') {
          delete dependencyList['//'];

          for (const name in dependencyList) {
            dependencyList[name] = dependencyList[name] || '';
          }
        }
      }
    } catch (err) {
      _didIteratorError6 = true;
      _iteratorError6 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
          _iterator6.return();
        }
      } finally {
        if (_didIteratorError6) {
          throw _iteratorError6;
        }
      }
    }
  });

  return function (_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
})();

var normalizeManifest = /*#__PURE__*/
(function () {
  var _ref = _asyncToGenerator(function* (info, moduleLoc, config, isRoot) {
    // Append dependencies
    // if (depInfo) {
    //   info.dependencies = depInfo.main;
    //   info.devDependencies = depInfo.dev;
    // }
    // create human readable name
    const name = info.name,
          version = info.version;
    let human;

    if (typeof name === 'string') {
      human = name;
    }

    if (human && typeof version === 'string' && version) {
      human += `@${version}`;
    }

    if (isRoot && info._loc) {
      human = path.relative(config.cwd, info._loc);
    }

    function warn(msg) {
      if (human) {
        msg = `${human}: ${msg}`;
      }

      config.reporter.warn(msg);
    }

    yield fix(info, moduleLoc, config.reporter, warn);

    try {
      validate(info, isRoot, config.reporter, warn);
    } catch (err) {
      if (human) {
        err.message = `${human}: ${err.message}`;
      }

      throw err;
    }

    return info;
  });

  return function (_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
})();

class ProcessSpawnError extends types.MessageError {
  constructor(msg, code, process) {
    super(msg);
    this.code = code;
    this.process = process;
  }

}
class ProcessTermError extends types.MessageError {}

class BlockingQueue {
  constructor(alias, maxConcurrency = Infinity) {
    this.concurrencyQueue = [];
    this.maxConcurrency = maxConcurrency;
    this.runningCount = 0;
    this.warnedStuck = false;
    this.alias = alias;
    this.first = true;
    this.running = nullify() || {};
    this.queue = nullify() || {};
    this.stuckTick = this.stuckTick.bind(this);
  }

  stillActive() {
    if (this.stuckTimer) {
      clearTimeout(this.stuckTimer);
    }

    this.stuckTimer = setTimeout(this.stuckTick, 5000); // We need to check the existence of unref because of https://github.com/facebook/jest/issues/4559
    // $FlowFixMe: Node's setInterval returns a Timeout, not a Number

    this.stuckTimer.unref && this.stuckTimer.unref();
  }

  stuckTick() {
    if (this.runningCount === 1) {
      this.warnedStuck = true;
      console.log(`The ${JSON.stringify(this.alias)} blocking queue may be stuck. 5 seconds ` + `without any activity with 1 worker: ${Object.keys(this.running)[0]}`);
    }
  }

  push(key, factory) {
    if (this.first) {
      this.first = false;
    } else {
      this.stillActive();
    }

    return new Promise((resolve, reject) => {
      // we're already running so push ourselves to the queue
      const queue = this.queue[key] = this.queue[key] || [];
      queue.push({
        factory,
        resolve,
        reject
      });

      if (!this.running[key]) {
        this.shift(key);
      }
    });
  }

  shift(key) {
    if (this.running[key]) {
      delete this.running[key];
      this.runningCount--;

      if (this.stuckTimer) {
        clearTimeout(this.stuckTimer);
        this.stuckTimer = null;
      }

      if (this.warnedStuck) {
        this.warnedStuck = false;
        console.log(`${JSON.stringify(this.alias)} blocking queue finally resolved. Nothing to worry about.`);
      }
    }

    const queue = this.queue[key];

    if (!queue) {
      return;
    }

    const _queue$shift = queue.shift(),
          resolve = _queue$shift.resolve,
          reject = _queue$shift.reject,
          factory = _queue$shift.factory;

    if (!queue.length) {
      delete this.queue[key];
    }

    const next = () => {
      this.shift(key);
      this.shiftConcurrencyQueue();
    };

    const run = () => {
      this.running[key] = true;
      this.runningCount++;
      factory().then(function (val) {
        resolve(val);
        next();
        return null;
      }).catch(function (err) {
        reject(err);
        next();
      });
    };

    this.maybePushConcurrencyQueue(run);
  }

  maybePushConcurrencyQueue(run) {
    if (this.runningCount < this.maxConcurrency) {
      run();
    } else {
      this.concurrencyQueue.push(run);
    }
  }

  shiftConcurrencyQueue() {
    if (this.runningCount < this.maxConcurrency) {
      const fn = this.concurrencyQueue.shift();

      if (fn) {
        fn();
      }
    }
  }

}

/* global child_process$spawnOpts */
const queue = new BlockingQueue('child', CHILD_CONCURRENCY); // TODO: this uid check is kinda whack

let uid = 0;
const spawnedProcesses = {};
function forwardSignalToSpawnedProcesses(signal) {
  var _arr = Object.keys(spawnedProcesses);

  for (var _i = 0; _i < _arr.length; _i++) {
    const key = _arr[_i];
    spawnedProcesses[key].kill(signal);
  }
}
function spawn(program, args, opts = {}, onData) {
  const key = opts.cwd || String(++uid);
  return queue.push(key, () => new Promise((resolve, reject) => {
    const proc = child_process.spawn(program, args, opts);

    spawnedProcesses[key] = proc;
    let processingDone = false;
    let processClosed = false;
    let err = null;
    let stdout = '';
    proc.on('error', err => {
      if (err.code === 'ENOENT') {
        reject(new ProcessSpawnError(`Couldn't find the binary ${program}`, err.code, program));
      } else {
        reject(err);
      }
    });

    function updateStdout(chunk) {
      stdout += chunk;

      if (onData) {
        onData(chunk);
      }
    }

    function finish() {
      delete spawnedProcesses[key];

      if (err) {
        reject(err);
      } else {
        resolve(stdout.trim());
      }
    }

    if (typeof opts.process === 'function') {
      opts.process(proc, updateStdout, reject, function () {
        if (processClosed) {
          finish();
        } else {
          processingDone = true;
        }
      });
    } else {
      if (proc.stderr) {
        proc.stderr.on('data', updateStdout);
      }

      if (proc.stdout) {
        proc.stdout.on('data', updateStdout);
      }

      processingDone = true;
    }

    proc.on('close', (code, signal) => {
      if (signal || code >= 1) {
        err = new ProcessTermError(['Command failed.', signal ? `Exit signal: ${signal}` : `Exit code: ${code}`, `Command: ${program}`, `Arguments: ${args.join(' ')}`, `Directory: ${opts.cwd || process.cwd()}`, `Output:\n${stdout.trim()}`].join('\n'));
        err.EXIT_SIGNAL = signal;
        err.EXIT_CODE = code;
      }

      if (processingDone || err) {
        finish();
      } else {
        processClosed = true;
      }
    });
  }));
}

function fixCmdWinSlashes(cmd) {
  function findQuotes(quoteSymbol) {
    const quotes = [];

    const addQuote = (_, index) => {
      quotes.push({
        from: index,
        to: index + _.length
      });
      return _;
    };

    const regEx = new RegExp(quoteSymbol + '.*' + quoteSymbol);
    cmd.replace(regEx, addQuote);
    return quotes;
  }

  const quotes = findQuotes('"').concat(findQuotes("'"));

  function isInsideQuotes(index) {
    return quotes.reduce((result, quote) => {
      return result || quote.from <= index && index <= quote.to;
    }, false);
  }

  const cmdPrePattern = '((?:^|&&|&|\\|\\||\\|)\\s*)';
  const cmdPattern = '(".*?"|\'.*?\'|\\S*)';
  const regExp = new RegExp(`${cmdPrePattern}${cmdPattern}`, 'g');
  return cmd.replace(regExp, (whole, pre, cmd, index) => {
    if ((pre[0] === '&' || pre[0] === '|') && isInsideQuotes(index)) {
      return whole;
    }

    return pre + cmd.replace(/\//g, '\\');
  });
}

// // We treat these configs as internal, thus not expose them to process.env.
// // This helps us avoid some gyp issues when building native modules.
// // See https://github.com/yarnpkg/yarn/issues/2286.
// const IGNORE_CONFIG_KEYS = ['lastUpdateCheck'];
// async function getPnpParameters(config: Config): Promise<Array<string>> {
//   if (await fs.exists(`${config.lockfileFolder}/${constants.PNP_FILENAME}`)) {
//     return ['-r', `${config.lockfileFolder}/${constants.PNP_FILENAME}`];
//   } else {
//     return [];
//   }
// }
// let wrappersFolder = null;
// export async function getWrappersFolder(config: Config): Promise<string> {
//   if (wrappersFolder) {
//     return wrappersFolder;
//   }
//   wrappersFolder = await fs.makeTempDir();
//   await makePortableProxyScript(process.execPath, wrappersFolder, {
//     proxyBasename: 'node',
//     prependArguments: [...(await getPnpParameters(config))],
//   });
//   await makePortableProxyScript(process.execPath, wrappersFolder, {
//     proxyBasename: 'pika',
//     prependArguments: [process.argv[1]],
//   });
//   return wrappersFolder;
// }
// const INVALID_CHAR_REGEX = /\W/g;

function makeEnv() {
  return _makeEnv.apply(this, arguments);
} //   // Merge in the `env` object specified in .pikarc
//   const customEnv = config.getOption('env');
//   if (customEnv && typeof customEnv === 'object') {
//     Object.assign(env, customEnv);
//   }
//   env.npm_lifecycle_event = stage;
//   env.npm_node_execpath = env.NODE;
//   env.npm_execpath = env.npm_execpath || (process.mainModule && process.mainModule.filename);
//   // Set the env to production for npm compat if production mode.
//   // https://github.com/npm/npm/blob/30d75e738b9cb7a6a3f9b50e971adcbe63458ed3/lib/utils/lifecycle.js#L336
//   if (config.production) {
//     env.NODE_ENV = 'production';
//   }
//   // Note: npm_config_argv environment variable contains output of nopt - command-line
//   // parser used by npm. Since we use other parser, we just roughly emulate it's output. (See: #684)
//   env.npm_config_argv = JSON.stringify({
//     remain: [],
//     cooked: config.commandName === 'run' ? [config.commandName, stage] : [config.commandName],
//     original: process.argv.slice(2),
//   });
//   const manifest = await config.maybeReadManifest(cwd);
//   if (manifest) {
//     if (manifest.scripts && Object.prototype.hasOwnProperty.call(manifest.scripts, stage)) {
//       env.npm_lifecycle_script = manifest.scripts[stage];
//     }
//     // add npm_package_*
//     const queue = [['', manifest]];
//     while (queue.length) {
//       const [key, val] = queue.pop();
//       if (typeof val === 'object') {
//         for (const subKey in val) {
//           const fullKey = [key, subKey].filter(Boolean).join('_');
//           if (fullKey && fullKey[0] !== '_' && !IGNORE_MANIFEST_KEYS.has(fullKey)) {
//             queue.push([fullKey, val[subKey]]);
//           }
//         }
//       } else {
//         let cleanVal = String(val);
//         if (cleanVal.indexOf('\n') >= 0) {
//           cleanVal = JSON.stringify(cleanVal);
//         }
//         //replacing invalid chars with underscore
//         const cleanKey = key.replace(INVALID_CHAR_REGEX, '_');
//         env[`npm_package_${cleanKey}`] = cleanVal;
//       }
//     }
//   }
//   // add npm_config_* and npm_package_config_* from pika config
//   const keys: Set<string> = new Set([
//     ...Object.keys(config.registries.pika.config),
//     ...Object.keys(config.registries.npm.config),
//   ]);
//   const cleaned = Array.from(keys)
//     .filter(key => !key.match(/:_/) && IGNORE_CONFIG_KEYS.indexOf(key) === -1)
//     .map(key => {
//       let val = config.getOption(key);
//       if (!val) {
//         val = '';
//       } else if (typeof val === 'number') {
//         val = '' + val;
//       } else if (typeof val !== 'string') {
//         val = JSON.stringify(val);
//       }
//       if (val.indexOf('\n') >= 0) {
//         val = JSON.stringify(val);
//       }
//       return [key, val];
//     });
//   // add npm_config_*
//   for (const [key, val] of cleaned) {
//     const cleanKey = key.replace(/^_+/, '');
//     const envKey = `npm_config_${cleanKey}`.replace(INVALID_CHAR_REGEX, '_');
//     env[envKey] = val;
//   }
//   // add npm_package_config_*
//   if (manifest && manifest.name) {
//     const packageConfigPrefix = `${manifest.name}:`;
//     for (const [key, val] of cleaned) {
//       if (key.indexOf(packageConfigPrefix) !== 0) {
//         continue;
//       }
//       const cleanKey = key.replace(/^_+/, '').replace(packageConfigPrefix, '');
//       const envKey = `npm_package_config_${cleanKey}`.replace(INVALID_CHAR_REGEX, '_');
//       env[envKey] = val;
//     }
//   }
//   // split up the path
//   const envPath = env[constants.ENV_PATH_KEY];
//   const pathParts = envPath ? envPath.split(path.delimiter) : [];
//   // Include the directory that contains node so that we can guarantee that the scripts
//   // will always run with the exact same Node release than the one use to run Pika
//   const execBin = path.dirname(process.execPath);
//   if (pathParts.indexOf(execBin) === -1) {
//     pathParts.unshift(execBin);
//   }
//   // Include node-gyp version that was bundled with the current Node.js version,
//   // if available.
//   pathParts.unshift(path.join(path.dirname(process.execPath), 'node_modules', 'npm', 'bin', 'node-gyp-bin'));
//   pathParts.unshift(
//     path.join(path.dirname(process.execPath), '..', 'lib', 'node_modules', 'npm', 'bin', 'node-gyp-bin'),
//   );
//   // Include node-gyp version from homebrew managed npm, if available.
//   pathParts.unshift(
//     path.join(path.dirname(process.execPath), '..', 'libexec', 'lib', 'node_modules', 'npm', 'bin', 'node-gyp-bin'),
//   );
//   // Add global bin folder if it is not present already, as some packages depend
//   // on a globally-installed version of node-gyp.
//   const globalBin = await getGlobalBinFolder(config, {});
//   if (pathParts.indexOf(globalBin) === -1) {
//     pathParts.unshift(globalBin);
//   }
//   // Add node_modules .bin folders to the PATH
//   for (const registry of Object.keys(registries)) {
//     const binFolder = path.join(config.registries[registry].folder, '.bin');
//     if (config.workspacesEnabled && config.workspaceRootFolder) {
//       pathParts.unshift(path.join(config.workspaceRootFolder, binFolder));
//     }
//     pathParts.unshift(path.join(config.linkFolder, binFolder));
//     pathParts.unshift(path.join(cwd, binFolder));
//     if (config.modulesFolder) {
//       pathParts.unshift(path.join(config.modulesFolder, '.bin'));
//     }
//   }
//   if (await fs.exists(`${config.lockfileFolder}/${constants.PNP_FILENAME}`)) {
//     // TODO: Fix. import()? Do we even like that it does this?
//     throw new Error("pnp temporarily not supported");
//     const pnpApi = {}; //dynamicRequire(`${config.lockfileFolder}/${constants.PNP_FILENAME}`);
//     const packageLocator = pnpApi.findPackageLocator(`${config.cwd}/`);
//     const packageInformation = pnpApi.getPackageInformation(packageLocator);
//     for (const [name, reference] of packageInformation.packageDependencies.entries()) {
//       const dependencyInformation = pnpApi.getPackageInformation({name, reference});
//       if (!dependencyInformation || !dependencyInformation.packageLocation) {
//         continue;
//       }
//       pathParts.unshift(`${dependencyInformation.packageLocation}/.bin`);
//     }
//   }
//   pathParts.unshift(await getWrappersFolder(config));
//   // join path back together
//   env[constants.ENV_PATH_KEY] = pathParts.join(path.delimiter);
//   return env;
// }

function _makeEnv() {
  _makeEnv = _asyncToGenerator(function* () // stage: string,
  // cwd: string,
  // config: Config,
  {
    const env = Object.assign({
      NODE: process.execPath,
      INIT_CWD: process.cwd()
    }, process.env);
    return env;
  });
  return _makeEnv.apply(this, arguments);
}

function executeLifecycleScript(_x) {
  return _executeLifecycleScript.apply(this, arguments);
}

function _executeLifecycleScript() {
  _executeLifecycleScript = _asyncToGenerator(function* ({
    config,
    cwd,
    cmd,
    isInteractive,
    onProgress,
    customShell
  }) {
    const env = yield makeEnv(); // await checkForGypIfNeeded(config, cmd, env[constants.ENV_PATH_KEY].split(path.delimiter));

    if (process.platform === 'win32' && (!customShell || customShell === 'cmd')) {
      // handle windows run scripts starting with a relative path
      cmd = fixCmdWinSlashes(cmd);
    } // By default (non-interactive), pipe everything to the terminal and run child process detached
    // as long as it's not Windows (since windows does not have /dev/tty)


    let stdio = ['ignore', 'pipe', 'pipe'];
    let detached = process.platform !== 'win32';

    if (isInteractive) {
      stdio = 'inherit';
      detached = false;
    }

    const shell = customShell || true;
    const stdout = yield spawn(cmd, [], {
      cwd,
      env,
      stdio,
      detached,
      shell
    }, onProgress);
    return {
      cwd,
      command: cmd,
      stdout
    };
  });
  return _executeLifecycleScript.apply(this, arguments);
}

class Config {
  constructor(reporter, cwd) {
    this.reporter = reporter; // Ensure the cwd is always an absolute path.

    this.cwd = path.resolve(cwd || process.cwd());
  }

  loadPackageManifest() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const loc = path.join(_this.cwd, NODE_PACKAGE_JSON);

      if (yield exists(loc)) {
        const info = yield _this.readJson(loc, readJsonAndFile);
        _this._manifest = info.object;
        _this.manifestIndent = detectIndent(info.content).indent || undefined;
        _this.manifest = yield normalizeManifest(info.object, _this.cwd, _this, true);
        return _this.manifest;
      } else {
        return null;
      }
    })();
  }

  readJson(loc, factory = readJson) {
    try {
      return factory(loc);
    } catch (err) {
      if (err instanceof SyntaxError) {
        throw new types.MessageError(this.reporter.lang('jsonError', loc, err.message));
      } else {
        throw err;
      }
    }
  }

  savePackageManifest(newManifestData) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const loc = path.join(_this2.cwd, NODE_PACKAGE_JSON);
      const manifest = Object.assign({}, _this2._manifest, newManifestData);
      yield writeFilePreservingEol(loc, JSON.stringify(manifest, null, _this2.manifestIndent || DEFAULT_INDENT) + '\n');
      return _this2.loadPackageManifest();
    })();
  }

  getDistributions() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const raw = _this3.manifest[`@pika/pack`] || {};
      raw.defaults = raw.defaults || {};
      raw.plugins = raw.plugins || [];

      function cleanRawDistObject(_x, _x2, _x3) {
        return _cleanRawDistObject.apply(this, arguments);
      }

      function _cleanRawDistObject() {
        _cleanRawDistObject = _asyncToGenerator(function* (rawVal, cwd, canBeFalsey) {
          if (Array.isArray(rawVal)) {
            let importStr = rawVal[0].startsWith('./') || rawVal[0].startsWith('../') ? path.join(cwd, rawVal[0]) : rawVal[0];
            return [Object.assign({}, importFrom(cwd, importStr), {
              name: rawVal[0]
            }), rawVal[1] || {}];
          }

          if (typeof rawVal === 'string') {
            return [{
              build: ({
                cwd
              }) => {
                return executeLifecycleScript({
                  config: this,
                  cwd,
                  cmd: rawVal,
                  isInteractive: false
                });
              }
            }, {}];
          }

          if (!rawVal && !canBeFalsey) {
            throw new Error('Cannot be false');
          }

          return false;
        });
        return _cleanRawDistObject.apply(this, arguments);
      }

      return (yield Promise.all([...(raw.pipeline || []).map(rawVal => {
        return cleanRawDistObject(rawVal, _this3.cwd, false);
      })])).filter(Boolean);
    })();
  }

}

function forwardSignalAndExit(signal) {
  forwardSignalToSpawnedProcesses(signal); // We want to exit immediately here since `SIGTERM` means that
  // If we lose stdout messages due to abrupt exit, shoot the messenger?

  process.exit(1); // eslint-disable-line no-process-exit
}

function handleSignals() {
  process.on('SIGTERM', () => {
    forwardSignalAndExit('SIGTERM');
  });
}

const FALSY_STRINGS = new Set(['0', 'false']);
function boolify(val) {
  return !FALSY_STRINGS.has(val.toString().toLowerCase());
}
function boolifyWithDefault(val, defaultResult) {
  return val === '' || val === null || val === undefined ? defaultResult : boolify(val);
}

const commander = new commander$1.Command(); // @ts-ignore

const currentFilename = uri2path(new (typeof URL !== 'undefined' ? URL : require('ur'+'l').URL)((process.browser ? '' : 'file:') + __filename, process.browser && document.baseURI).href);

function getVersion() {
  const packageJsonContent = fs.readFileSync(path.resolve(currentFilename, '../../package.json'), {
    encoding: 'utf-8'
  });

  const _map = nullify(JSON.parse(stripBOM(packageJsonContent))),
        version = _map.version;

  return version;
}

function findProjectRoot(base) {
  let prev = null;
  let dir = base;

  do {
    if (fs.existsSync(path.join(dir, NODE_PACKAGE_JSON))) {
      return dir;
    }

    prev = dir;
    dir = path.dirname(dir);
  } while (dir !== prev);

  return base;
}

function main(_x) {
  return _main.apply(this, arguments);
}

function _main() {
  _main = _asyncToGenerator(function* ({
    startArgs,
    args,
    endArgs
  }) {
    const version = getVersion();
    loudRejection();
    handleSignals(); // set global options

    commander.version(version, '-v, --version');
    commander.usage('[command] [flags]');
    commander.option('--verbose', 'output verbose messages on internal operations');
    commander.option('--json', 'format Pika log messages as lines of JSON (see jsonlines.org)'); // commander.option('--force', 'install and build packages even if they were built before, overwrite lockfile');
    // commander.option('--prod, --production [prod]', '', boolify);

    commander.option('--emoji [bool]', 'enable emoji in output', boolify, process.platform === 'darwin' || process.env.TERM_PROGRAM === 'Hyper' || process.env.TERM_PROGRAM === 'HyperTerm');
    commander.option('-s, --silent', 'skip Pika console logs, other types of logs (script output) will be printed');
    commander.option('--cwd <cwd>', 'working directory to use', process.cwd());
    commander.option('--no-progress', 'disable progress bar');
    commander.option('--no-node-version-check', 'do not warn when using a potentially unsupported Node version'); // if -v is the first command, then always exit after returning the version

    if (args[0] === '-v') {
      console.log(version.trim());
      process.exitCode = 0;
      return;
    } // get command name


    const firstNonFlagIndex = args.findIndex((arg, idx, arr) => {
      const isOption = arg.startsWith('-');
      const prev = idx > 0 && arr[idx - 1];
      const prevOption = prev && prev.startsWith('-') && commander.optionFor(prev);
      const boundToPrevOption = prevOption && (prevOption.optional || prevOption.required);
      return !isOption && !boundToPrevOption;
    });
    let preCommandArgs;
    let commandName = '';

    if (firstNonFlagIndex > -1) {
      preCommandArgs = args.slice(0, firstNonFlagIndex);
      commandName = args[firstNonFlagIndex];
      args = args.slice(firstNonFlagIndex + 1);
    } else {
      preCommandArgs = args;
      args = [];
    }

    let isKnownCommand = Object.prototype.hasOwnProperty.call(commands, commandName);

    const isHelp = arg => arg === '--help' || arg === '-h';

    const helpInPre = preCommandArgs.findIndex(isHelp);
    const helpInArgs = args.findIndex(isHelp);

    const setHelpMode = () => {
      if (isKnownCommand) {
        args.unshift(commandName);
      }

      commandName = 'help';
      isKnownCommand = true;
    };

    if (helpInPre > -1) {
      preCommandArgs.splice(helpInPre);
      setHelpMode();
    } else if (isKnownCommand && helpInArgs === 0) {
      args.splice(helpInArgs);
      setHelpMode();
    }

    if (!commandName) {
      commandName = 'help';
      isKnownCommand = true;
    }

    if (!isKnownCommand) {
      // if command is not recognized, then set default to `run`
      args.unshift(commandName);
      commandName = 'help';
    }

    const command = commandName === 'help' ? helpCommand : commands[commandName];
    commander.originalArgs = args;
    args = [...preCommandArgs, ...args];
    command.setFlags(commander);
    commander.parse([...startArgs, // we use this for https://github.com/tj/commander.js/issues/346, otherwise
    // it will strip some args that match with any options
    'this-arg-will-get-stripped-later', ...args]);
    commander.args = commander.args.concat(endArgs.slice(1)); // we strip cmd

    console.assert(commander.args.length >= 1);
    console.assert(commander.args[0] === 'this-arg-will-get-stripped-later');
    commander.args.shift(); //

    const Reporter = commander.json ? JSONReporter : ConsoleReporter;
    const reporter = new Reporter({
      emoji: process.stdout.isTTY && commander.emoji,
      verbose: commander.verbose,
      noProgress: !commander.progress,
      isSilent: boolifyWithDefault(process.env.PIKA_SILENT, false) || commander.silent,
      nonInteractive: commander.nonInteractive
    });

    const exit = (exitCode = 0) => {
      if (exitCode === 0) {
        clearErrorReport();
      }

      process.exitCode = exitCode;
      reporter.close();
    };

    reporter.initPeakMemoryCounter();
    const outputWrapperEnabled = boolifyWithDefault(process.env.PIKA_WRAP_OUTPUT, true);
    const shouldWrapOutput = outputWrapperEnabled && !commander.json && command.hasWrapper(commander, commander.args); // if (shouldWrapOutput) {

    reporter.header(commandName, {
      name: '@pika/pack',
      version
    }); // }

    if (commander.nodeVersionCheck && !semver.satisfies(process.versions.node, SUPPORTED_NODE_VERSIONS)) {
      reporter.warn(reporter.lang('unsupportedNodeVersion', process.versions.node, SUPPORTED_NODE_VERSIONS));
    }

    if (command.noArguments && commander.args.length) {
      reporter.error(reporter.lang('noArguments')); // reporter.info(command.getDocsInfo);

      exit(1);
      return;
    } //
    // if (commander.yes) {
    //   reporter.warn(reporter.lang('yesWarning'));
    // }
    //


    const run = () => {
      invariant(command, 'missing command'); // if (warnAboutRunDashDash) {
      //   reporter.warn(reporter.lang('dashDashDeprecation'));
      // }

      return command.run(config, reporter, commander, commander.args).then(exitCode => {
        if (shouldWrapOutput) {
          reporter.footer(false);
        }

        return exitCode;
      });
    };

    function onUnexpectedError(err) {
      function indent(str) {
        return '\n  ' + str.trim().split('\n').join('\n  ');
      }

      const log = [];
      log.push(`Arguments: ${indent(process.argv.join(' '))}`);
      log.push(`PATH: ${indent(process.env.PATH || 'undefined')}`);
      log.push(`Pika version: ${indent(version)}`);
      log.push(`Node version: ${indent(process.versions.node)}`);
      log.push(`Platform: ${indent(process.platform + ' ' + process.arch)}`);
      log.push(`Trace: ${indent(err.stack)}`);
      const errorReportLoc = writeErrorReport(log);
      reporter.error(reporter.lang('unexpectedError', err.message));

      if (errorReportLoc) {
        reporter.info(reporter.lang('bugReport', errorReportLoc));
      }
    }

    function writeErrorReport(log) {
      const errorReportLoc = path.join(config.cwd, 'pika-error.log');

      try {
        fs.writeFileSync(errorReportLoc, log.join('\n\n') + '\n');
      } catch (err) {
        reporter.error(reporter.lang('fileWriteError', errorReportLoc, err.message));
        return undefined;
      }

      return errorReportLoc;
    }

    function clearErrorReport() {
      const errorReportLoc = path.join(config.cwd, 'pika-error.log');

      if (fs.existsSync(errorReportLoc)) {
        try {
          fs.unlinkSync(errorReportLoc);
        } catch (err) {
          reporter.error(reporter.lang('fileDeleteError', errorReportLoc, err.message));
          return undefined;
        }
      }

      return errorReportLoc;
    }

    const cwd = command.shouldRunInCurrentCwd ? commander.cwd : findProjectRoot(commander.cwd);
    const config = new Config(reporter, cwd);
    yield config.loadPackageManifest();

    try {


      reporter.verbose(`current time: ${new Date().toISOString()}`);
      return run().then(exit);
    } catch (err) {
      reporter.verbose(err.stack);

      if (err instanceof types.MessageError) {
        reporter.error(err.message);
      } else {
        onUnexpectedError(err);
      } // if (command.getDocsInfo) {
      //   reporter.info(command.getDocsInfo);
      // }


      return exit(1);
    }
  });
  return _main.apply(this, arguments);
}

function start() {
  return _start.apply(this, arguments);
}

function _start() {
  _start = _asyncToGenerator(function* () {
    // ignore all arguments after a --
    const doubleDashIndex = process.argv.findIndex(element => element === '--');
    const startArgs = process.argv.slice(0, 2);
    const args = process.argv.slice(2, doubleDashIndex === -1 ? process.argv.length : doubleDashIndex);
    const endArgs = doubleDashIndex === -1 ? [] : process.argv.slice(doubleDashIndex);
    yield main({
      startArgs,
      args,
      endArgs
    });
  });
  return _start.apply(this, arguments);
}

const autoRun = false;

exports.main = main;
exports.autoRun = autoRun;
exports.default = start;
