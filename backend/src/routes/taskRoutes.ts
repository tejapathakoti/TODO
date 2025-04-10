import express, { Request, Response } from "express";
import { Task, ITask } from "../database/models";

const router = express.Router();
const baseUrl = "/lists/:listId/tasks";

/**
 * GET /lists/:listId/tasks/:taskId
 * Retrieves a specific task from a given list using the task's ID.
 * Useful for viewing details of a single task.
 */
router.get(`${baseUrl}/:taskId`, (req: Request, res: Response) => {
  Task.findOne({ _id: req.params.taskId, _listId: req.params.listId })
    .then((task: ITask | null) => {
      res.send(task);
    }).catch((e) => {
      res.status(500).send({ error: "Failed to fetch task" });
    });
});

/**
 * POST /lists/:listId/tasks
 * Creates a new task within a specific list.
 * Requires a title (and optionally a description) in the request body.
 */
router.post(`${baseUrl}`, (req: Request, res: Response) => {
  const newTask = new Task({
    title: req.body.title,
    description: req.body.description || "",
    _listId: req.params.listId,
  });

  newTask.save().then((newTaskDoc: ITask) => {
    res.send(newTaskDoc);
  }).catch((err) => {
    res.status(500).send({ error: "Failed to save task", details: err });
  });
});

/**
 * PUT /lists/:listId/tasks/:taskId
 * Updates an existing task's data (e.g., title, description, completed status).
 * Used when editing a task within a list.
 */
router.put(`${baseUrl}/:taskId`, (req: Request, res: Response) => {
  Task.findOneAndUpdate({ _id: req.params.taskId, _listId: req.params.listId }, { $set: req.body })
    .then((updatedTask: ITask | null) => {
      res.send(updatedTask);
    }).catch((e) => {
      res.status(500).send({ error: "Failed to update task" });
    });
});

/**
 * DELETE /lists/:listId/tasks/:taskId
 * Deletes a specific task from a list by its task ID.
 * Typically used to remove completed or no longer relevant tasks.
 */
router.delete(`${baseUrl}/:taskId`, (req: Request, res: Response) => {
  Task.findOneAndDelete({ _id: req.params.taskId, _listId: req.params.listId })
    .then((removedTaskDoc: ITask | null) => {
      res.send(removedTaskDoc);
    }).catch((e) => {
      res.status(500).send({ error: "Failed to delete task" });
    });
});

export default router;
