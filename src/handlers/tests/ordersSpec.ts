import request from "supertest";
import app from "../../server";
import { getAccessToken } from "./productsSpec";
import { mockProduct } from "./productsSpec";
const activeCart = {
  status: "active",
  user_id: 2, // As this user remains from the product's tests
};

const mockOrder = {
  product_id: 2,
  order_id: 1,
  quantity: 5,
};

const createActiveOrder = async (token: string) => {
  const response = await request(app)
    .post("/orders")
    .set("accessToken", token)
    .send(activeCart);
  return response.body;
};

describe("Order Endpoints", () => {
  let accessToken: string;
  beforeAll(async () => {
    accessToken = await getAccessToken();
  });

  it("should create a new order", async () => {
    const response = await request(app)
      .post("/orders")
      .send(activeCart)
      .set("accessToken", accessToken);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(activeCart.status);
  });

  it("should get all orders", async () => {
    const response = await request(app).get("/orders");
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get a specific order by ID", async () => {
    const createdOrder = await createActiveOrder(accessToken);
    const response = await request(app).get(`/orders/${createdOrder.id}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdOrder.id);
  });

  it("should delete an order by ID", async () => {
    const createdOrder = await createActiveOrder(accessToken);
    const response = await request(app).delete(`/orders/${createdOrder.id}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdOrder.id);
  });

  it("should add product to user's order", async () => {
    await request(app)
      .post("/products")
      .send(mockProduct)
      .set("accessToken", accessToken); //creating a new product
    const response = await request(app)
      .post(`/orders/${1}/products`)
      .send(mockOrder); //adding this product to the cart
    expect(response.status).toBe(200);
    expect(response.body.quantity).toBe(5);
  });

  it("should get the order's details", async () => {
    await request(app).post(`/orders/${1}/products`).send(mockOrder); //adding another product to the cart so now we have 2 products in the cart
    const response = await request(app)
      .get(`/orders/${1}/products`)
      .send(mockOrder);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  it("should get all orders for a specific user", async () => {
    const response = await request(app)
      .get(`/orders/users/${activeCart.user_id}`)
      .set("accessToken", accessToken);
    expect(response.status).toBe(200);
    expect(response.body.orders.length).toBeGreaterThan(0);
  });

  it("should get all completed orders for a specific user", async () => {
    const response = await request(app)
      .get(`/orders/complete/users/${activeCart.user_id}`)
      .set("accessToken", accessToken);
    expect(response.status).toBe(200);
    expect(response.body.orders.length).toEqual(0);
  });
});
