export default (packageJsonPath: string): string => {
    return require(packageJsonPath).version.replace(/\+.*$/, "")
}