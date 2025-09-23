import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Application, ErrorRequestHandler, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { connDB } from "./config/db.js";
import apiRoutes from "./routes/index.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app: Application = express();
const PORT: number = parseInt(process.env.PORT || "3000", 10);

const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use("/uploads", express.static(uploadsPath));

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });

});

app.use("/api", apiRoutes);


const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
};

app.use(errorHandler);

const startServer = async () => {
  await connDB();
  app.listen(PORT, () => {
    const backendURL = process.env.BACKEND_URL || `http://localhost:${PORT}`;
    console.log(` Server is running on: ${backendURL}`);
  });
}

startServer();
