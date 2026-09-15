import UserModel from "../models/usermodel.js";

export const recordStudyActivity = async (userId) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!user.lastStudyDate) {
    user.studyStreak = 1;
  } else {
    const lastDate = new Date(user.lastStudyDate);
    lastDate.setHours(0, 0, 0, 0);

    const difference = Math.floor(
      (today - lastDate) /
        (1000 * 60 * 60 * 24)
    );

    if (difference === 0) {
      // Already studied today
    } else if (difference === 1) {
      user.studyStreak =
        (user.studyStreak || 0) + 1;
    } else {
      user.studyStreak = 1;
    }
  }

  user.lastStudyDate = today;

  await user.save();

  return user.studyStreak;
};