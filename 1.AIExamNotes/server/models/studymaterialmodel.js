import mongoose from "mongoose";

const studyMaterialSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true
    },

    fileName: {
      type: String,
      required: true
    },

    pdfData: {
      type: Buffer,
      required: true
    },

    extractedText: {
      type: String,
      required: true
    },

    prompt: {
      type: String,
      default: ""
    },

    isSaved: {
      type: Boolean,
      default: false
    },

    notes: {
      response: {
        type: String,
        default: ""
      }
    },

    quiz: {
      type: Array,
      default: []
    },

    flashcards: {
      type: Array,
      default: []
    }
  },
  {
    timestamps: true
  }
);

const StudyMaterial = mongoose.model(
  "StudyMaterial",
  studyMaterialSchema
);

export default StudyMaterial;