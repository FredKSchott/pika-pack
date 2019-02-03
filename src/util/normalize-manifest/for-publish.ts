import {Manifest} from '../../types';
import Config from '../../config';

export async function generatePublishManifest(
  manifest: any,
  config: Config,
  _dists?: Array<[Function, any]>,
): Promise<object> {
  const {
    name,
    version,
    description,
    keywords,
    homepage,
    bugs,
    bin,
    license,
    authors,
    contributors,
    man,
    repository,
    dependencies,
    peerDependencies,
    devDependencies,
    bundledDependencies,
    optionalDependencies,
    engines,
    enginesStrict,
    private: priv,
    publishConfig,
  } = manifest;

  const newManifest = {
    name,
    description,
    version,
    license,
    bin,
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

  return {
    ...newManifest,
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
    publishConfig,
  }
}

export function generatePrettyManifest(manifest) {
  return JSON.stringify(
    {
      ...manifest,
      dependencies: Object.keys(manifest.dependencies).length === 0 ? {} : '{ ... }',
    },
    null,
    2,
  );
}
