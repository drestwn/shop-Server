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

    // First, check if the user already exists based on the provider ID
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ google_id: provider_id }, { github_id: provider_id }],
      },
    });

    if (existingUser) {
      // User exists, update email if changed and return the user
      if (existingUser.email !== email) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { email: email, updatedAt: new Date() },
        });
      }
      return reply.status(200).send(existingUser);
    } else {
      // User does not exist, create a new one

      const createData = {
        email: email,
        name: request.body.name || null,
      };

      // Set the appropriate provider ID
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
