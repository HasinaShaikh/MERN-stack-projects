import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

import StudyMaterial from "../models/studymaterialmodel.js";
import { generateNotes } from "../utils/gemini.js";
import {
  recordStudyActivity
} from "../utils/studyActivity.js";

// ================= UPLOAD PDF / DOCX =================

export const uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a PDF or DOCX file"
      });
    }

    const fileName = req.file.originalname;
    const lowerFileName = fileName.toLowerCase();

    const isPDF = lowerFileName.endsWith(".pdf");
    const isDOCX = lowerFileName.endsWith(".docx");

    if (!isPDF && !isDOCX) {
      return res.status(400).json({
        message: "Only PDF and DOCX files are allowed"
      });
    }

    console.log("File received:", fileName);

    const userPrompt =
      req.body.prompt ||
      "Create simple exam-friendly notes.";

    console.log("User Prompt:", userPrompt);

    let extractedText = "";

    // ================= PDF =================

    if (isPDF) {
      console.log("Processing PDF...");

      const parser = new PDFParse({
        data: req.file.buffer
      });

      const result = await parser.getText();

      await parser.destroy();

      extractedText = result.text;

      console.log(
        "PDF text extracted successfully!"
      );
    }

    // ================= DOCX =================

    if (isDOCX) {
      console.log("Processing DOCX...");

      const result =
        await mammoth.extractRawText({
          buffer: req.file.buffer
        });

      extractedText = result.value;

      console.log(
        "DOCX text extracted successfully!"
      );
    }

    if (!extractedText.trim()) {
      return res.status(400).json({
        message:
          "Unable to extract text from the uploaded file"
      });
    }

    // ================= AI =================

    console.log(
      "Sending extracted text to Gemini..."
    );

    const aiResponse = await generateNotes(
      extractedText,
      userPrompt
    );

    console.log(
      "AI response generated successfully!"
    );

    // ================= SAVE MATERIAL =================

    const title = fileName
      .replace(/\.pdf$/i, "")
      .replace(/\.docx$/i, "");

    const studyMaterial = new StudyMaterial({
      userId: req.userId,

      title: title,

      fileName: fileName,

      pdfData: req.file.buffer,

      extractedText: extractedText,

      prompt: userPrompt,

      notes: {
        response: aiResponse
      },

      isSaved: false
    });

   await studyMaterial.save();

await recordStudyActivity(req.userId);

console.log(
  "File and AI response saved to MongoDB!"
);
    return res.status(200).json({
      message:
        "AI response generated successfully",

      materialId:
        studyMaterial._id,

      fileName:
        studyMaterial.fileName,

      prompt:
        userPrompt,

      response:
        aiResponse
    });

  } catch (error) {
    console.log(
      "File Processing Error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Unable to generate AI response"
    });
  }
};


// ================= GET ALL MATERIALS =================

export const getMaterials = async (req, res) => {
  try {
    const materials =
      await StudyMaterial.find({
        userId: req.userId
      })
        .select(
          "fileName title notes createdAt updatedAt quiz flashcards"
        )
        .sort({
          createdAt: -1
        });

    return res.status(200).json({
      materials
    });

  } catch (error) {
    console.log(
      "Get Materials Error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Unable to load materials"
    });
  }
};


// ================= SAVE MATERIAL =================

export const saveMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;

    const material =
      await StudyMaterial.findOne({
        _id: materialId,
        userId: req.userId
      });

    if (!material) {
      return res.status(404).json({
        message: "Study material not found"
      });
    }

    material.isSaved = true;

    await material.save();

    return res.status(200).json({
      message:
        "Material saved successfully",

      materialId:
        material._id
    });

  } catch (error) {
    console.log(
      "Save Material Error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Unable to save material"
    });
  }
};


// ================= GET SAVED MATERIALS =================

