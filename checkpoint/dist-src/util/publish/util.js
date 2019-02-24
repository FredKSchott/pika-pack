import issueRegex from 'issue-regex';
import execa from 'execa';
export function linkifyIssues(url, message) {
    return message.replace(issueRegex(), issue => {
        const issuePart = issue.replace('#', '/issues/');
        if (issue.startsWith('#')) {
            return `${issue} (${url}${issuePart})`;
        }
        return `${issue} (https://github.com/${issuePart})`;
    });
}
;
export function linkifyCommit(url, commit) {
    return `${commit} (${url}/commit/${commit})`;
}
;
export function linkifyCommitRange(url, commitRange) {
    return `${commitRange} (${url}/compare/${commitRange})`;
}
;
let tagVersionPrefix;
export async function getTagVersionPrefix(options) {
    if (tagVersionPrefix) {
        return tagVersionPrefix;
    }
    try {
        if (options.yarn) {
            tagVersionPrefix = await execa.stdout('yarn', ['config', 'get', 'version-tag-prefix']);
        }
        else {
            tagVersionPrefix = await execa.stdout('npm', ['config', 'get', 'tag-version-prefix']);
        }
    }
    catch (_) {
        tagVersionPrefix = 'v';
    }
    return tagVersionPrefix;
}
