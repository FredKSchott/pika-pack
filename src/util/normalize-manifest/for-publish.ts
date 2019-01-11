import { Manifest } from "../../types";
import Config from "../../config";



export async function generatePublishManifest(
  manifest: Manifest,
  config: Config,
  _dists?: Array<[Function, any]>,
): Promise<object> {
  const newManifest = {
    name: manifest.name,
    description: manifest.description,
    version: manifest.version,
    license: manifest.license,
    pika: true,
    keywords: Array.from(new Set([...(manifest.keywords || []), 'pika-pkg'])),
    files: ['dist-*/', 'assets/', 'bin/'],
    sideEffects: manifest.sideEffects || false,
    dependencies: manifest.dependencies || {},
  };

  const dists = _dists || await config.getDistributions();
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
  return newManifest;
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
