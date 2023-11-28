import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const { HOST, DB, USER, PASSWORD, ENV, DB_TEST } = process.env;

let client: Pool;

if (ENV === "dev") {
  client = new Pool({
    host: HOST,
    database: DB,
    user: USER,
    password: PASSWORD,
  });
} else {
  client = new Pool({
    host: HOST,
    database: DB_TEST,
    user: USER,
    password: PASSWORD,
  });
}

export default client;
