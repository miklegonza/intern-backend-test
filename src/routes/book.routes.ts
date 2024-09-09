import type { FastifyInstance } from 'fastify';
import { authorizeController } from '../controllers/auth.controller';
import { createBookController } from '../controllers/book.controller';

const bookRoutes = async (fastify: FastifyInstance) => {
    fastify.post('/books', { preHandler: authorizeController }, createBookController);
};

export { bookRoutes };
