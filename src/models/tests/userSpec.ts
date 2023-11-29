import { User, UserServices } from "../user";

type loginResponse = {
  accessToken: string;
};

describe("User model", () => {
  const userService = new UserServices();
  let userId: number;
  it("should create a new user", async () => {
    const user: User = (await userService.createUser({
      first_name: "Hossam",
      last_name: "Ali",
      password: "password123",
    })) as User;
    userId = user.id as number;
    expect(user.first_name).toBe("Hossam");
    expect(user.last_name).toBe("Ali");
  });

  it("should get that the password is wrong", async () => {
    const res: object = await userService.loginUser("Hossam", "wrongpassword");
    expect(res).toEqual({ error: "Invalid password!" });
  });

  it("should login the user and give an accessToken", async () => {
    const res: loginResponse = (await userService.loginUser(
      "Hossam",
      "password123",
    )) as loginResponse;
    expect(res.accessToken).toBeTruthy();
  });

  it("should get all users", async () => {
    const res: User[] = (await userService.getAllUsers()) as User[];
    expect(res.length).toBeGreaterThan(0);
  });

  it("should get a specific user by ID", async () => {
    const res: User = (await userService.getUserById(userId)) as User;
    expect(res.first_name).toBe("Hossam");
  });

  it("should delete a user by ID", async () => {
    const res: User = (await userService.deleteUser(userId)) as User;
    expect(res.first_name).toBe("Hossam");
  });
});
