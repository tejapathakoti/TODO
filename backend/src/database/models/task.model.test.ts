import { describe, it, expect, beforeAll, afterAll } from "vitest";
import mongoose from "mongoose";
import { Task } from "./task.model"; // Replace with your Task model file path
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Start in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  
  // Get the connection URI
    const mongoUri = "mongodb://127.0.0.1:27017/MockTodo";
  
  // Connect mongoose to the in-memory database
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  // Close the connection and stop the in-memory MongoDB server
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Task Model Tests", () => {
  it("should create and save a Task successfully", async () => {
    const listId = new mongoose.Types.ObjectId(); // Generate a mock list ID
    const taskData = { title: "My First Task", _listId: listId, completed: false, description: "Task description" };
    
    // Create a new task using the Task model
    const task = new Task(taskData);

    // Save the task to the database
    const savedTask = await task.save();

    // Verify that the saved task has the correct properties
    expect(savedTask._id).toBeDefined();
    expect(savedTask.title).toBe("My First Task");
    expect(savedTask.completed).toBe(false);
    expect(savedTask._listId).toEqual(listId);
    expect(savedTask.description).toBe("Task description");
  });

  it("should throw an error if title is missing", async () => {
    const listId = new mongoose.Types.ObjectId(); // Generate a mock list ID
    const taskData = { _listId: listId, completed: false, description: "Task description" }; // Missing title

    try {
      // Try creating and saving a task with invalid data (no title)
      const task = new Task(taskData);
      await task.save();
    } catch (error: any) {
      // Verify that an error is thrown because title is required
      expect(error.errors.title).toBeDefined();
    }
  });

  it("should retrieve a task by ID", async () => {
    const listId = new mongoose.Types.ObjectId(); // Generate a mock list ID
    const taskData = { title: "Find Me Task", _listId: listId, completed: false, description: "Task description" };

    // Create and save a new task
    const task = new Task(taskData);
    await task.save();

    // Retrieve the task from the database
    const foundTask = await Task.findById(task._id);

    // Verify that the task was retrieved correctly
    expect(foundTask).toBeDefined();
    expect(foundTask?.title).toBe("Find Me Task");
    expect(foundTask?._id).toEqual(task._id);
  });

  it("should update a task successfully", async () => {
    const listId = new mongoose.Types.ObjectId(); // Generate a mock list ID
    const taskData = { title: "Old Title", _listId: listId, completed: false, description: "Old description" };

    // Create and save a new task
    const task = new Task(taskData);
    const savedTask = await task.save();

    // Update the task
    savedTask.title = "Updated Title";
    savedTask.description = "Updated description";
    const updatedTask = await savedTask.save();

    // Verify that the task was updated
    expect(updatedTask.title).toBe("Updated Title");
    expect(updatedTask.description).toBe("Updated description");
  });

  it("should delete a task successfully", async () => {
    const listId = new mongoose.Types.ObjectId(); // Generate a mock list ID
    const taskData = { title: "Task to Delete", _listId: listId, completed: false, description: "Task description" };

    // Create and save a new task
    const task = new Task(taskData);
    const savedTask = await task.save();

    // Delete the task
    const deletedTask = await Task.findByIdAndDelete(savedTask._id);

    // Verify that the task was deleted
    expect(deletedTask).toBeDefined();
    expect(deletedTask?.title).toBe("Task to Delete");

    // Verify that the task is no longer in the database
    const findDeletedTask = await Task.findById(savedTask._id);
    expect(findDeletedTask).toBeNull();
  });
});
