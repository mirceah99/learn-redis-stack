import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { client } from '$services/redis';
import { usersKey, usernamesKey } from '$services/keys';

export const getUserByUsername = async (username: string) => {};

export const getUserById = async (id: string) => {
	const redisUser = await client.hGetAll(usersKey(id));
	return deserializeUser(id, redisUser);
};

export const createUser = async (attrs: CreateUserAttrs) => {
	const id = genId();
	await client.hSet(usersKey(id), serializeUser(attrs));
	return id;
};

const serializeUser = (user: CreateUserAttrs) => {
	return { username: user.username, password: user.password };
};

const deserializeUser = (id: string, redisUser: { [key: string]: string }) => {
	if (Object.keys(redisUser).length === 0) return null;
	return { ...redisUser, id };
};
