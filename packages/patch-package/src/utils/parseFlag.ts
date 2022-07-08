const sliced = process.argv.slice(2);

export default (flag: string, argv = sliced): string => {
    const findFlag = argv.find(f => f.startsWith(flag));
	if (findFlag?.includes('=')) return (findFlag?.split('=')[1] || '');
    else return null;
}