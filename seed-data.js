// seed.js
import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
const prisma = new PrismaClient();

async function main() {
  // Delete all existing records (optional, for demo or reset purposes)
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  // Read the JSON file
  const jsonData = await fs.readFile("seed.json", "utf-8");
  const data = JSON.parse(jsonData);

  // Create categories from JSON (assuming categories are in the JSON)
  const categories = {};
  for (const item of data) {
    if (!categories[item.category.name]) {
      const category = await prisma.category.create({
        data: {
          name: item.category.name,
          image: item.category.image, // Add this if your category has an image field
        },
      });
      categories[item.category.name] = category.id;
    }
  }

  // Create products
  for (const item of data) {
    await prisma.product.create({
      data: {
        name: item.title,
        price: item.price,
        description: item.description,
        images: item.images,
        brands: item.brand,
        isStaffPick: item.isStaffPick,
        // createdAt: new Date(item.creationAt),
        // updatedAt: new Date(item.updatedAt),
        category: {
          connect: { id: categories[item.category.name] },
        },
      },
    });
  }

  console.log("Data seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
