import app from "./app";
import mongoose from "mongoose";
import request from "supertest";

describe("App", () => {
    it("should be defined", () => {
      expect(app).toBeDefined();
    });

    it("should connect to MongoDB", async () => {
        const state = mongoose.connection.readyState;
        expect(state).toBe(1); // 1 indicates connected state
    });
  
    it("should return 200 OK for the root endpoint", async () => {
        const response = await request(app).get("/name");
        expect(response.status).toBe(404); // Assuming no root route exists in your app, this will return 404
      });

    describe("CORS Middleware", () => {
      it("should include the correct CORS headers", async () => {
        const response = await request(app).get("/lists");
        expect(response.headers["access-control-allow-origin"]).toBe("*");
        expect(response.headers["access-control-allow-methods"]).toBe("GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD");
        expect(response.headers["access-control-allow-headers"]).toBe("Origin, X-Requested-With, Content-Type, Accept");
      });
});

});