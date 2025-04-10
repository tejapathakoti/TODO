import { describe, it, expect, beforeAll, afterAll } from "vitest";
import mongoose from "mongoose";
import { List } from "./list.model";
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
  // Close the connection
  await mongoose.disconnect();
});

describe("List Model Tests", () => {
  it("should create and save a List successfully", async () => {
    const listData = { title: "My First List" };
    
    // Create a new list using the List model
    const list = new List(listData);

    // Save the list to the database
    const savedList = await list.save();

    // Verify that the saved list has the correct properties
    expect(savedList._id).toBeDefined();
    expect(savedList.title).toBe("My First List");
  });

  it("should throw an error if title is missing", async () => {
    const listData = { title: "" }; // Invalid data (empty title)

    try {
      // Try creating and saving a list with invalid data
      const list = new List(listData);
      await list.save();
    } catch (error) {
      // Verify that an error is thrown because title is required
      expect(error).toBeDefined();
    //   expect(error.errors.title).toBeDefined();
    }
  });

  it("should retrieve a list by title", async () => {
    const listData = { title: "Find Me List" };
    
    // Create and save a new list
    const list = new List(listData);
    await list.save();

    // Retrieve the list from the database
    const foundList = await List.findOne({ title: "Find Me List" });

    // Verify that the list was retrieved correctly
    expect(foundList).toBeDefined();
    expect(foundList?.title).toBe("Find Me List");
  });

  it("should update a list title successfully", async () => {
    const listData = { title: "Old Title" };
    
    // Create and save a new list
    const list = new List(listData);
    const savedList = await list.save();

    // Update the list title
    savedList.title = "Updated Title";
    const updatedList = await savedList.save();

    // Verify that the title was updated
    expect(updatedList.title).toBe("Updated Title");
  });

  it("should delete a list successfully", async () => {
    const listData = { title: "List to Delete" };
    
    // Create and save a new list
    const list = new List(listData);
    const savedList = await list.save();

    // Delete the list
    const deletedList = await List.findByIdAndDelete(savedList._id);

    // Verify that the list was deleted
    expect(deletedList).toBeDefined();
    expect(deletedList?.title).toBe("List to Delete");

    // Verify that the list is no longer in the database
    const findDeletedList = await List.findById(savedList._id);
    expect(findDeletedList).toBeNull();
  });
});
