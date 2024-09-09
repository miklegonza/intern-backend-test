import bcrypt from 'bcrypt';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { getUserByUsername } from '../services/user.service';
import type { Auth } from '../models/auth.model';
import { generateToken, verifyToken } from '../services/auth.service';

const authenticateUserController = async (request: FastifyRequest, reply: FastifyReply) => {
    const { username, password } = request.body as Auth;

    const user = await getUserByUsername(username);
    const isPasswordValid: boolean = user ? await validatePassword(password, user.password) : false;

    if (!user || !isPasswordValid) {
        reply.status(401).send({ message: 'Username or password not correct' });
        return;
    }

    const token = generateToken(user.id);

    reply.headers({authorization: token}).status(200).send({token});
};

const authorizeController = async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.headers.authorization?.replace('Bearer ', '');

    const isAuthorized = verifyToken(token);

    if (!isAuthorized) {
        reply.status(401).send({ message: 'Unauthorized' });
        return;
    }
};

const validatePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return hashedPassword ? await bcrypt.compare(password, hashedPassword) : false;
};

export { authenticateUserController, authorizeController };
