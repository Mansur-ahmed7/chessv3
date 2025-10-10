import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

// Make database connection optional for deployment without DATABASE_URL
let db: any = null;

if (env.DATABASE_URL) {
	const client = postgres(env.DATABASE_URL);
	db = drizzle(client, { schema });
} else {
	// Create a mock db object for when DATABASE_URL is not available
	db = {
		insert: () => ({ values: () => Promise.resolve() }),
		select: () => ({ from: () => ({ where: () => Promise.resolve([]) }) }),
		update: () => ({ set: () => ({ where: () => Promise.resolve() }) }),
		delete: () => ({ where: () => Promise.resolve() })
	};
}

export { db };
