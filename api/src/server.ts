import "dotenv/config";
import express, { Request, Response } from "express";
import apiRouter from "./api-routes";
import { ENV } from "./config/env";
import cookieParser from "cookie-parser";
const app = express();

const PORT = ENV.PORT;

app.use(cookieParser());
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("WELCOME TO PROJECT DELDEV HR SYSTEM API!🚀");
});

app.use("/api", apiRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
