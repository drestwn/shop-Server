import fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import categoryRoutes from "../routes/category.js";
import productRoutes from "../routes/product.js";
import brandRoutes from "../routes/brand.js";
import userRoutes from "../routes/user.js";
import cors from "@fastify/cors";

const app = fastify({
  logger: { level: "info" },
});

app.register(cors, {
  origin: ["https://shop.portfolio.drestwn.com", "*"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

const prisma = new PrismaClient();

app.get("/", async (request, reply) => {
  return { message: "API is up and running!" };
});

try {
  await categoryRoutes(app, prisma);
  await productRoutes(app, prisma);
  await brandRoutes(app, prisma);
  await userRoutes(app, prisma);
} catch (error) {
  throw error;
}

app.setErrorHandler((error, request, reply) => {
  reply.status(error.statusCode || 500).send({ error: error.message });
});

export default async (req, res) => {
  try {
    await prisma.$connect();
    await app.ready();
    app.server.emit("request", req, res);
  } catch (error) {
    res.status(500).end("Internal Server Error");
  } finally {
    await prisma.$disconnect();
  }
};
