import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { IList, ITask, List, Task } from "./database/models";
import mongoose from "./database/mongoose";
import listRoutes from "./routes/listRoutes";
import taskRoutes from "./routes/taskRoutes";

const dbURL: string = "mongodb://127.0.0.1:27017/TodoLists";

mongoose.connect(dbURL);
const app = express();

// Use middleware to parse JSON request bodies
app.use(bodyParser.json());

// CORS Headers Middleware
app.use((req: Request, res: Response, next: Function) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Mount route handlers for lists and tasks
app.use(listRoutes);
app.use(taskRoutes);


app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

export default app;