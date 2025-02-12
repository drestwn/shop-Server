// server.js
import fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import categoryRoutes from './routes/category.js';
import productRoutes from './routes/product.js';

const fastifyInstance = fastify({
    logger: true
});
const prisma = new PrismaClient();

// Register routes

await categoryRoutes(fastifyInstance, prisma);
await productRoutes(fastifyInstance, prisma);

// Error handling
fastifyInstance.setErrorHandler((error, request, reply) => {
    reply.status(error.statusCode || 500).send({ error: error.message });
});

// Run the server!
try {
    await fastifyInstance.listen({ port: 3000 });
} catch (err) {
    fastifyInstance.log.error(err);
    process.exit(1);
}