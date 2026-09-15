import QuizModel from "../models/QuizModel.js";
import StudyMaterial from "../models/studymaterialmodel.js";
import { generateNotes } from "../utils/gemini.js";
import {
  recordStudyActivity
} from "../utils/studyActivity.js";

// CREATE QUIZ
export const createQuiz = async (req, res) => {
  try {
    const { materialId, title, questions } = req.body;

    if (
      !materialId ||
      !title ||
      !questions ||
      questions.length === 0
    ) {
      return res.status(400).json({
        message: "Quiz data is required",
      });
    }

    const material = await StudyMaterial.findOne({
      _id: materialId,
      userId: req.userId,
    });

    if (!material) {
      return res.status(404).json({
        message: "Study material not found",
      });
    }

    const quiz = await QuizModel.create({
      userId: req.userId,
      materialId,
      title,
      questions,
      totalQuestions: questions.length,
    });

    return res.status(201).json({
      message: "Quiz created successfully",
      quiz,
    });

  } catch (error) {
    console.log("CREATE QUIZ ERROR:", error);

    return res.status(500).json({
      message: "Failed to create quiz",
    });
  }
};


// GENERATE QUIZ USING AI
export const generateQuizWithAI = async (req, res) => {
  try {
    const { materialId } = req.body;

    if (!materialId) {
      return res.status(400).json({
        message: "Material ID is required",
      });
    }

    const material = await StudyMaterial.findOne({
      _id: materialId,
      userId: req.userId,
    });

    if (!material) {
      return res.status(404).json({
        message: "Study material not found",
      });
    }

    if (!material.extractedText) {
      return res.status(400).json({
        message: "Study material has no extracted text",
      });
    }

    const prompt = `
You are an AI quiz generator for students.

Create exactly 10 multiple-choice questions from the study material below.

Rules:
- Create exactly 10 questions.
- Every question must have exactly 4 options.
- Only one option must be correct.
- The correct answer must exactly match one of the four options.
- Questions must be based mainly on the provided study material.
- Do not add unrelated information.
- Use simple, exam-friendly language.
- Cover different important topics from the material.
- Return ONLY valid JSON.
- Do not use markdown.
- Do not use code blocks.

Return this exact structure:

[
  {
    "question": "Question text",
    "options": [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4"
    ],
    "correctAnswer": "Option 1"
  }
]

STUDY MATERIAL:
${material.extractedText}
`;

    console.log("Generating quiz using AI...");

    const aiResponse = await generateNotes(
      material.extractedText,
      prompt
    );

    let questions;

    try {
      questions = JSON.parse(aiResponse);
    } catch (error) {
      console.log(
        "AI quiz JSON parsing error:",
        aiResponse
      );

      return res.status(500).json({
        message: "AI returned invalid quiz data",
      });
    }

    if (
      !Array.isArray(questions) ||
      questions.length !== 10
    ) {
      return res.status(500).json({
        message: "AI did not generate exactly 10 questions",
      });
    }

    // Validate every question
    for (const question of questions) {
      if (
        !question.question ||
        !Array.isArray(question.options) ||
        question.options.length !== 4 ||
        !question.correctAnswer
      ) {
        return res.status(500).json({
          message: "AI generated an invalid question format",
        });
      }

      if (
        !question.options.includes(
          question.correctAnswer
        )
      ) {
        return res.status(500).json({
          message:
            "AI generated a correct answer that is not present in the options",
        });
      }
    }

   const quiz = await QuizModel.create({
  userId: req.userId,
  materialId: material._id,
  title: `${material.title} Quiz`,
  questions,
  totalQuestions: questions.length,
});

console.log(
  "AI quiz saved to MongoDB!"
);

console.log(
  "NEW QUIZ ID:",
  quiz._id
);

return res.status(201).json({
  message: "Quiz generated successfully",
  quiz,
});
 } catch (error) {
    console.log(
      "GENERATE QUIZ ERROR:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to generate quiz",
    });
  }
};


// GET ALL QUIZZES
export const getQuizzes = async (req, res) => {
  try {
    const quizzes = await QuizModel.find({
      userId: req.userId,
    })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      quizzes,
    });

  } catch (error) {
    console.log("GET QUIZZES ERROR:", error);

    return res.status(500).json({
      message: "Failed to get quizzes",
    });
  }
};


// GET ONE QUIZ
export const getQuizById = async (req, res) => {
  try {
    const quiz = await QuizModel.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    return res.status(200).json({
      quiz,
    });

  } catch (error) {
    console.log("GET QUIZ ERROR:", error);

    return res.status(500).json({
      message: "Failed to get quiz",
    });
  }
};


// SUBMIT QUIZ
export const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        message: "Answers are required",
      });
    }

    const quiz = await QuizModel.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    let score = 0;

    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index] || "";

      question.userAnswer = userAnswer;

      if (userAnswer === question.correctAnswer) {
        score++;
      }
    });

    quiz.score = score;
    quiz.completed = true;

    await quiz.save();

    // Record today's study activity
    await recordStudyActivity(req.userId);

    return res.status(200).json({
      message: "Quiz submitted successfully",
      score,
      totalQuestions: quiz.questions.length,
    });

  } catch (error) {
    console.log("SUBMIT QUIZ ERROR:", error);

    return res.status(500).json({
      message: error.message || "Failed to submit quiz",
    });
  }
};

// DELETE QUIZ

export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await QuizModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    console.log("DELETE QUIZ ERROR:", error);

    res.status(500).json({
      message: "Failed to delete quiz",
    });
  }
};