import express from "express";

import {
  createQuiz,
  generateQuizWithAI,
  getQuizzes,
  getQuizById,
  submitQuiz,
  deleteQuiz,
} from "../controllers/quizController.js";

import isAuth from "../middleware/isAuth.js";

const router = express.Router();

// Generate AI Quiz
router.post("/generate", isAuth, generateQuizWithAI);

// Create Quiz manually
router.post("/", isAuth, createQuiz);

// Get all quizzes
router.get("/", isAuth, getQuizzes);

// Get one quiz
router.get("/:id", isAuth, getQuizById);

// Submit quiz
router.post("/:id/submit", isAuth, submitQuiz);

// Delete quiz
router.delete("/:id", isAuth, deleteQuiz);

export default router;