import jwt from "jsonwebtoken";

export const verifyTokens = (req, res, next) => {
  const token = req.cookies.jwt; // get JWT token from cookie
  if (!token) {
    return res.status(401).send("You are not Authenticated.");
  } else {
    // Token Verification
    jwt.verify(token, process.env.JWT_KEY, async (err, data) => {
      if (err) return res.status(403).send("Token is not valid.");
      req.userId = data.userId;
      next();
    });
  }
};
