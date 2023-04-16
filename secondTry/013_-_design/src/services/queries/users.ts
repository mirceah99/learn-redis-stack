import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { client } from '$services/redis';
import { usersKey, usernamesUniqueKey, usernamesKey } from '$services/keys';
export const getUserByUsername = async (username: string) => {
	const decimalId = await client.zScore(usernamesKey(), username);
	if (!decimalId) throw new Error(`User not found ${username}`);
	return getUserById(decimalId.toString(16));
};

export const getUserById = async (id: string) => {
	const user = await client.hGetAll(usersKey(id));

	return deserialize(id, user);
};

export const createUser = async (attrs: CreateUserAttrs) => {
	const id = genId();
	if (await client.sIsMember(usernamesUniqueKey(), attrs.username))
		throw new Error(`username ${attrs.username} already used`);
	await client.hSet(usersKey(id), serialize(attrs));
	await client.sAdd(usernamesUniqueKey(), attrs.username);
	await client.zAdd(usernamesKey(), { value: attrs.username, score: parseInt(id, 16) });
	return id;
};

const serialize = (user: CreateUserAttrs) => {
	return {
		username: user.username,
		password: user.password
	};
};

const deserialize = (id: string, user: { [key: string]: string }) => {
	return {
		id,
		username: user.username,
		password: user.password
	};
};
