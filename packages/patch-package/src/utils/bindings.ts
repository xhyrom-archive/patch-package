import loadBinding from './loadBinding';

let nativeBinding = null;

export default () => {
	if (nativeBinding) return nativeBinding;
	const { platform, arch } = process;

	switch (platform) {
		case 'darwin': {
			switch (arch) {
				case 'x64':
					nativeBinding = loadBinding(
						'patch-package-bindings.darwin-x64.node',
						'@xhyrom/patch-package-bindings-darwin-x64',
					);
					break;
			}
			break;
		}
		case 'linux': {
			switch (arch) {
				case 'x64':
					nativeBinding = loadBinding(
						'patch-package-bindings.linux-x64-gnu.node',
						'@xhyrom/patch-package-bindings-linux-x64-gnu',
					);
					break;
			}
			break;
		}
		case 'win32': {
			nativeBinding = loadBinding(
				'patch-package-bindings.win32-x64-msvc.node',
				'@xhyrom/patch-package-bindings-win32-x64-msvc',
			);
			break;
		}
	}

	return nativeBinding;
};
