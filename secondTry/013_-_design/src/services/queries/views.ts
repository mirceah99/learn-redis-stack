import { client } from '$services/redis';
export const incrementView = async (itemId: string, userId: string) => {
	return await client.incrementViews(itemId, userId);
};
