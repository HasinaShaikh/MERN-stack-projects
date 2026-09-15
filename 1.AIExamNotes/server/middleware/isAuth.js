import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authenticated"
      });
    }

    const token = authHeader.split(" ")[1];

    console.log(
      "Authorization token received:",
      token.substring(0, 20) + "..."
    );

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    );

    req.userId = decoded.userId;

    console.log("Authenticated user:", req.userId);

    next();

  } catch (error) {
    console.log("Authentication Error:", error);

    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

export default isAuth;