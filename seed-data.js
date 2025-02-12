// seed.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Delete all existing records (optional, for demo or reset purposes)
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});

    // Create categories
    const electronics = await prisma.category.create({
        data: { name: "Electronics" }
    });
    const clothing = await prisma.category.create({
        data: { name: "Clothing" }
    });

    // Create products
    await prisma.product.create({
        data: {
            name: "Laptop",
            price: 1000,
            category: {
                connect: { id: electronics.id }
            }
        }
    });
    await prisma.product.create({
        data: {
            name: "T-Shirt",
            price: 20,
            category: {
                connect: { id: clothing.id }
            }
        }
    });

    console.log("Data seeded successfully.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });