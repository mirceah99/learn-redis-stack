import { client } from './client';
export const withLock = async (keyToLock: string, cb: () => any) => {
	let retriesRemained = 10;
	const delayMs = 100;

	const randVal = Math.random().toString().split('.')[1];
	const lockKey = `lock:${keyToLock}`;

	while (retriesRemained--) {
		const locked = await client.set(lockKey, randVal, { NX: true });
		if (!locked) {
			await pause(delayMs);
			continue;
		}
		const result = await cb();
		await client.del(lockKey);
		return result;
	}
};

const buildClientProxy = () => {};

const pause = (duration: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, duration);
	});
};
