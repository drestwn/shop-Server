// routes/product.js

export default async function (fastify, prisma) {
  fastify.get("/products", async (request, reply) => {
    const products = await prisma.product.findMany({
      include: { category: true },
    });
    return products;
  });

  fastify.get("/product/:productId", async (request, reply) => {
    const { productId } = request.params;
    console.log(request.params);
    const products = await prisma.product.findUnique({
      where: { id: Number(productId) },
      include: {
        category: true,
      },
    });
    return products;
  });

  fastify.post("/products", async (request, reply) => {
    const { name, price, categoryId } = request.body;
    if (!name || !price || !categoryId) {
      return reply
        .status(400)
        .send({ error: "Name, price, and categoryId are required" });
    }
    const product = await prisma.product.create({
      data: { name, price, categoryId: Number(categoryId) },
    });
    return reply.status(201).send(product);
  });
}
