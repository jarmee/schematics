import { Tree } from "@angular-devkit/schematics";

export function addPackageJsonDependency(host: Tree, type: string, pkg: string, version: string) {
    if (host.exists('package.json')) {
        const sourceText = host.read('package.json')!.toString('utf-8');
        const json = JSON.parse(sourceText);
        if (!json[type]) {
            json[type] = {};
        }
        if (!json[type][pkg]) {
            json[type][pkg] = version;
        }
        host.overwrite('package.json', JSON.stringify(json));
    }
    return host;
}

export function addPropertyToPackageJson(host: Tree, name: string, value: any) {
    if (host.exists('package.json')) {
        const sourceText = host.read('package.json')!.toString('utf-8');
        const json = JSON.parse(sourceText);
        if (!json[name]) {
            json[name] = {};
        }
        json[name] = value;
        host.overwrite('package.json', JSON.stringify(json));
    }
    return host;
}

export function addScriptToPackageJson(host: Tree, name: string, value: string) {
    if (host.exists('package.json')) {
        const sourceText = host.read('package.json')!.toString('utf-8');
        const json = JSON.parse(sourceText);
        if (!json['scripts']) {
            json[name] = {};
        }
        json['scripts'][name] = value;
        host.overwrite('package.json', JSON.stringify(json));
    }
    return host;
}