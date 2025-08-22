import cors from "cors";
import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";


const app: Application = express();
dotenv.config();
const PORT: number = parseInt(process.env.PORT || "3000", 10);

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.get("/", (req: Request, res: Response) => {
  res.send("api test running...");
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});