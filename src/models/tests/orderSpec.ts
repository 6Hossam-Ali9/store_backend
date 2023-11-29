// I want to do just like I did before in the productSpec.ts file

import { order, OrderServices } from "../order";
import { User, UserServices } from "../user";

let orderId: number;
let userId: number;
const wrongUserId = 120;

describe("Order model", () => {
  const orderService = new OrderServices();
  const userService = new UserServices();

  beforeAll(async () => {
    const user: User = (await userService.createUser({
      // as I have to create a user to use its id in creating order
      first_name: "John",
      last_name: "Doe",
      password: "password",
    })) as User;
    userId = user.id as number;
  });

  it("should response with an error that this user doesn't exist", async () => {
    const order: object = (await orderService.createOrder({
      status: "complete",
      user_id: wrongUserId,
    })) as object;
    expect(order).toEqual({ error: "User does not exist!" });
  });

  it("should create a new order", async () => {
    const order: order = (await orderService.createOrder({
      status: "complete",
      user_id: userId,
    })) as order;
    orderId = order.id as number;
    expect(order.status).toEqual("complete");
  });

  it("should get all orders", async () => {
    const orders: order[] = (await orderService.getAllOrders()) as order[];
    expect(orders).toContain({
      id: orderId,
      status: "complete",
      user_id: userId,
    });
  });

  it("should get an order by id", async () => {
    const order: order = (await orderService.getOrderById(orderId)) as order;
    expect(order.status).toEqual("complete");
    expect(order.user_id).toEqual(userId);
  });

  it("should delete an order", async () => {
    const order: order = (await orderService.deleteOrder(orderId)) as order;
    expect(order.status).toEqual("complete");
  });
});
