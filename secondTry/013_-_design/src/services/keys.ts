export const pageCacheKey = (id: string) => `pagecache#${id}`;
export const sessionsKey = (sessionId: string) => `sessions#${sessionId}`;
//items
export const itemsKey = (itemId: string) => `items#${itemId}`;
export const itemsViewsKey = () => `items:views`;
export const itemsEndingAtKey = () => `items:endingAt`;

//users
export const usersKey = (userId: string) => `users#${userId}`;
export const usernamesUniqueKey = () => 'username:unique';
export const usersLikesKey = (userId: string) => `users:likes#${userId}`;
export const usernamesKey = () => `usernames`;
