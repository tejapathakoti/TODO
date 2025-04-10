import request from "supertest";
import express from "express";
import taskRoutes from "../routes/taskRoutes";


vi.mock("../database/models", () => {
    const findOne = vi.fn();
    const findOneAndUpdate = vi.fn();
    const findOneAndDelete = vi.fn();
    const save = vi.fn();
  
    const TaskMock = vi.fn(() => ({ save }));
  
    return {
      Task: Object.assign(TaskMock, {
        findOne,
        findOneAndUpdate,
        findOneAndDelete,
      }),
    };
  });


import { Task } from "../database/models";

const app = express();
app.use(express.json());
app.use("/", taskRoutes);

const mockTask = {
    _id: "task123",
    title: "Test Task",
    description: "Test Description",
    _listId: "list123",
  };

  
describe("Task Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /lists/:listId/tasks/:taskId", () => {
    it("should return a task", async () => {
      (Task.findOne as any).mockResolvedValue(mockTask);

      const res = await request(app).get("/lists/list123/tasks/task123");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockTask);
      expect(Task.findOne).toHaveBeenCalledWith({
        _id: "task123",
        _listId: "list123",
      });
    });

    it("should handle errors", async () => {
      (Task.findOne as any).mockRejectedValue(new Error("DB Error"));

      const res = await request(app).get("/lists/list123/tasks/task123");

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("error", "Failed to fetch task");
    });
  });

  describe("POST /lists/:listId/tasks", () => {
    it("should create a new task", async () => {
      const saveMock = vi.fn().mockResolvedValue(mockTask);
      vi.mocked(Task as any).mockImplementationOnce(function () {
        return { save: saveMock };
      });

      const res = await request(app)
        .post("/lists/list123/tasks")
        .send({ title: "Test Task", description: "Test Description" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockTask);
      expect(saveMock).toHaveBeenCalled();
    });

    it("should handle save error", async () => {
      const saveMock = vi.fn().mockRejectedValue(new Error("Save error"));
      vi.mocked(Task as any).mockImplementationOnce(function () {
        return { save: saveMock };
      });

      const res = await request(app)
        .post("/lists/list123/tasks")
        .send({ title: "Fail Task" });

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("error", "Failed to save task");
    });
  });

  describe("PUT /lists/:listId/tasks/:taskId", () => {
    it("should update a task", async () => {
      (Task.findOneAndUpdate as any).mockResolvedValue(mockTask);

      const res = await request(app)
        .put("/lists/list123/tasks/task123")
        .send({ title: "Updated Task" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockTask);
      expect(Task.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: "task123", _listId: "list123" },
        { $set: { title: "Updated Task" } }
      );
    });

    it("should handle update error", async () => {
      (Task.findOneAndUpdate as any).mockRejectedValue(new Error("Update failed"));

      const res = await request(app)
        .put("/lists/list123/tasks/task123")
        .send({ title: "Error Task" });

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("error", "Failed to update task");
    });
  });

  describe("DELETE /lists/:listId/tasks/:taskId", () => {
    it("should delete a task", async () => {
      (Task.findOneAndDelete as any).mockResolvedValue(mockTask);

      const res = await request(app).delete("/lists/list123/tasks/task123");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockTask);
      expect(Task.findOneAndDelete).toHaveBeenCalledWith({
        _id: "task123",
        _listId: "list123",
      });
    });

    it("should handle delete error", async () => {
      (Task.findOneAndDelete as any).mockRejectedValue(new Error("Delete error"));

      const res = await request(app).delete("/lists/list123/tasks/task123");

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("error", "Failed to delete task");
    });
  });
});
