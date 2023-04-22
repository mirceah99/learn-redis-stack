import { itemsIndexKey, itemsKey } from '$services/keys';
import { SchemaFieldTypes } from 'redis';
import { client } from './client';

export const createIndexes = async () => {
	const indexes = await client.ft._list();

	const itemsIndexExist = indexes.includes(itemsIndexKey());
	if (!itemsIndexExist) {
		console.log(`is time to create ${itemsIndexKey()}`);
		client.ft.create(
			itemsIndexKey(),
			{
				name: {
					type: SchemaFieldTypes.TEXT
				},
				description: {
					type: SchemaFieldTypes.TEXT
				}
			},
			{ ON: 'HASH', PREFIX: itemsKey('') }
		);
	}
	console.log('Update is done!');
};
