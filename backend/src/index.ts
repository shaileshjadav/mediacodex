import express, { Express, Request, Response } from "express";

import * as dotenv from "dotenv";

import { init } from "./sqs-listener";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
console.log("process,env", process.env)

// Start SQS listerner
init();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express with TypeScript!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
