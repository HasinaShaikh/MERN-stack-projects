import mongoose from "mongoose";

const userschema = new mongoose.Schema(
  {
    // ================= USER NAME =================

    name: {
      type: String,
      required: true
    },


    // ================= EMAIL =================

    email: {
      type: String,
      unique: true,
      required: true
    },


    // ================= PASSWORD =================

    password: {
      type: String,
      default: null
    },


    // ================= CREDITS =================

    credits: {
      type: Number,
      default: 50,
      min: 0
    },


    // ================= CREDIT STATUS =================

    isCreditAvailable: {
      type: Boolean,
      default: true
    },


    // ================= NOTES =================

    notes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Notes",
      default: []
    },


    // =================================================
    // ================= STUDY STREAK ==================
    // =================================================

    studyStreak: {
      type: Number,
      default: 0,
      min: 0
    },


    // ================= LAST STUDY DATE ==============

    lastStudyDate: {
      type: Date,
      default: null
    }

  },

  {
    timestamps: true
  }
);


const UserModel =
  mongoose.model(
    "UserModel",
    userschema
  );


export default UserModel;