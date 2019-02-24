import execa from 'execa';
import inquirer from 'inquirer';
import chalk from 'chalk';
import githubUrlFromGit from 'github-url-from-git';
import isScoped from 'is-scoped';
import * as util from './util.js';
import { latestTagOrFirstCommit } from './git-util.js';
import * as version from './version.js';
import { prettyVersionDiff } from './pretty-version-diff.js';
const printCommitLog = async (repoUrl) => {
    const latest = await latestTagOrFirstCommit();
    const { stdout: log } = await execa('git', ['log', '--format=%s %h', `${latest}..HEAD`]);
    if (!log) {
        return {
            hasCommits: false,
            releaseNotes: null
        };
    }
    const commits = log.split('\n')
        .map(commit => {
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
    const commitRange = util.linkifyCommitRange(repoUrl, `${latest}...master`);
    console.log(`${chalk.bold('Commits:')}\n${history}\n\n${chalk.bold('Commit Range:')}\n${commitRange}\n`);
    return {
        hasCommits: true,
        releaseNotes
    };
};
export default async function (options, pkg) {
    const oldVersion = pkg.version;
    const extraBaseUrls = ['gitlab.com'];
    const repoUrl = pkg.repository && githubUrlFromGit(pkg.repository.url, { extraBaseUrls });
    console.log(`\nPublish a new version of ${chalk.bold.magenta(pkg.name)} ${chalk.dim(`(current: ${oldVersion})`)}\n`);
    const prompts = [
        {
            type: 'list',
            name: 'version',
            message: 'Select semver increment or specify new version',
            pageSize: version.SEMVER_INCREMENTS.length + 2,
            choices: version.SEMVER_INCREMENTS
                .map(inc => ({
                name: `${inc} 	${prettyVersionDiff(oldVersion, inc)}`,
                value: inc
            }))
                .concat([
                new inquirer.Separator(),
                {
                    name: 'Other (specify)',
                    value: null
                }
            ]),
            filter: input => version.isValidVersionInput(input) ? version.getNewVersion(oldVersion, input) : input
        },
        {
            type: 'input',
            name: 'version',
            message: 'Version',
            when: answers => !answers.version,
            filter: input => version.isValidVersionInput(input) ? version.getNewVersion(pkg.version, input) : input,
            validate: input => {
                if (!version.isValidVersionInput(input)) {
                    return 'Please specify a valid semver, for example, `1.2.3`. See http://semver.org';
                }
                if (!version.isVersionGreater(oldVersion, input)) {
                    return `Version must be greater than ${oldVersion}`;
                }
                return true;
            }
        },
        {
            type: 'list',
            name: 'tag',
            message: 'How should this pre-release version be tagged in npm?',
            when: answers => !pkg.private && version.isPrereleaseVersion(answers.version) && !options.tag,
            choices: async () => {
                const { stdout } = await execa('npm', ['view', '--json', pkg.name, 'dist-tags']);
                const existingPrereleaseTags = Object.keys(JSON.parse(stdout))
                    .filter(tag => tag !== 'latest');
                if (existingPrereleaseTags.length === 0) {
                    existingPrereleaseTags.push('next');
                }
                return [
                    ...existingPrereleaseTags,
                    new inquirer.Separator(),
                    {
                        name: 'Other (specify)',
                        value: null
                    }
                ];
            }
        },
        {
            type: 'input',
            name: 'tag',
            message: 'Tag',
            when: answers => !pkg.private && version.isPrereleaseVersion(answers.version) && !options.tag && !answers.tag,
            validate: input => {
                if (input.length === 0) {
                    return 'Please specify a tag, for example, `next`.';
                }
                if (input.toLowerCase() === 'latest') {
                    return 'It\'s not possible to publish pre-releases under the `latest` tag. Please specify something else, for example, `next`.';
                }
                return true;
            }
        },
        {
            type: 'confirm',
            name: 'confirm',
            message: answers => {
                const tag = answers.tag || options.tag;
                const tagPart = tag ? ` and tag this release in npm as ${tag}` : '';
                return `Will bump from ${chalk.cyan(oldVersion)} to ${chalk.cyan(answers.version + tagPart)}. Continue?`;
            }
        },
        {
            type: 'confirm',
            name: 'publishScoped',
            when: isScoped(pkg.name) && options.publish && !pkg.private,
            message: `${chalk.bold.magenta(pkg.name)} is a scoped package. Do you want to publish it publicly?`,
            default: true
        }
    ];
    const { hasCommits, releaseNotes } = await printCommitLog(repoUrl);
    if (!hasCommits) {
        const answers = await inquirer.prompt([{
                type: 'confirm',
                name: 'confirm',
                message: 'No commits found since previous release, continue?',
                default: false
            }]);
        if (!answers.confirm) {
            return Object.assign({}, options, answers);
        }
    }
    const answers = await inquirer.prompt(prompts);
    return Object.assign({}, options, answers, { repoUrl,
        releaseNotes });
}
;
