import jwt from "jsonwebtoken";

export const generateAuthToken = (user) => {
  const token = jwt.sign(
    { id: user._id, admin: user.admin },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );
  return token;
};
