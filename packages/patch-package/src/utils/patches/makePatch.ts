import { getPatchDetailsFromCliString } from '../package/packageDetails'

export default (packagePathSpecifier: string) => {
    const packageDetails = getPatchDetailsFromCliString(packagePathSpecifier)

    if (!packageDetails) {
      console.error('No such package', packagePathSpecifier)
      return
    }

    console.log(packageDetails);
}