import express from "express";

import {
  getProgress,
  updateStudyActivity
} from "../controllers/progressController.js";

import isAuth from "../middleware/isAuth.js";


const router = express.Router();


router.get(
  "/",
  isAuth,
  getProgress
);


router.post(
  "/activity",
  isAuth,
  updateStudyActivity
);


export default router;