import { Pool } from 'pg';

let pool: any;

const getConnectionPool = async () => {
    return pool ?? (await bootstrap());
};

const killConnectionPool = async () => {
    if (pool) {
        await pool.end();
        pool = undefined;
    }
};

const bootstrap = async () => {
    console.log('Bootstrapping...');
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) throw new Error('DATABASE_URL is required');

    pool = new Pool({
        connectionString: databaseUrl,
        max: 20,
        idleTimeoutMillis: 15000,
    });

    await createUsersTable(pool);
    await createBooksTable(pool);
    await createRelationsTable(pool);
};

const createUsersTable = async (pool: Pool) => {
    await pool.query(`
        DROP TABLE IF EXISTS users_books;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS books;
        CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(50) NOT NULL,
            name VARCHAR(50) NOT NULL,
            username VARCHAR(50) NOT NULL,
            password VARCHAR(100) NOT NULL,
            CONSTRAINT user_pkey PRIMARY KEY (id),
            CONSTRAINT username_uq UNIQUE (username)
        );
    `);
};

const createBooksTable = async (pool: Pool) => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS books (
            id VARCHAR(50) NOT NULL,
            isbn VARCHAR(50) NOT NULL,
            name VARCHAR(150) NOT NULL,
            author VARCHAR(150) NOT NULL,
            CONSTRAINT book_pkey PRIMARY KEY (id)
        );
    `);
};

const createRelationsTable = async (pool: Pool) => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users_books (
            id_user VARCHAR(50) NOT NULL,
            id_book VARCHAR(50) NOT NULL,
            CONSTRAINT users_books_pkey PRIMARY KEY (id_user, id_book),
            CONSTRAINT users_fkey FOREIGN KEY (id_user) REFERENCES users(id)
                ON UPDATE CASCADE ON DELETE RESTRICT,
            CONSTRAINT books_fkey FOREIGN KEY (id_book) REFERENCES books(id)
                ON UPDATE CASCADE ON DELETE RESTRICT
        );
    `);
};

export { getConnectionPool, killConnectionPool, bootstrap };
