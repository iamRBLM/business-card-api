import { type Card as CardRequest } from "../validations/card.ts";
import { CardModel } from "../database/models.ts";
import { NotFoundError } from "../error/custom-error.ts";
import { logger } from "../logs/logger.ts";

const cardService = {
  /**
   * Update existing card details while protecting system and ownership fields.
   */
  updateCard: async (
    id: string,
    userId: string,
    cardData: Partial<CardRequest>,
  ) => {
    // Prevent changing the business number, card ownership, or card ID
    const {
      bizNumber,
      userId: _u1,
      user_id: _u2,
      _id,
      ...safeCardData
    } = cardData as any;

    const updatedCard = await CardModel.findOneAndUpdate(
      { _id: id, $or: [{ userId }, { user_id: userId }] },
      safeCardData,
      { new: true, runValidators: true },
    );

    if (!updatedCard) {
      logger.warn(
        { cardId: id, userId },
        "[updateCard]: Card not found or unauthorized",
      );
      throw new NotFoundError("Card not found or access denied");
    }

    logger.info({ cardId: id }, "[updateCard]: Card updated successfully");
    return updatedCard;
  },

  /**
   * Delete a card. Admins can delete any card, while regular users can only delete their own cards.
   */
  deleteCard: async (
    cardId: string,
    userId?: string,
    isAdmin: boolean = false,
  ) => {
    // Admin deletes by ID only; regular user deletes only if they own the card
    const filter = isAdmin
      ? { _id: cardId }
      : { _id: cardId, $or: [{ userId }, { user_id: userId }] };

    const deletedCard = await CardModel.findOneAndDelete(filter);

    if (!deletedCard) {
      logger.warn(
        { cardId, userId, isAdmin },
        "[deleteCard]: Card not found or unauthorized",
      );
      throw new NotFoundError("Card not found or access denied");
    }

    logger.info({ cardId }, "[deleteCard]: Deleted card successfully");
    return deletedCard;
  },

  /**
   * Toggle a like on a card (adds or removes the user ID from the likes array).
   */
  toggleLikeCard: async (cardId: string, userId: string) => {
    const card = await CardModel.findById(cardId);

    if (!card) {
      logger.warn({ cardId }, "[toggleLikeCard]: Card not found");
      throw new NotFoundError("Card not found");
    }

    const likeIndex = card.likes.findIndex((id) => id.toString() === userId);

    if (likeIndex === -1) {
      card.likes.push(userId as any);
      logger.info(
        { cardId, userId },
        "[toggleLikeCard]: Card liked successfully",
      );
    } else {
      card.likes.splice(likeIndex, 1);
      logger.info(
        { cardId, userId },
        "[toggleLikeCard]: Card unliked successfully",
      );
    }

    await card.save();
    return card;
  },

  /**
   * Get all business cards from the database.
   */
  getCards: async () => {
    const cards = await CardModel.find();
    logger.info({ count: cards.length }, "[getCards]: Retrieved all cards");
    return cards;
  },

  /**
   * Get a single card by its ID.
   */
  getCard: async (cardId: string) => {
    const card = await CardModel.findById(cardId);
    if (!card) {
      logger.warn({ cardId }, "[getCard]: No such card found");
      throw new NotFoundError("No such card found");
    }
    logger.info({ cardId }, "[getCard]: Retrieved card successfully");
    return card;
  },

  /**
   * Get all cards created by a specific user.
   */
  getMyCards: async (userId: string) => {
    const cards = await CardModel.find({
      $or: [{ userId }, { user_id: userId }],
    });
    logger.info(
      { userId, count: cards.length },
      "[getMyCards]: Retrieved cards for user",
    );
    return cards;
  },

  /**
   * Create a new card and generate a unique 7-digit business number.
   */
  createCard: async (cardData: CardRequest, userId: string) => {
    const card = new CardModel(cardData);

    (card as any).userId = userId;
    (card as any).user_id = userId;

    // Generate a unique 7-digit business number (between 1000000 and 9999999)
    while (true) {
      const randomBizNumber = Math.floor(1_000_000 + Math.random() * 9_000_000);
      const exists = await CardModel.findOne({ bizNumber: randomBizNumber });

      if (!exists) {
        card.bizNumber = randomBizNumber;
        break;
      }
    }

    const savedCard = await card.save();
    logger.info(
      { cardId: savedCard._id, bizNumber: savedCard.bizNumber },
      "[createCard]: Created card successfully",
    );
    return savedCard;
  },
};

export default cardService;
