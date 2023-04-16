import { client } from '$services/redis';
import { usersLikesKey, itemsKey } from '$services/keys';
import { getItems } from './items';
export const userLikesItem = async (itemId: string, userId: string) => {
	return await client.sIsMember(usersLikesKey(userId), itemId);
};

export const likedItems = async (userId: string) => {
	//fetch all the items id's the this user like
	const ids = await client.sMembers(usersLikesKey(userId));
	return getItems(ids);
};

export const likeItem = async (itemId: string, userId: string) => {
	const inserted = await client.sAdd(usersLikesKey(userId), itemId);
	if (inserted) return await client.hIncrBy(itemsKey(itemId), 'likes', 1);
};

export const unlikeItem = async (itemId: string, userId: string) => {
	const removed = await client.sRem(usersLikesKey(userId), itemId);
	if (removed) return await client.hIncrBy(itemsKey(itemId), 'likes', -1);
};

export const commonLikedItems = async (userOneId: string, userTwoId: string) => {
	const commonIds = await client.sInter([usersLikesKey(userOneId), usersLikesKey(userTwoId)]);
	return getItems(commonIds);
};
