import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user";
import { authenticateJWT, authorizeRole } from "../middlewares/auth";

const router = express.Router();

router.get("/", authenticateJWT, authorizeRole("admin"), getAllUsers);
router.get("/:userId", authenticateJWT, authorizeRole("admin"), getUserById);
router.put("/:userId", authenticateJWT, authorizeRole("admin"), updateUser);
router.delete("/:userId", authenticateJWT, authorizeRole("admin"), deleteUser);

export default router;
