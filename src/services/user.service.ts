import type { Pool } from 'pg';
import { getConnectionPool } from '../config/db.config';
import type { User } from '../models/user.model';

const createUser = async (user: User): Promise<User> => {
    const { id, name, username, password } = user;

    const pool: Pool = await getConnectionPool();

    const query: string = `
            INSERT INTO users (id, name, username, password)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, username;
        `;

    try {
        const { rows } = await pool.query(query, [id, name, username, password]);
        return rows[0];
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const getUserByUsername = async (username: string): Promise<User | null> => {
    const pool: Pool = await getConnectionPool();

    const query: string = `SELECT * FROM users WHERE username = $1;`;

    try {
        const { rows } = await pool.query(query, [username]);
        return rows[0] ?? null;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const attachBookToUser = async (userId: string, bookId: string): Promise<void> => {
    const pool: Pool = await getConnectionPool();

    const query: string = `
            INSERT INTO users_books (id_user, id_book)
            VALUES ($1, $2)
            RETURNING *;
        `;

    try {
        await pool.query(query, [userId, bookId]);
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export { attachBookToUser, createUser, getUserByUsername };
