export default async function (fastify, prisma) {
  fastify.get("/users", async (request, reply) => {
    const users = await prisma.user.findMany({});
    return users;
  });
  fastify.get("/users/:id", async (request, reply) => {
    const { uid } = request.params;
    const user = await prisma.user.findUnique({
      where: { id: Number(uid) },
    });
    return user;
  });
  fastify.post("/user", async (request, reply) => {
    const { email, provider_id, provider } = request.body;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ google_id: provider_id }, { github_id: provider_id }],
      },
    });

    if (existingUser) {
      if (existingUser.email !== email) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { email: email, updatedAt: new Date() },
        });
      }
      return reply.status(200).send(existingUser);
    } else {
      const createData = {
        email: email,
        name: request.body.name || null,
      };

      if (provider === "google") {
        createData.google_id = provider_id;
      } else if (provider === "github") {
        createData.github_id = provider_id;
      }

      const newUser = await prisma.user.create({
        data: createData,
      });
      return reply.status(201).send(newUser);
    }
  });
}
