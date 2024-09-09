import type { FastifyInstance } from 'fastify';
import { authenticateUserController, authorizeController } from '../controllers/auth.controller';
import { attachBookToUserController, createUserController } from '../controllers/user.controller';

const userRoutes = async (fastify: FastifyInstance) => {
    fastify.post('/users', createUserController);
    fastify.post('/users/authenticate', authenticateUserController);
    fastify.post('/users/:userId/books/:bookId', { preHandler: authorizeController }, attachBookToUserController);
};

export { userRoutes };
