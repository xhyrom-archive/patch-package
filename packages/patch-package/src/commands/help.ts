const bold = (text) => `\u001b[1m${text}\u001b[0m`;
const underline = (text) => `\u001b[4m[1m${text}\u001b[0m`;

export default () => {
    console.log(`
    Usage:
      1. Patching packages
      ====================
        ${bold('patch-package')}
      Without arguments, the ${bold(
        'patch-package',
      )} command will attempt to find and apply
      patch files to your project. It looks for files named like
         ./patches/<package-name>+<version>.patch
      Options:
        ${bold('--patch-dir <dirname>')}
          Specify the name for the directory in which the patch files are located.
          
        ${bold('--error-on-fail')}
        
          Forces patch-package to exit with code 1 after failing.
        
          When running locally patch-package always exits with 0 by default.
          This happens even after failing to apply patches because otherwise 
          yarn.lock and package.json might get out of sync with node_modules,
          which can be very confusing.
          
          --error-on-fail is ${bold('switched on')} by default on CI.
          
          See https://github.com/ds300/patch-package/issues/86 for background.
        ${bold('--reverse')}
            
          Un-applies all patches.
          Note that this will fail if the patched files have changed since being
          patched. In that case, you'll probably need to re-install 'node_modules'.
          This option was added to help people using CircleCI avoid an issue around caching
          and patch file updates (https://github.com/ds300/patch-package/issues/37),
          but might be useful in other contexts too.
          
      2. Creating patch files
      =======================
        ${bold('patch-package')} <package-name>${underline(
        '[ <package-name>]',
      )}
      When given package names as arguments, patch-package will create patch files
      based on any changes you've made to the versions installed by yarn/npm.
      Options:
      
        ${bold('--create-issue')}
        
           For packages whose source is hosted on GitHub this option opens a web
           browser with a draft issue based on your diff.
        ${bold('--use-yarn')}
            By default, patch-package checks whether you use npm or yarn based on
            which lockfile you have. If you have both, it uses npm by default.
            Set this option to override that default and always use yarn.
        ${bold('--exclude <regexp>')}
            Ignore paths matching the regexp when creating patch files.
            Paths are relative to the root dir of the package to be patched.
            Default: 'package\\.json$'
        ${bold('--include <regexp>')}
            Only consider paths matching the regexp when creating patch files.
            Paths are relative to the root dir of the package to be patched.
            Default '.*'
        ${bold('--case-sensitive-path-filtering')}
            Make regexps used in --include or --exclude filters case-sensitive.
        
        ${bold('--patch-dir')}
            Specify the name for the directory in which to put the patch files.
    `);
}