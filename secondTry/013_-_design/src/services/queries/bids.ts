import { bidHistoryKey, itemsKey, itemsByPriceKey } from '$services/keys';
import { client, withLock } from '$services/redis';
import type { CreateBidAttrs } from '$services/types';
import { DateTime } from 'luxon';
import { getItem } from './items';

export const createBid = async (attrs: CreateBidAttrs) => {
	return await withLock('a', async () => {
		const item = await getItem(attrs.itemId);

		if (!item) {
			throw new Error('item does not exits');
		}
		if (item.price >= attrs.amount) {
			throw new Error('to small bid');
		}
		if (item.endingAt.diff(DateTime.now()).toMillis() < 0) {
			throw new Error('item close to biding ');
		}

		return await Promise.all([
			client.rPush(
				bidHistoryKey(attrs.itemId),
				serializeHistory(attrs.amount, attrs.createdAt.toMillis())
			),
			client.hSet(itemsKey(item.id), {
				bids: item.bids + 1,
				price: attrs.amount,
				highestBidUserId: attrs.userId
			}),
			client.zAdd(itemsByPriceKey(), { value: item.id, score: attrs.amount })
		]);
	});
};

export const getBidHistory = async (itemId: string, offset = 0, count = 10) => {
	const startIndex = -offset - count;
	const endingIndex = -offset - 1;
	const results = await client.lRange(bidHistoryKey(itemId), startIndex, endingIndex);
	return results.map((bid) => deserializeHistory(bid));
};

const serializeHistory = (bidAmount: number, createdAt: number) => `${bidAmount}:${createdAt}`;
const deserializeHistory = (storedValue: string) => {
	const [amount, createdAt] = storedValue.split(':');
	return { amount: +amount, createdAt: +createdAt };
};
