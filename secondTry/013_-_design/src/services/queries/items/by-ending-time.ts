import { itemsEndingAtKey } from '$services/keys';
import { client } from '$services/redis';
import { getItems } from './items';

export const itemsByEndingTime = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {
	//Date.now()
	const ids = await client.zRange(itemsEndingAtKey(), Date.now(), '+inf', {
		LIMIT: { offset, count },
		BY: 'SCORE'
	});
	console.log(ids);
	return getItems(ids);
};
