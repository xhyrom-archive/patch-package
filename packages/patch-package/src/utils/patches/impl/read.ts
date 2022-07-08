import { readFileSync } from "fs"
import { normalize, relative, resolve } from "path"
import { red } from "../../colors";
import { PackageDetails } from "../../package/packageDetails";
import { parsePatchFile, PatchFilePart } from "./parse"

export function readPatch({
  patchFilePath,
  packageDetails,
  patchDir,
}: {
  patchFilePath: string
  packageDetails: PackageDetails
  patchDir: string
}): PatchFilePart[] {
  try {
    return parsePatchFile(readFileSync(patchFilePath, { encoding: 'utf-8', flag: 'r' }).toString())
  } catch (e) {
    const fixupSteps: string[] = []
    const relativePatchFilePath = normalize(
      relative(process.cwd(), patchFilePath),
    )
    const patchBaseDir = relativePatchFilePath.slice(
      0,
      relativePatchFilePath.indexOf(patchDir),
    )
    if (patchBaseDir) {
      fixupSteps.push(`cd ${patchBaseDir}`)
    }
    fixupSteps.push(
      `patch -p1 -i ${relativePatchFilePath.slice(
        relativePatchFilePath.indexOf(patchDir),
      )}`,
    )
    fixupSteps.push(`npx patch-package ${packageDetails.pathSpecifier}`)
    if (patchBaseDir) {
      fixupSteps.push(
        `cd ${relative(resolve(process.cwd(), patchBaseDir), process.cwd())}`,
      )
    }

    console.error(
        `${red}**ERROR** Failed to apply patch for package ${packageDetails.humanReadablePathSpecifier}
    
  This happened because the patch file ${relativePatchFilePath} could not be parsed.
   
  If you just upgraded patch-package, you can try running:
  
    ${fixupSteps.join("\n    ")}
    
  Otherwise, try manually creating the patch file again.
  
  If the problem persists, please submit a bug report:
  
    https://github.com/ds300/patch-package/issues/new?title=Patch+file+parse+error&body=%3CPlease+attach+the+patch+file+in+question%3E
`);

    process.exit(1)
  }
  return []
}