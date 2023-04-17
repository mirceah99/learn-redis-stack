import type { CreateItemAttrs } from '$services/types';
import { client } from '$services/redis';
import { serialize } from './serialize';
import { genId } from '$services/utils';
import { itemsKey, itemsViewsKey, itemsEndingAtKey, itemsByPriceKey } from '$services/keys';
import { deserialize } from './deserialize';

export const getItem = async (id: string) => {
	const item = await client.hGetAll(itemsKey(id));

	if (Object.keys(item).length === 0) {
		return null;
	}

	return deserialize(id, item);
};

export const getItems = async (ids: string[]) => {
	const redisAns = await Promise.all(ids.map((id) => client.hGetAll(itemsKey(id))));
	return redisAns.map((item, index) => deserialize(ids[index], item));
};

export const createItem = async (attrs: CreateItemAttrs) => {
	const id = genId();

	const serialized = serialize(attrs);

	await Promise.all([
		client.hSet(itemsKey(id), serialized),
		client.zAdd(itemsViewsKey(), { value: id, score: 0 }),
		client.zAdd(itemsEndingAtKey(), { value: id, score: serialized.endingAt }),
		client.zAdd(itemsByPriceKey(), { value: id, score: 0 })
	]);

	return id;
};
