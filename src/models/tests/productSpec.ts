import request from "supertest";
import app from "../../server";
import { mockUser } from "./userSpec";

export const mockProduct = {
  name: "Test",
  price: 49.99,
  category: "Category",
};

export const getAccessToken = async () => {
  // For preparation
  await request(app).post("/signup").send(mockUser);
  const loginResponse = await request(app).post("/login").send({
    username: mockUser.first_name,
    password: mockUser.password,
  });
  return loginResponse.body.accessToken as string; // Save the accessToken
};

describe("Product Endpoints", () => {
  let accessToken: string;
  beforeAll(async () => {
    // Assign the result of the asynchronous function to the accessToken variable
    accessToken = await getAccessToken();
  });
  it("should create a new product", async () => {
    const response = await request(app)
      .post("/products")
      .send(mockProduct)
      .set("accessToken", accessToken);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(mockProduct.name);
  });

  it("should get all products", async () => {
    const response = await request(app).get("/products");
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get a specific product by ID", async () => {
    const response = await request(app).get("/products/1");
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
  });

  it("should get products by category", async () => {
    const response = await request(app)
      .get("/products/category")
      .send({ category: mockProduct.category });
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(1);
  });

  it("should delete a product by ID", async () => {
    const response = await request(app).delete("/products/1");
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
  });
});
