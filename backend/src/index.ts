import express, { Express, Request, Response } from "express";
import cors from "cors";

import * as dotenv from "dotenv";
dotenv.config();

import { init } from "./worker/sqs-listener";
import { pool } from "./config/db";
import router from "./api/routes";
import errorHandlerMiddleware from "./api/middleware/errorHandler";
import {clerkMiddleware} from "@clerk/express";
import {clerkConfig} from "./config/clerk";

const app: Express = express();
const port = process.env.PORT || 3000;


if (process.env.ENVIRONMENT === "dev") {
  app.use(cors());
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/health", (req: Request, res: Response) => {
  res.send("Hello from Express with TypeScript!");
});

// Clerk middleware
app.use(clerkMiddleware(clerkConfig));

app.use("/api", router);

// error handler middleware
app.use(errorHandlerMiddleware);

// Start SQS listerner
init();

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});
