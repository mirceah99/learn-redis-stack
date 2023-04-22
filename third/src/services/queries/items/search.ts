import { itemsIndexKey } from '$services/keys';
import { client } from '$services/redis';
import { deserialize } from './deserialize';

export const searchItems = async (term: string, size: number = 5) => {
	const cleanedInput = term
		.replaceAll(/[^a-zA-Z0-9]/g, '')
		.trim()
		.split(' ')
		.map((term) => (term ? `%${term}%` : ''))
		.join(' ');
	if (cleanedInput === '') return [];

	const results = await client.ft.search(itemsIndexKey(), cleanedInput, {
		LIMIT: { from: 0, size }
	});
	console.dir(results, { depth: null });
	return [];
};
