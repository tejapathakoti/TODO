import request from "supertest";
import express from "express";
import listRoutes from "../routes/listRoutes";

// Mocking the database methods
vi.mock("../database/models", () => {
  const find = vi.fn();
  const findOne = vi.fn();
  const findOneAndUpdate = vi.fn();
  const findOneAndDelete = vi.fn();
  const save = vi.fn();

  const ListMock = vi.fn(() => ({ save }));
  const TaskMock = vi.fn();

  return {
    List: Object.assign(ListMock, {
      find,
      findOne,
      findOneAndUpdate,
      findOneAndDelete,
    }),
    Task: Object.assign(TaskMock, {
        find,
      }),
  };
});

import { List } from "../database/models";
import { Task } from "../database/models";

const app = express();
app.use(express.json());
app.use("/", listRoutes);

const mockList = {
  _id: "list123",
  title: "Test List",
};

const mockTasks = [
  { _id: "task123", title: "Test Task 1", description: "Test Description 1", _listId: "list123" },
  { _id: "task124", title: "Test Task 2", description: "Test Description 2", _listId: "list123" },
];

describe("List Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /lists", () => {
    it("should return a list of lists", async () => {
      (List.find as any).mockResolvedValue([mockList]);

      const res = await request(app).get("/lists");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([mockList]);
      expect(List.find).toHaveBeenCalled();
    });

    it("should handle errors", async () => {
      (List.find as any).mockRejectedValue(new Error("DB Error"));

      const res = await request(app).get("/lists");

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("error", "Failed to fetch lists");
    });
  });

  describe("GET /lists/:id", () => {
    it("should return a single list", async () => {
      (List.findOne as any).mockResolvedValue(mockList);

      const res = await request(app).get("/lists/list123");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockList);
      expect(List.findOne).toHaveBeenCalledWith({ _id: "list123" });
    });

    it("should handle errors", async () => {
      (List.findOne as any).mockRejectedValue(new Error("DB Error"));

      const res = await request(app).get("/lists/list123");

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("error", "Failed to fetch the list");
    });
  });

  describe("GET /lists/:listId/tasks", () => {
    it("should return tasks for a list", async () => {
      (Task.find as any).mockResolvedValue(mockTasks);

      const res = await request(app).get("/lists/list123/tasks");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockTasks);
      expect(Task.find).toHaveBeenCalledWith({ _listId: "list123" });
    });

    it("should handle errors", async () => {
      (Task.find as any).mockRejectedValue(new Error("DB Error"));

      const res = await request(app).get("/lists/list123/tasks");

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("error", "Failed to fetch tasks");
    });
  });

  describe("POST /lists", () => {
    it("should create a new list", async () => {
      const saveMock = vi.fn().mockResolvedValue(mockList);
      vi.mocked(List as any).mockImplementationOnce(function () {
        return { save: saveMock };
      });

      const res = await request(app).post("/lists").send({ title: "New List" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockList);
      expect(saveMock).toHaveBeenCalled();
    });

    it("should handle save error", async () => {
      const saveMock = vi.fn().mockRejectedValue(new Error("Save error"));
      vi.mocked(List as any).mockImplementationOnce(function () {
        return { save: saveMock };
      });

      const res = await request(app).post("/lists").send({ title: "Fail List" });

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("error", "Failed to save list");
    });
  });

  describe("PUT /lists/:id", () => {
    it("should update a list", async () => {
      (List.findOneAndUpdate as any).mockResolvedValue(mockList);

      const res = await request(app)
        .put("/lists/list123")
        .send({ title: "Updated List" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "List Updated Successfully");
      expect(List.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: "list123" },
        { $set: { title: "Updated List" } }
      );
    });

    it("should handle update error", async () => {
      (List.findOneAndUpdate as any).mockRejectedValue(new Error("Update failed"));

      const res = await request(app)
        .put("/lists/list123")
        .send({ title: "Error List" });

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("error", "Failed to update list");
    });
  });

  describe("DELETE /lists/:id", () => {
    it("should delete a list", async () => {
      (List.findOneAndDelete as any).mockResolvedValue(mockList);

      const res = await request(app).delete("/lists/list123");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockList);
      expect(List.findOneAndDelete).toHaveBeenCalledWith({ _id: "list123" });
    });

    it("should handle delete error", async () => {
      (List.findOneAndDelete as any).mockRejectedValue(new Error("Delete error"));

      const res = await request(app).delete("/lists/list123");

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("error", "Failed to delete list");
    });
  });
});
