import dotenv from "dotenv";

dotenv.config();

export default {
  app: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || "development",
  },
  db: {
    uri: process.env.MONGODB_URI || "",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: "7d",
  },
  upload: {
    path: process.env.FILE_UPLOAD_PATH || "./uploads",
    maxSize: 10 * 1024 * 1024,
    allowedTypes: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ],
  },
};
