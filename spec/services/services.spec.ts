import bcrypt from 'bcrypt';
import { describe, expect, it, mock } from 'bun:test';
import type { Book } from '../../src/models/book.model';
import type { User } from '../../src/models/user.model';
import { generateToken, validateUserId, verifyToken } from '../../src/services/auth.service';
import { createBook, getBookById } from '../../src/services/book.service';
import { createUser, getUserByUsername } from '../../src/services/user.service';

const encryptedPassword = mock(async (password) => await bcrypt.hash(password, 10));
const validUserId1 = 'aa387b5a-b111-4527-a5e1-7913df02ee34';
const validUserId2 = '3414e14b-aad9-4f97-8b1a-ea86de5fa5f0';
const validBookId = '3414e14b-aad9-4f97-8b1a-ea86de5fa123';
const validToken = mock(() => generateToken(validUserId1));

describe('user.service test cases', () => {
    it('should create a new user', async () => {
        const payload: User = {
            id: validUserId1,
            name: 'John Doe',
            username: 'john.doe',
            password: await encryptedPassword('JohnDoe123*'),
        };

        const newUser = await createUser(payload);

        expect(newUser).toBeDefined();
        expect(newUser.id).toBe(payload.id);
        expect(newUser.name).toBe(payload.name);
        expect(newUser.username).toBe(payload.username);
        expect(newUser.password).not.toBeDefined();
    });

    it('should fail if a username already exists', async () => {
        const payload: User = {
            id: validUserId2,
            name: 'John Doe',
            username: 'john.doe',
            password: await encryptedPassword('JohnDoe123*'),
        };

        try {
            await createUser(payload);
        } catch (error: any) {
            expect(error.message).toBe('duplicate key value violates unique constraint "username_uq"');
        }
    });

    it('should get a user by username', async () => {
        const payload: string = 'john.doe';

        const user: User | null = await getUserByUsername(payload);

        expect(user).toBeDefined();

        if (user) {
            expect(user.id).toBeDefined();
            expect(user.name).toBeDefined();
            expect(user.username).toBe(payload);
            expect(user.password).toBeDefined();
        } else {
            expect(user).toBeNull();
        }
    });

    it('should return null if the user does not exist', async () => {
        const payload: string = 'jane.doe';

        const user: User | null = await getUserByUsername(payload);

        expect(user).toBeNull();
    });
});

describe('book.service test cases', () => {
    it('should create a new book', async () => {
        const payload: Book = {
            id: validBookId,
            isbn: '9780547928227',
            name: 'The Hobbit',
            author: 'J.R.R. Tolkien',
        };

        const newBook = await createBook(payload);

        expect(newBook).toBeDefined();
        expect(newBook.id).toBe(payload.id);
        expect(newBook.isbn).toBe(payload.isbn);
        expect(newBook.name).toBe(payload.name);
        expect(newBook.author).toBe(payload.author);
    });

    it('should get a book by id', async () => {
        const payload: string = validBookId;

        const book: Book | null = await getBookById(payload);

        expect(book).toBeDefined();

        if (book) {
            expect(book.id).toBe(payload);
            expect(book.isbn).toBeDefined();
            expect(book.name).toBeDefined();
            expect(book.author).toBeDefined();
        } else {
            expect(book).toBeNull();
        }
    });

    it('should return null if the book does not exist', async () => {
        const payload: string = '123';

        const book: Book | null = await getBookById(payload);

        expect(book).toBeNull();
    });
});

describe('auth.service test cases', () => {
    it('should generate a new JWT with the userId', () => {
        const payload = validUserId1;
        const token = generateToken(payload);

        expect(token).toBeDefined();
    });

    it('should verify a valid JWT', () => {
        const payload = validToken();
        const testToken = verifyToken(payload);

        expect(testToken).toBeDefined();
    });

    it('should return null for an invalid JWT', () => {
        const payload = '123';
        const testToken = verifyToken(payload);

        expect(testToken).toBeNull();
    });

    it('should validate the userId from a JWT', () => {
        const userId = validUserId1;
        const token = generateToken(userId);
        const isValid = validateUserId(userId, token);

        expect(isValid).toBeTruthy();
    });

    it('should return false if the userId is invalid', () => {
        const userId = '456';
        const token = generateToken('123');
        const isValid = validateUserId(userId, token);

        expect(isValid).toBeFalsy();
    });
});
