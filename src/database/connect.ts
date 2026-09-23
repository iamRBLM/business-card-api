import env from "../config/index.ts";
import mongoose from "mongoose";
import initDB from "./init-db.ts";
import { logger } from "../logs/logger.ts";

/**
 * Connect to MongoDB and seed the database if empty.
 */
const connectDB = async (
  connectionString: string = env.DB_CONNECTION_STRING,
): Promise<void> => {
  try {
    const conn = await mongoose.connect(connectionString);

    logger.info(
      {
        host: conn.connection.host,
        database: conn.connection.name,
      },
      "[connectDB]: Connected to MongoDB successfully",
    );

    // Run database seeding
    await initDB();
  } catch (error) {
    logger.error(
      { err: error },
      "[connectDB]: Failed to connect to the database",
    );

    // Exit the application if the connection fails (except in test environment)
    if (env.NODE_ENV !== "test") {
      process.exit(1);
    }
    throw error;
  }
};

export default connectDB;
