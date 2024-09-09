import { randomUUID } from 'crypto';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { Book } from '../models/book.model';
import { createBook } from '../services/book.service';

const createBookController = async (request: FastifyRequest, reply: FastifyReply) => {
    const { isbn, name, author } = request.body as Book;
    const id = randomUUID();
    const token = request.headers.authorization?.replace('Bearer ', '');
    const book: Book = { id, isbn, name, author };

    const bookCreated = await createBook(book);

    reply.status(201).headers({ authorization: token }).send(bookCreated);
};

export { createBookController };
