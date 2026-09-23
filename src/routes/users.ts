import { Router } from "express";
import userService from "../services/user-service.ts";
import {
  validateLogin,
  validateUser,
  validateUserUpdate,
} from "../middleware/validate.ts";
import { isAdmin } from "../middleware/is-admin.ts";
import { isOwnerOrAdmin } from "../middleware/is-owner-admin.ts";
import { isOwner } from "../middleware/is-owner.ts";

const router = Router();

/**
 * Login user and return a JWT token.
 */
router.post("/login", validateLogin, async (req, res) => {
  const token = await userService.login(req.body.email, req.body.password);
  res.json({ message: "Logged in!", token });
});

/**
 * Register a new user.
 */
router.post("/", validateUser, async (req, res) => {
  const userResponse = await userService.createUser(req.body);
  res.status(201).json({ msg: "User Saved", user: userResponse });
});

/**
 * Get all users (Admin only).
 */
router.get("/", ...isAdmin, async (req, res) => {
  const users = await userService.getUsers();
  res.json({ users });
});

/**
 * Get a single user by ID (Owner or Admin).
 */
router.get("/:id", ...isOwnerOrAdmin, async (req, res) => {
  const user = await userService.getUser(req.params.id as string);
  res.json({ user });
});

/**
 * Update user details by ID (Owner only).
 */
router.put("/:id", ...isOwner, validateUserUpdate, async (req, res) => {
  const user = await userService.updateUser(req.params.id as string, req.body);
  res.json({ user });
});

/**
 * Delete a user by ID (Owner or Admin).
 */
router.delete("/:id", ...isOwnerOrAdmin, async (req, res) => {
  const user = await userService.deleteUser(req.params.id as string);
  res.json({ user });
});

/**
 * Toggle the isBusiness status of a user (Owner only).
 */
router.patch("/:id", ...isOwner, async (req, res) => {
  const updatedUser = await userService.toggleBusinessStatus(
    req.params.id as string,
  );
  res.json({ user: updatedUser });
});

export default router;
