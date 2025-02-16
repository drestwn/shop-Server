import fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import categoryRoutes from "../routes/category.js";
import productRoutes from "../routes/product.js";
import brandRoutes from "../routes/brand.js";
import userRoutes from "../routes/user.js";
import cors from "@fastify/cors";

const app = fastify({
  logger: { level: "info" }, // Setting a more detailed logging level
});

// Fix CORS issue
app.register(cors, {
  origin: ["https://shop.portfolio.drestwn.com", "*"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

const prisma = new PrismaClient();

app.get("/", async (request, reply) => {
  return { message: "API is up and running!" };
});

// Register Routes
try {
  await categoryRoutes(app, prisma);
  await productRoutes(app, prisma);
  await brandRoutes(app, prisma);
  await userRoutes(app, prisma);
} catch (error) {
  console.error("Error registering routes:", error);
  throw error; // This will ensure the function crashes if routes can't be registered
}

// Error Handling
app.setErrorHandler((error, request, reply) => {
  console.error("Error handling request:", error);
  reply.status(error.statusCode || 500).send({ error: error.message });
});

// Export for Vercel
export default async (req, res) => {
  console.log("Request received:", req.url);
  try {
    await prisma.$connect();
    console.log("Prisma connected");
    await app.ready();
    console.log("Fastify ready");
    app.server.emit("request", req, res);
  } catch (error) {
    console.error("Error in serverless function:", error);
    res.status(500).end("Internal Server Error");
  } finally {
    await prisma.$disconnect();
    console.log("Prisma disconnected");
  }
};
