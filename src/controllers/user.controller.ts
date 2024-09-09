import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { User } from '../models/user.model';
import { validateUserId } from '../services/auth.service';
import { attachBookToUser, createUser, getUserByUsername } from '../services/user.service';

const createUserController = async (request: FastifyRequest, reply: FastifyReply) => {
    const { name, username, password } = request.body as User;
    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(password, 10);
    const userExists = await validateUsernameExists(username);
    const user: User = { id, name, username, password: hashedPassword };

    if (userExists) {
        reply.status(400).send({ message: 'Username already exists' });
        return;
    }

    const userCreated = await createUser(user);

    reply.status(201).send(userCreated);
};

const attachBookToUserController = async (request: FastifyRequest, reply: FastifyReply) => {
    const { userId, bookId } = request.params as { userId: string; bookId: string };
    const token = request.headers.authorization?.replace('Bearer ', '');

    const verifyUser = validateUserId(userId, token);

    if (!verifyUser) {
        reply.status(401).send({ message: 'Unauthorized' });
        return;
    }

    await attachBookToUser(userId, bookId);

    reply.status(204).headers({ authorization: token }).send();
};

const validateUsernameExists = async (username: string): Promise<boolean> => {
    const user = await getUserByUsername(username);
    return !!user;
};

export { attachBookToUserController, createUserController };
