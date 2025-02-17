// routes/category.js
import { PrismaClient } from "@prisma/client";

export default async function (fastify, prisma) {
  fastify.get("/brands", async (request, reply) => {
    const brands = await prisma.product.findMany({
      include: { brand: true },
    });
    return brands;
  });

  fastify.get("/brand/:id", async (request, reply) => {
    const { id } = request.params;
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
      include: { products: true },
    });
    if (!category) {
      return reply.status(404).send({ error: "Category not found" });
    }
    return category;
  });
}
