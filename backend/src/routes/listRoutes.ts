import express, { Request, Response } from "express";
import { List, IList, Task, ITask } from "../database/models";

const router = express.Router();
const baseUrl = "/lists";

/**
 * GET /lists
 * Retrieves all todo lists from the database.
 * Useful for displaying all available lists to the user.
 */
router.get(`${baseUrl}`, (req: Request, res: Response) => {
  List.find({}).then((lists: IList[]) => {
    res.send(lists);
  }).catch((e) => {
    console.log("error:", e);
    res.status(500).send({ error: "Failed to fetch lists" });
  });
});

/**
 * GET /lists/:id
 * Fetches a single list based on its unique ID.
 * Useful for viewing or editing a specific list.
 */
router.get(`${baseUrl}/:id`, (req: Request, res: Response) => {
  List.findOne({ _id: req.params.id }).then((list: IList | null) => {
    res.send(list);
  }).catch((e) => {
    res.status(500).send({ error: "Failed to fetch the list" });
  });
});


/**
 * GET /lists/:listId/tasks
 * Returns all tasks associated with a particular list.
 * Enables viewing the tasks of a specific list.
 */
router.get(`${baseUrl}/:listId/tasks`, (req: Request, res: Response) => {
  Task.find({ _listId: req.params.listId }).then((tasks: ITask[]) => {
    res.send(tasks);
  }).catch((e) => {
    res.status(500).send({ error: "Failed to fetch tasks" });
  });
});

/**
 * POST /lists
 * Creates a new list with the provided title.
 * Used when a user wants to start a new todo list.
 */
router.post(`${baseUrl}`, (req: Request, res: Response) => {
  const title: string = req.body.title;
  const newList = new List({ title });

  newList.save().then((listDoc: IList) => {
    res.send(listDoc);
  }).catch((err) => {
    res.status(500).send({ error: "Failed to save list", details: err });
  });
});

/**
 * PUT /lists/:id
 * Updates an existing list by its ID using the request body data.
 * Typically used to rename or modify list properties.
 */
router.put(`${baseUrl}/:id`, (req: Request, res: Response) => {
  List.findOneAndUpdate({ _id: req.params.id }, { $set: req.body })
    .then(() => {
      res.send({ message: "List Updated Successfully" });
    })
    .catch((e) => {
      res.status(500).send({ error: "Failed to update list" });
    });
});

/**
 * DELETE /lists/:id
 * Deletes a list from the database using its ID.
 * Useful for removing lists that are no longer needed.
 */
router.delete(`${baseUrl}/:id`, (req: Request, res: Response) => {
  List.findOneAndDelete({ _id: req.params.id }).then((removedList: IList | null) => {
    res.send(removedList);
  }).catch((e) => {
    res.status(500).send({ error: "Failed to delete list" });
  });
});

export default router;
