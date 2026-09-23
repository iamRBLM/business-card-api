import env from "./config/index.ts";
import express from "express";
import notFound from "./middleware/not-found.ts";
import usersRouter from "./routes/users.ts";
import cardsRouter from "./routes/cards.ts";
import connectDB from "./database/connect.ts";
import { errorHandler } from "./middleware/error-handler.ts";
import { httpLogger, logger } from "./middleware/logger.ts";
import { cors } from "./middleware/cors.ts";

const app = express();

// Log every incoming request
app.use(httpLogger);

app.use(cors);
app.use(express.json());

// Routes for users and cards
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/cards", cardsRouter);

// Handle missing pages and errors
app.use(notFound);
app.use(errorHandler);

// Connect to the database and start the server
const startServer = async () => {
  await connectDB();

  const { PORT } = env;
  app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
