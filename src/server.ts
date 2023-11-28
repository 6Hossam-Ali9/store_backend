import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import usersRoutes from "./handlers/users";
import productsRoutes from "./handlers/products";
import ordersRoutes from "./handlers/orders";

const app: express.Application = express();
const port: number = 3001;

app.use(bodyParser.json());
app.use(cors());

usersRoutes(app);
productsRoutes(app);
ordersRoutes(app);

app.listen(port, () => {
  console.log(`starting app on: ${port}`);
});

export default app;