export const getSavedMaterials = async (
  req,
  res
) => {
  try {
    const materials =
      await StudyMaterial.find({
        userId: req.userId,
        isSaved: true
      })
        .select(
          "fileName title prompt notes createdAt updatedAt isSaved"
        )
        .sort({
          updatedAt: -1
        });

    return res.status(200).json({
      materials
    });

  } catch (error) {
    console.log(
      "Get Saved Materials Error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Unable to load saved materials"
    });
  }
};


// ================= REMOVE FROM SAVED =================

export const removeSavedMaterial = async (
  req,
  res
) => {
  try {
    const { materialId } = req.params;

    const material =
      await StudyMaterial.findOne({
        _id: materialId,
        userId: req.userId
      });

    if (!material) {
      return res.status(404).json({
        message:
          "Study material not found"
      });
    }

    material.isSaved = false;

    await material.save();

    return res.status(200).json({
      message:
        "Material removed from saved materials"
    });

  } catch (error) {
    console.log(
      "Remove Saved Material Error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Unable to remove saved material"
    });
  }
};


// ================= DELETE MATERIAL =================

export const deleteMaterial = async (
  req,
  res
) => {
  try {
    const { materialId } = req.params;

    const material =
      await StudyMaterial.findOneAndDelete({
        _id: materialId,
        userId: req.userId
      });

    if (!material) {
      return res.status(404).json({
        message:
          "Study material not found"
      });
    }

    return res.status(200).json({
      message:
        "Material deleted successfully"
    });

  } catch (error) {
    console.log(
      "Delete Material Error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Unable to delete material"
    });
  }
};


// ================= GENERATE QUIZ =================

export const generateQuiz = async (
  req,
  res
) => {
  try {
    const { materialId } = req.params;

    const material =
      await StudyMaterial.findOne({
        _id: materialId,
        userId: req.userId
      });

    if (!material) {
      return res.status(404).json({
        message:
          "Study material not found"
      });
    }

    const prompt = `
You are an AI exam quiz generator.

Create exactly 10 multiple-choice questions from the study material below.

Rules:

- Each question must have exactly 4 options.
- Only one option must be correct.
- Questions must be based mainly on the provided study material.
- Keep questions exam-friendly.
- Use simple language.
- Do not add information unrelated to the study material.
- Return ONLY valid JSON.
- Do not use markdown or code blocks.

Required JSON format:

[
  {
    "question": "Question text",
    "options": [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4"
    ],
    "answer": "Option 1"
  }
]

STUDY MATERIAL:

${material.extractedText}
`;

    console.log(
      "Generating AI quiz..."
    );

    const aiResponse =
      await generateNotes(
        material.extractedText,
        prompt
      );

    let quiz;

    try {
      quiz = JSON.parse(aiResponse);
    } catch (error) {
      console.log(
        "Quiz JSON parsing failed"
      );

      return res.status(500).json({
        message:
          "AI returned an invalid quiz format"
      });
    }

    if (!Array.isArray(quiz)) {
      return res.status(500).json({
        message:
          "Invalid quiz format"
      });
    }

    material.quiz = quiz;

    await material.save();

    console.log(
      "Quiz saved to MongoDB!"
    );

    return res.status(200).json({
      message:
        "Quiz generated successfully",

      materialId:
        material._id,

      quiz
    });

  } catch (error) {
    console.log(
      "Quiz Generation Error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Unable to generate quiz"
    });
  }
};

// =====================================================
// GET DASHBOARD STATS
// =====================================================

export const getStats = async (req, res) => {
  try {

    const materials =
      await StudyMaterial.find({
        userId: req.userId
      });


    // Total uploaded study materials
    const pdfCount =
      materials.length;


    // Materials that contain an AI response
    const notesCount =
      materials.filter(
        (material) =>
          material.notes?.response &&
          material.notes.response.trim() !== ""
      ).length;


    res.status(200).json({

      pdfCount,

      notesCount

    });


  } catch (error) {

    console.error(
      "GET STATS ERROR:",
      error
    );

    res.status(500).json({

      message:
        "Unable to fetch dashboard stats"

    });

  }
};