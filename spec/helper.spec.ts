import { beforeAll } from 'bun:test';
import type { FastifyInstance } from 'fastify';
import Fastify from 'fastify';
import { bootstrap } from '../src/config/db.config';
import { bookRoutes } from '../src/routes/book.routes';
import { userRoutes } from '../src/routes/user.routes';

const fastify: FastifyInstance = Fastify();

beforeAll(async () => {
    await fastify.register(userRoutes);
    await fastify.register(bookRoutes);
    await fastify.ready();
    await bootstrap();
});

export { fastify };

