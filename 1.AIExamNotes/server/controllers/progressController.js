import StudyMaterial from "../models/studymaterialmodel.js";

import QuizModel from "../models/QuizModel.js";

import UserModel from "../models/usermodel.js";

import {
  recordStudyActivity
} from "../utils/studyActivity.js";


// =====================================================
// UPDATE STUDY ACTIVITY
// =====================================================

export const updateStudyActivity = async (
  req,
  res
) => {

  try {

    const studyStreak =
      await recordStudyActivity(
        req.userId
      );


    res.status(200).json({

      message:
        "Study activity updated",

      studyStreak

    });


  } catch (error) {

    console.log(
      "UPDATE STUDY ACTIVITY ERROR:",
      error
    );


    res.status(500).json({

      message:
        "Failed to update study activity"

    });

  }

};


// =====================================================
// GET USER PROGRESS
// =====================================================

export const getProgress = async (
  req,
  res
) => {

  try {

    const userId =
      req.userId;


    const user =
      await UserModel.findById(
        userId
      );


    const materials =
      await StudyMaterial.find({
        userId: userId
      });


    const quizzes =
      await QuizModel.find({
        userId: userId
      });


    // ================= MATERIALS =================

    const totalMaterials =
      materials.length;


    // ================= FLASHCARDS =================

    const flashcardMaterials =
      materials.filter(
        (material) =>
          Array.isArray(
            material.flashcards
          ) &&
          material.flashcards.length > 0
      );


    const totalFlashcardSets =
      flashcardMaterials.length;


    // ================= QUIZZES =================

    const totalQuizzes =
      quizzes.length;


    const completedQuizzes =
      quizzes.filter(
        (quiz) =>
          quiz.completed === true
      ).length;


    // ================= SCORE =================

    let totalScore = 0;

    let totalQuestions = 0;


    quizzes.forEach(
      (quiz) => {

        if (quiz.completed) {

          totalScore +=
            quiz.score || 0;

          totalQuestions +=
            quiz.totalQuestions ||
            quiz.questions?.length ||
            0;

        }

      }
    );


    let averageScore = 0;


    if (totalQuestions > 0) {

      averageScore =
        Math.round(
          (totalScore /
            totalQuestions) *
            100
        );

    }


    // ================= RESPONSE =================

    res.status(200).json({

      totalMaterials,

      totalFlashcardSets,

      totalQuizzes,

      completedQuizzes,

      averageScore,

      studyStreak:
        user?.studyStreak || 0

    });


  } catch (error) {

    console.log(
      "GET PROGRESS ERROR:",
      error
    );


    res.status(500).json({

      message:
        "Failed to load progress"

    });

  }

};