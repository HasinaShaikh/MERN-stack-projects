import StudyMaterial from "../models/studymaterialmodel.js";
import { generateNotes } from "../utils/gemini.js";
import {
  recordStudyActivity
} from "../utils/studyActivity.js";

// GENERATE FLASHCARDS USING AI
export const generateFlashcards = async (req, res) => {
  try {
    const { materialId } = req.body;

    if (!materialId) {
      return res.status(400).json({
        message: "Material ID is required",
      });
    }

    // Find material belonging to logged-in user
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
You are an AI study assistant.

Create exactly 10 flashcards from the study material below.

Rules:
- Create exactly 10 flashcards.
- Each flashcard must have a question and an answer.
- Questions should cover important concepts from the material.
- Answers should be short, clear and exam-friendly.
- Use simple language.
- Do not add unrelated information.
- Do not create multiple-choice questions.
- Return ONLY valid JSON.
- Do not use markdown.
- Do not use code blocks.

Return exactly this structure:

[
  {
    "question": "What is ...?",
    "answer": "..."
  }
]

STUDY MATERIAL:
${material.extractedText}
`;

    console.log("Generating flashcards using AI...");

    const aiResponse = await generateNotes(
      material.extractedText,
      prompt
    );

    let flashcards;

    try {
      flashcards = JSON.parse(aiResponse);
    } catch (error) {
      console.log(
        "AI flashcard JSON parsing error:",
        aiResponse
      );

      return res.status(500).json({
        message: "AI returned invalid flashcard data",
      });
    }

    // Validate AI response
    if (
      !Array.isArray(flashcards) ||
      flashcards.length !== 10
    ) {
      return res.status(500).json({
        message:
          "AI did not generate exactly 10 flashcards",
      });
    }

    for (const card of flashcards) {
      if (
        !card.question ||
        !card.answer
      ) {
        return res.status(500).json({
          message:
            "AI generated an invalid flashcard format",
        });
      }
    }

    // Save flashcards inside StudyMaterial
    material.flashcards = flashcards;

    await material.save();
    await recordStudyActivity(
  req.userId
);

    console.log(
      "Flashcards saved to MongoDB!"
    );

    return res.status(201).json({
      message: "Flashcards generated successfully",
      flashcards,
    });

  } catch (error) {
    console.log(
      "GENERATE FLASHCARDS ERROR:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to generate flashcards",
    });
  }
};