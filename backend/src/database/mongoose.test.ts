import mongoose from "mongoose";

describe("MongoDB Connection", () => {
  
    beforeAll(async () => {
      const dbURL = "mongodb://127.0.0.1:27017/TodoLists";
      const connection = await mongoose.connect(dbURL);

    });
  
    afterAll(async () => {
      await mongoose.connection.close();
    });
  
    it("should connect to Mongoose DataBase", async () => {
      const state = mongoose.connection.readyState;
      expect(state).toBe(1);
    });

  afterAll(() => {
    mongoose.connection.close();
  });
});
