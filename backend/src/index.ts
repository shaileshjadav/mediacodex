import express, { Express, Request, Response } from "express";

import * as dotenv from "dotenv";
dotenv.config();


import { init } from "./sqs-listener";
import {pool} from "./db/index";


const app: Express = express();
const port = process.env.PORT || 3000;

// Start SQS listerner
init();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express with TypeScript!");
});

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});
