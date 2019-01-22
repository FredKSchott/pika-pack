import newGithubReleaseUrl from 'new-github-release-url';
import opn from 'opn';
import {getTagVersionPrefix} from './util.js';
import * as version from './version.js';

export async function release(options) {
	const tag = await getTagVersionPrefix(options) + options.version;
	const url = newGithubReleaseUrl({
		repoUrl: options.repoUrl,
		tag,
		body: options.releaseNotes(tag),
		isPrerelease: version.isPrereleaseVersion(options.version)
	});

	opn(url, {wait: false});
};
