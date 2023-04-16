import type { Session } from '$services/types';
import { sessionsKey } from '$services/keys';
import { client } from '$services/redis';
export const getSession = async (id: string) => {
	const session = await client.hGetAll(sessionsKey(id));
	return deserializeSession(id, session);
};

export const saveSession = async (session: Session) => {
	const id = session.id;
	await client.hSet(sessionsKey(id), serializeSession(session));
	return id;
};

const deserializeSession = (id: string, redisSession: { [key: string]: string }) => {
	if (Object.keys(redisSession).length === 0) return null;
	return { ...redisSession, id };
};
const serializeSession = (session: Session) => {
	return { userId: session.id, username: session.username };
};
