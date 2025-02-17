# Store Backend

This is the backend for a store application, using:

- **Fastify** for the web server
- **Prisma** for database ORM
- **Route Folder Structure** for better organization

## Setup

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```
   sh
   git clone https://github.com/drestwn/store-backend.git
   cd store-backend
   ```
2. **Install dependencies**
   ```
   npm install
   # or
   yarn install
   ```
3. **Setup Environment Variables**
   ```
   Create a .env file in the root directory with the following (replace with your actual values):
   DATABASE_URL=postgresql://user:password@localhost:5432/dbname
   ```
4. **Initialize Prisma**
   ```
   npx prisma migrate dev --name init
   ```
5. **Running the Application**
   ```
   npm start
   # or
   yarn start
   ```

**Project Structure**
server.js: Main server file using Fastify
/routes: Contains all API routes
category.js: Routes for category operations
product.js: Routes for product operations
prisma/: Prisma schema and migration files
package.json: Project dependencies and scripts

**API Endpoints**
   Category
GET /categories: List all categories
GET /categories/:id: Get a specific category
POST /categories: Create a new category

   Product
GET /products: List all products
POST /products: Create a new product

   User
GET /user: List all users
GET /user/:id: Get spesific user
POST /user: create new user profile
   

This `README.md` provides a basic overview, setup instructions, and information about the project structure. Remember to update the repository URL, add actual commands for testing once you implement them, and include contribution guidelines and a license file if you decide to add those.
