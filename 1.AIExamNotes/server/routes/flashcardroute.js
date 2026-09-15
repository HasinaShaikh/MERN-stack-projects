import express from "express";

import {
  generateFlashcards,
} from "../controllers/flashcardController.js";

import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.post(
  "/generate",
  isAuth,
  generateFlashcards
);

export default router;