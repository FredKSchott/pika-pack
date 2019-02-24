// @flow
import * as nodeFs from 'fs';
import * as nodePath from 'path';
import * as url from 'url';
import chalk from 'chalk';
import { validateDynamicImportArguments } from './babel-validate-specifier.js';
const BareIdentifierFormat = /^((?:@[^\/]+\/)?[^\/]+)(\/.*)?$/;
function log(symbol, fileName, errors) {
    if (!Array.isArray(errors)) {
        errors = [errors];
    }
    console.log(`${symbol}  `, chalk.bold(fileName));
    for (const error of errors) {
        console.log(`  ${chalk.dim('≫')} ${error}`);
    }
}
export default function transform({ template, types: t }) {
    function rewriteImport(specifier, { opts, file }) {
        const { deps, addExtensions } = opts;
        try {
            url.parse(specifier);
        }
        catch (err) {
            return;
        }
        // URL w/o protocol
        if (specifier.substr(0, 2) === '//') {
            return; // Leave it alone
        }
        // Local path
        if (['.', '/'].indexOf(specifier.charAt(0)) >= 0) {
            if (addExtensions) {
                const extname = nodePath.extname(specifier);
                if (extname === '.js') {
                    return;
                }
                if (extname) {
                    console.warn('Unexpected file extension:', specifier);
                    return;
                }
                const resolvedPath = nodePath.resolve(nodePath.dirname(file.opts.filename), specifier);
                try {
                    const stat = nodeFs.lstatSync(resolvedPath);
                    if (stat.isDirectory()) {
                        return specifier + '/index';
                    }
                }
                catch (err) {
                    // do nothing
                }
                return specifier + '.js';
            }
            return;
        }
        // A 'bare' identifier
        const match = BareIdentifierFormat.exec(specifier);
        if (deps && match) {
            const packageName = match[1];
            // const file = match[2] || '';
            return deps[packageName];
        }
    }
    return {
        visitor: {
            'ImportDeclaration|ExportNamedDeclaration|ExportAllDeclaration'(path, { opts, file }) {
                if (!path.node.source) {
                    return;
                }
                const rewrittenSpecifier = rewriteImport(path.node.source.value, { opts, file });
                if (rewrittenSpecifier) {
                    path.node.source.value = rewrittenSpecifier;
                }
            },
            Import(path, { opts, file }) {
                const errors = validateDynamicImportArguments(path);
                if (errors.size > 0) {
                    return;
                }
                const [importPath] = path.parent.arguments;
                const rewrittenSpecifier = rewriteImport(importPath.value, { opts, file });
                if (rewrittenSpecifier) {
                    importPath.value = rewrittenSpecifier;
                }
            },
        },
    };
}
