import { logger } from "../middleware/logger.ts";
import authService from "../services/auth-service.ts";
import { InitialUsers } from "./initial-users.ts";
import { InitialCards } from "./initial-cards.ts";
import { UserModel, CardModel } from "./models.ts";

const initDB = async () => {
  try {
    const usersCount = await UserModel.countDocuments();
    if (usersCount > 0) return;

    logger.info("[initDB]: Seeding initial database records...");

    // 1. Create initial users with hashed passwords
    let businessUserId = "";

    for (const userData of InitialUsers) {
      const hashedPassword = await authService.hashPassword(userData.password);
      const user = await new UserModel({
        ...userData,
        password: hashedPassword,
      }).save();

      if (user.isBusiness && !businessUserId) {
        businessUserId = user._id.toString();
      }
    }

    // 2. Create initial business cards linked to the business user
    let createdCardsCount = 0;
    if (businessUserId) {
      for (let i = 0; i < InitialCards.length; i++) {
        await new CardModel({
          ...InitialCards[i],
          userId: businessUserId,
          bizNumber: 1000001 + i,
        }).save();
        createdCardsCount++;
      }
    }

    logger.info(
      { usersCount: InitialUsers.length, cardsCount: createdCardsCount },
      "[initDB]: Database seeding completed successfully",
    );
  } catch (error) {
    logger.error({ err: error }, "[initDB]: Database seeding failed");
    throw error; // Throw the error so the server startup knows the initialization failed
  }
};

export default initDB;
