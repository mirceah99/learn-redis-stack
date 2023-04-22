import { itemsKey, itemsViewsKey, itemsViewsKeyHyperLogLog } from '$services/keys';
import { createClient, defineScript } from 'redis';
import { createIndexes } from './create-indexes';

const client = createClient({
	socket: {
		host: process.env.REDIS_HOST,
		port: parseInt(process.env.REDIS_PORT || '14201')
	},
	password: process.env.REDIS_PW,
	scripts: {
		incrementViews: defineScript({
			NUMBER_OF_KEYS: 3,
			SCRIPT: `
			local itemsViewsKeyHyperLogLog =  KEYS[1];
			local itemKey =  KEYS[2];
			local itemsViewsKeySortedSet =  KEYS[3];
			local itemId =  ARGV[1];
			local userId =  ARGV[2];

			local alreadyViewed = redis.call("PFADD", itemsViewsKeyHyperLogLog, userId);

			if alreadyViewed == 0 then
               return 'ok'
			end
			
			redis.call("HINCRBY", itemKey, 'views', 1);
			redis.call("ZINCRBY", itemsViewsKeySortedSet, 1, itemId);
			
			return 'ok'`,
			transformArguments(itemId: string, userId: string) {
				return [
					itemsViewsKeyHyperLogLog(itemId),
					itemsKey(itemId),
					itemsViewsKey(),
					itemId,
					userId
				];
			},
			transformReply(reply) {
				return reply;
			}
		}),
		unlock: defineScript({
			NUMBER_OF_KEYS: 1,
			SCRIPT: `
			local keyToUnlock =  KEYS[1];
			local valueToCheck =  ARGV[1];

			if redis.call("GET", keyToUnlock) == valueToCheck then
               return redis.call("DEL", keyToUnlock);
			end
			`,
			transformArguments(keyToUnlock: string, token: string) {
				return [keyToUnlock, token];
			},
			transformReply(reply) {
				return reply;
			}
		})
	}
});
client.on('connect', async () => {
	try {
		console.log('Create indexes!');
		await createIndexes();
	} catch (e) {
		console.log('create indexes on connection failed !!');
		console.error(e);
	}
});

client.on('error', (err) => console.error(err));
client.connect();

export { client };
