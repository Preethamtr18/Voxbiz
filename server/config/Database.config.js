import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Check if a connection string is provided
const isUsingConnectionString = process.env.DATABASE_URL ? true : false;

// Create Sequelize instance
const sequelize = isUsingConnectionString
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, 
        },
      },
      logging: false,
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        logging: false,
        // --- ADD THIS PART ---
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
        // --------------------
      }
    );

// Function to test DB connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected successfully!");
  } catch (error) {
    console.error("❌ PostgreSQL connection failed:", error);
  }
};

// Run the test connection
testConnection();

export default sequelize;