import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import { doubleCsrfProtection, generateToken } from "./utils/csrf";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(doubleCsrfProtection);

app.get("/get-csrf-token", (req, res) => {
  const token = generateToken(req, res);
  res.json({ csrfToken: token });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err.code === "EBADCSRFTOKEN") {
      res.status(403).send("Invalid CSRF token");
    } else {
      next(err);
    }
  }
);

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/csrf-app", {})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
