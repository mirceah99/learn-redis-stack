import { client } from '$services/redis';
import { itemsViewsKey, itemsKey } from '$services/keys';
export const incrementView = async (itemId: string, userId: string) => {
	return await Promise.all([
		client.zIncrBy(itemsViewsKey(), 1, itemsKey(itemId)),
		client.hIncrBy(itemsKey(itemId), 'views', 1)
	]);
};
