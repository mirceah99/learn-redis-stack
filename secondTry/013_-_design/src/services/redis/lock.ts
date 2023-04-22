import { client } from './client';
export const withLock = async (keyToLock: string, cb: () => any) => {
	let retriesRemained = 10;
	const delayMs = 100;

	const randVal = Math.random().toString().split('.')[1];
	const lockKey = `lock:${keyToLock}`;

	while (retriesRemained--) {
		const locked = await client.set(lockKey, randVal, { NX: true, EX: 3 });
		if (!locked) {
			await pause(delayMs);
			continue;
		}
		try {
			const result = await cb();
			console.log('=====>>>', result);
			return result;
		} finally {
			await client.unlock(lockKey, randVal);
		}
	}
	throw new Error('not available now, please try again later!!');
};

const buildClientProxy = () => {};

const pause = (duration: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, duration);
	});
};
