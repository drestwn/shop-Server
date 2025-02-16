// server.js
import fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import categoryRoutes from "./routes/category.js";
import productRoutes from "./routes/product.js";
import brandRoutes from "./routes/brand.js";
import userRoutes from "./routes/user.js";

const fastifyInstance = fastify({
  logger: true,
});
const prisma = new PrismaClient();
fastifyInstance.addHook("onRequest", (request, reply, done) => {
  if (request.method === "OPTIONS") {
    reply
      .code(204)
      .header("Access-Control-Allow-Origin", "http://localhost:5431")
      .header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
      .header("Access-Control-Allow-Headers", "Content-Type, Authorization")
      .header("Access-Control-Allow-Credentials", "true")
      .send();
    return;
  }

  // For all other requests, set headers
  reply.header("Access-Control-Allow-Origin", "http://localhost:5431");
  reply.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  reply.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  reply.header("Access-Control-Allow-Credentials", "true");
  done();
});
// Register routes

await categoryRoutes(fastifyInstance, prisma);
await productRoutes(fastifyInstance, prisma);
await brandRoutes(fastifyInstance, prisma);
await userRoutes(fastifyInstance, prisma);
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
