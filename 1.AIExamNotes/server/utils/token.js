import jwt from "jsonwebtoken";

export const getToken = (userId) => {
  if (!process.env.JWT_SECRET_KEY) {
    console.log("JWT_SECRET_KEY is missing!");
    throw new Error("JWT_SECRET_KEY is not configured");
  }

  return jwt.sign(
    { userId },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
  
};
// console.log(
//   "JWT SECRET EXISTS:",
//   !!process.env.JWT_SECRET_KEY
// );