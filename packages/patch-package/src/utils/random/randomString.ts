import { randomNumber } from './randomNumber';

export const randomString = (length?: number): string => {
	if (!length) length = randomNumber(7, 5);
	return [...Array(length)].map(() => Math.random().toString(36)[2]).join('');
};