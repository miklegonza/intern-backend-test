import { afterAll, describe, expect, it } from 'bun:test';
import type { User } from '../../src/models/user.model';
import { fastify } from '../helper.spec';

afterAll(async () => {
    if (fastify) await fastify.close();
});

describe('user.controller test cases', () => {
    it('should create a new user -> POST /users', async () => {
        const payload = {
            name: 'John Doe',
            username: 'john.doe',
            password: 'JohnDoe123*',
        };

        const response = await fastify.inject({
            method: 'POST',
            url: '/users',
            payload,
        });

        const user: User = JSON.parse(response.body);

        expect(response.statusCode).toBe(201);
        expect(user.id).toBeDefined();
        expect(user.name).toBe(payload.name);
        expect(user.username).toBe(payload.username);
        expect(user.password).not.toBeDefined();
    });

    it('should attach a book to an existing user -> POST /users/:userId/books/:bookId', async () => {
        const payload = {
            userId: 'aa387b5a-b111-4527-a5e1-7913df02ee34',
            bookId: '3414e14b-aad9-4f97-8b1a-ea86de5fa5f0',
        };

        const response = await fastify.inject({
            method: 'POST',
            url: `/users/${payload.userId}/books/${payload.bookId}`,
        });

        expect(response.statusCode).toBe(204);
        expect(response.headers.authorization).toBeDefined();
    });

    it('should fail if a username already exists', async () => {
        const payload = {
            name: 'John Doe',
            username: 'john.doe',
            password: 'JohnDoe123*',
        };

        const response = await fastify.inject({
            method: 'POST',
            url: '/users',
            payload,
        });

        expect(response.statusCode).toBe(400);
        expect(response.body).toBe(JSON.stringify({ message: 'Username already exists' }));
    });

    it('should fail if the user is not authorized to attach a book', async () => {
        const payload = {
            userId: 'aa387b5a-b111-4527-a5e1-7913df02ee34',
            bookId: '3414e14b-aad9-4f97-8b1a-ea86de5fa5f0',
        };

        const response = await fastify.inject({
            method: 'POST',
            url: `/users/${payload.userId}/books/${payload.bookId}`,
        });

        expect(response.statusCode).toBe(401);
        expect(response.body).toBe(JSON.stringify({ message: 'Unauthorized' }));
    });
});

describe('book.controller test cases', () => {
    it('should create a new book -> POST /books', async () => {
        const payload = {
            isbn: '978-3-16-148410-0',
            name: 'The Hobbit',
            author: 'J.R.R. Tolkien',
        };

        const response = await fastify.inject({
            method: 'POST',
            url: '/books',
            payload,
        });

        const book = JSON.parse(response.body);

        expect(response.statusCode).toBe(201);
        expect(book.id).toBeDefined();
        expect(book.isbn).toBe(payload.isbn);
        expect(book.name).toBe(payload.name);
        expect(book.author).toBe(payload.author);
        expect(response.headers.authorization).toBeDefined();
    });

    it('should fail if the user is not authorized to create a book', async () => {
        const payload = {
            isbn: '978-3-16-148410-0',
            name: 'The Hobbit',
            author: 'J.R.R. Tolkien',
        };

        const response = await fastify.inject({
            method: 'POST',
            url: '/books',
            payload,
        });

        expect(response.statusCode).toBe(401);
        expect(response.body).toBe(JSON.stringify({ message: 'Unauthorized' }));
    });
});

describe('auth.controller test cases', () => {
    it('should check user credentials -> POST /users/authenticate', async () => {
        const payload = {
            username: 'john.doe',
            password: 'JohnDoe123*',
        };

        const response = await fastify.inject({
            method: 'POST',
            url: '/users/authenticate',
            payload,
        });

        const { token } = JSON.parse(response.body);

        expect(response.statusCode).toBe(200);
        expect(response.headers.authorization).toBeDefined();
        expect(token).toBeDefined();
    });

    it("should fail if the user doesn't exists or the credentials are incorrect", async () => {
        const payload = {
            username: 'john.doe',
            password: 'JohnDoe123',
        };

        const response = await fastify.inject({
            method: 'POST',
            url: '/users/authenticate',
            payload,
        });

        expect(response.statusCode).toBe(401);
        expect(response.body).toBe(JSON.stringify({ message: 'Username or password not correct' }));
    });
});
