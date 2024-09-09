import type { Pool } from 'pg';
import { getConnectionPool } from '../config/db.config';
import type { Book } from '../models/book.model';

const createBook = async (book: Book) => {
    const { id, isbn, name, author } = book;

    const pool: Pool = await getConnectionPool();

    const query: string = `
            INSERT INTO books (id, isbn, name, author)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;

    try {
        const { rows } = await pool.query(query, [id, isbn, name, author]);
        return rows[0];
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const getBookById = async (id: string): Promise<Book | null> => {
    const pool: Pool = await getConnectionPool();

    const query: string = `SELECT * FROM books WHERE id = $1;`;

    try {
        const { rows } = await pool.query(query, [id]);
        return rows[0] ?? null;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export { createBook, getBookById };
