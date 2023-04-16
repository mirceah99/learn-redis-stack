import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
	await client.hSet('car', {
		color: 'red',
		year: 1950
	});
	const car = await client.hGetAll('car51245');
	console.log(car);
};
run();
