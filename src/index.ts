import Fastify from 'fastify';
import { bootstrap } from './config/db.config';
import { bookRoutes } from './routes/book.routes';
import { userRoutes } from './routes/user.routes';

const fastify = Fastify({ logger: true });

fastify.get('/healthcheck', async (request, reply) => {
    return { status: 'OK' };
});

fastify.register(userRoutes);
fastify.register(bookRoutes);

const startServer = async () => {
    try {
        await bootstrap();
        await fastify.listen({
            port: 3000,
            host: '0.0.0.0',
        });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

startServer();
