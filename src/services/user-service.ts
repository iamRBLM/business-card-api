import { type User as UserRequest } from "../validations/user.ts";
import { UserModel } from "../database/models.ts";
import { HttpError, NotFoundError } from "../error/custom-error.ts";
import authService from "./auth-service.ts";
import { logger } from "../logs/logger.ts";

const userService = {
  /**
   * Register a new user and hash their password before saving.
   */
  createUser: async (userData: UserRequest) => {
    const userExist = await UserModel.findByEmail(userData.email);
    if (userExist) {
      logger.warn(
        { email: userData.email },
        "[createUser]: The email is already taken",
      );
      throw new HttpError("The email is already taken", 400);
    }

    const user = new UserModel(userData);
    await user.setPassword(userData.password);

    const { password, ...userWithoutPassword } = (await user.save()).toObject();
    logger.info(
      { userId: user._id },
      "[createUser]: Created user successfully without password",
    );
    return userWithoutPassword;
  },

  /**
   * Get all users, without showing their passwords.
   */
  getUsers: async () => {
    const users = await UserModel.find({}, { password: 0 });
    logger.info({ count: users.length }, "[getUsers]: Returned all users");
    return users;
  },

  /**
   * Get a single user by their ID, without showing their password.
   */
  getUser: async (id: string) => {
    const user = await UserModel.findById(id).select("-password");
    if (!user) {
      logger.warn({ userId: id }, "[getUser]: No such user found");
      throw new NotFoundError("No such user found");
    }
    logger.info({ userId: id }, "[getUser]: Returned user successfully");
    return user;
  },

  /**
   * Delete a user by their ID.
   */
  deleteUser: async (id: string) => {
    const user = await UserModel.findByIdAndDelete(id).select("-password");
    if (!user) {
      logger.warn({ userId: id }, "[deleteUser]: No such user found");
      throw new NotFoundError("No such user found");
    }
    logger.info({ userId: id }, "[deleteUser]: Deleted user successfully");
    return user;
  },

  /**
   * Update user details by ID, preventing password and admin status changes.
   */
  updateUser: async (id: string, userData: Partial<UserRequest>) => {
    const sanitizedData = { ...userData };
    delete sanitizedData.password;
    delete (sanitizedData as any).isAdmin;

    const user = await UserModel.findByIdAndUpdate(id, sanitizedData, {
      new: true,
    }).select("-password");

    if (!user) {
      logger.warn({ userId: id }, "[updateUser]: No such user found");
      throw new NotFoundError("No such user found");
    }
    logger.info({ userId: id }, "[updateUser]: Updated user successfully");
    return user;
  },

  /**
   * Check user credentials and return a signed JWT token if valid.
   */
  login: async (email: string, password: string) => {
    const user = await UserModel.findOne(
      { email },
      { password: 1, email: 1, isAdmin: 1, isBusiness: 1 },
    );

    if (!user) {
      logger.warn({ email }, "[login]: Login failed - user not found");
      throw new HttpError("Invalid email or password", 400);
    }

    const isPasswordValid = await authService.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      logger.warn(
        { userId: user._id },
        "[login]: Login failed - invalid password",
      );
      throw new HttpError("Invalid email or password", 400);
    }

    const token = await authService.generateJWT({
      _id: user._id.toString(),
      isBusiness: user.isBusiness ?? false,
      isAdmin: user.isAdmin ?? false,
    } as any);

    logger.info({ userId: user._id }, "[login]: User logged in successfully");
    return token;
  },

  /**
   * Switch the isBusiness status (true/false) for a user.
   */
  toggleBusinessStatus: async (userId: string) => {
    const user = await UserModel.findById(userId);

    if (!user) {
      logger.warn({ userId }, "[toggleBusinessStatus]: User not found");
      throw new NotFoundError("User not found");
    }

    user.isBusiness = !user.isBusiness;
    await user.save();

    logger.info(
      { userId, isBusiness: user.isBusiness },
      "[toggleBusinessStatus]: Updated business status successfully",
    );

    const userResponse = user.toObject();
    delete (userResponse as any).password;

    return userResponse;
  },
};

export default userService;
