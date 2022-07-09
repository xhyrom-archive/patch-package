export default (packageJsonPath: string): string => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(packageJsonPath).version.replace(/\+.*$/, '');
};