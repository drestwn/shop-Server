// routes/category.js
import { PrismaClient } from '@prisma/client';

export default async function (fastify, prisma) {
    fastify.get('/categories', async (request, reply) => {
        const categories = await prisma.category.findMany({
            include: { products: true }
        });
        return categories;
    });

    fastify.get('/categories/:id', async (request, reply) => {
        const { id } = request.params;
        const category = await prisma.category.findUnique({
            where: { id: Number(id) },
            include: { products: true }
        });
        if (!category) {
            return reply.status(404).send({ error: 'Category not found' });
        }
        return category;
    });

    fastify.post('/categories', async (request, reply) => {
        const { name } = request.body;
        if (!name) {
            return reply.status(400).send({ error: 'Name is required' });
        }
        const category = await prisma.category.create({
            data: { name }
        });
        return reply.status(201).send(category);
    });

    // Add more category routes here if needed
};