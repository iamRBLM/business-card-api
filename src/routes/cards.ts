import { Router } from "express";
import {
  validateBizNumber,
  validateCard,
  validateCardUpdate,
} from "../middleware/validate.ts";
import { isBuisness } from "../middleware/is-buisness.ts";
import cardService from "../services/card-service.ts";
import validateToken from "../middleware/validate-token.ts";
import { isAdmin } from "../middleware/is-admin.ts";

const router = Router();

/**
 * Router for business card endpoints (/api/v1/cards).
 */

/**
 * Create a new business card (Business users only).
 */
router.post("/", ...isBuisness, validateCard, async (req, res) => {
  const userId = req.user?._id as unknown as string;
  const cardData = req.body;

  const card = await cardService.createCard(cardData, userId);
  res.status(201).json(card);
});

/**
 * Get all business cards.
 */
router.get("/", async (req, res) => {
  const cards = await cardService.getCards();
  res.json(cards);
});

/**
 * Get all cards created by the currently logged-in user.
 */
router.get("/my-cards", validateToken, async (req, res) => {
  const userId = req.user!._id.toString();
  const myCards = await cardService.getMyCards(userId);

  res.json(myCards);
});

/**
 * Get a single business card by ID.
 */
router.get("/:id", async (req, res) => {
  const card = await cardService.getCard(req.params.id as string);
  res.json(card);
});

/**
 * Update a business card by ID (Owner only).
 */
router.put("/:id", validateToken, validateCardUpdate, async (req, res) => {
  const cardId = req.params.id as string;
  const userId = req.user!._id.toString();

  const card = await cardService.updateCard(cardId, userId, req.body);
  res.json(card);
});

/**
 * Delete a business card by ID (Owner or Admin).
 */
router.delete("/:id", validateToken, async (req, res) => {
  const cardId = req.params.id as string;
  const userId = req.user!._id.toString();
  const isAdmin = req.user?.isAdmin ?? false;

  const card = await cardService.deleteCard(cardId, userId, isAdmin);
  res.json({ message: "Card deleted successfully", card });
});

/**
 * Update card business number (Admin only).
 */
router.patch("/:id/biz-number", ...isAdmin, validateBizNumber, async (req, res, next) => {
    const card = await cardService.updateBizNumber(req.params.id as string, req.body.bizNumber);
    res.json(card);
});

/**
 * Like or unlike a business card.
 */
router.patch("/:id", validateToken, async (req, res) => {
  const cardId = req.params.id as string;
  const userId = req.user!._id.toString();

  const card = await cardService.toggleLikeCard(cardId, userId);
  res.json(card);
});

export default router;
