export async function generatePublishManifest(manifest, config, _dists) {
    const { name, version, description, keywords, homepage, bugs, bin, license, authors, contributors, man, sideEffects, repository, dependencies, peerDependencies, devDependencies, bundledDependencies, optionalDependencies, engines, enginesStrict, private: priv, publishConfig, } = manifest;
    const newManifest = {
        name,
        description,
        version,
        license,
        bin,
        files: ['dist-*/', 'bin/'],
        pika: true,
        sideEffects: sideEffects || false,
        keywords,
        homepage,
        bugs,
        authors,
        contributors,
        man,
        repository,
        dependencies: dependencies || {},
        peerDependencies,
        devDependencies,
        bundledDependencies,
        optionalDependencies,
        engines,
        enginesStrict,
        private: priv,
        publishConfig,
    };
    const dists = _dists || (await config.getDistributions());
    for (const [runner, options] of dists) {
        if (runner.manifest) {
            await runner.manifest(newManifest, {
                cwd: config.cwd,
                isFull: true,
                manifest,
                options,
            });
        }
    }
    newManifest.pika = true;
    return newManifest;
}
export function generatePrettyManifest(manifest) {
    return JSON.stringify({
        ...manifest,
        dependencies: Object.keys(manifest.dependencies).length === 0 ? {} : '{ ... }',
    }, null, 2);
}
