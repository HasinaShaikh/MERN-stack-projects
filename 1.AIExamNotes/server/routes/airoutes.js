import express from "express";
import multer from "multer";

import {
  uploadPDF,
  getMaterials,
  deleteMaterial,
  saveMaterial,
  getSavedMaterials,
  removeSavedMaterial,
  generateQuiz,
  getStats
} from "../controllers/aicontroller.js";

import isAuth from "../middleware/isAuth.js";

const router = express.Router();


// ================= MULTER =================

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only PDF and DOCX files are allowed"
        )
      );
    }
  }
});


// ================= STATS =================

router.get(
  "/stats",
  isAuth,
  getStats
);


// ================= UPLOAD PDF / DOCX =================

router.post(
  "/upload",
  isAuth,
  upload.single("pdf"),
  uploadPDF
);


// ================= LIBRARY =================

router.get(
  "/materials",
  isAuth,
  getMaterials
);

router.delete(
  "/materials/:materialId",
  isAuth,
  deleteMaterial
);


// ================= SAVED MATERIALS =================

router.post(
  "/materials/:materialId/save",
  isAuth,
  saveMaterial
);

router.get(
  "/saved-materials",
  isAuth,
  getSavedMaterials
);

router.delete(
  "/materials/:materialId/save",
  isAuth,
  removeSavedMaterial
);


// ================= QUIZ =================

router.post(
  "/materials/:materialId/quiz",
  isAuth,
  generateQuiz
);


export default router;