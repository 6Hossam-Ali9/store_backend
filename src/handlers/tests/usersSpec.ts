import request from "supertest";
import app from "../../server";

export const mockUser = {
  first_name: "Test",
  last_name: "User",
  password: "password123",
};

describe("User Endpoints", () => {
  it("should create a new user", async () => {
    const response = await request(app).post("/signup").send(mockUser);

    expect(response.status).toBe(200);
    expect(response.body.first_name).toBe(mockUser.first_name);
  });

  it("should log in and return a token", async () => {
    const response = await request(app).post("/login").send({
      username: mockUser.first_name,
      password: mockUser.password,
    });

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeTruthy();
  });

  it("should show an authentication error", async () => {
    // For Authentication testing
    const response = await request(app).get("/users");
    expect(response.body).toEqual({ error: "No accessToken provided!" });
  });

  it("should get a specific user by ID", async () => {
    const loginResponse = await request(app).post("/login").send({
      username: mockUser.first_name,
      password: mockUser.password,
    });
    const accessToken = loginResponse.body.accessToken;
    const response = await request(app)
      .get("/users/1")
      .set("accessToken", accessToken);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
  });

  it("should delete a user by ID", async () => {
    const response = await request(app).delete("/users/1");

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
  });
});
