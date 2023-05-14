export interface IPackageInfo {
    name: string;
    version: string;
    dependencies?: { [name: string]: string };
    devDependencies?: { [name: string]: string };
}