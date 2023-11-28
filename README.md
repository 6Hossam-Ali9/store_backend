# Storefront Backend Project

## Getting Started

Welcome to the Storefront Backend Project! This project is a robust backend for managing store resources including users, orders, and products. It provides a RESTful API interface for seamless integration with front-end applications.

## Used Technologies

- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- bcrypt from npm for password hashing
- jasmine and supertest from npm for testing
- prettier and eslint for linting and formatting

### Models/Tables

- User: { id, first_name "this should be unique as it's used as a username in loging in", last_name, password }
- Product: { id, name, price, category }
- Order: { id, status, user_id "as a foreign key from User model" } this model act as a cart
- Order_products: { id, product_id "as a foreign key from Product model", order_id ""as a foreign key from Order model"}

### Routes and Functionality

1. User

- "http://localhost:3001/users" [GET]: this endpoint get all the users, you have to set header called "accessToken" with a valid token and to do so you can signup then login. `accessToken Required`

- "http://localhost:3001/users/:id" [GET]: this endpoint get specific user by adding required user's id in the params instead of ":id", you also need to be authenticated. `accessToken Required`

- "http://localhost:3001/signup" [POST]: this endpoint creates a new user
request body sample  
```json
{
    "first_name":"Hossam",
    "last_name": "Ali",
    "password" : "hossam123"
}

```

- "http://localhost:3001/login" [POST]: this endpoint giving back a json access token that you will need to use for authentication
request body sample  
```json
{
    "username": "Hossam",  
    "password": "hossam123"
}

```
`the first name acts as the username`

- "http://localhost:3001/users/:id" [DELETE]: this endpoint for deleting a user by id


2. Product

- "http://localhost:3001/products" [GET]: this endpoint for getting a list of all products

- "http://localhost:3001/products:id" [GET]: this endpoint for getting specific product by id

- "http://localhost:3001/products/category" [GET]: this endpoint for getting list of products by category

- "http://localhost:3001/products" [POST]: this endpoint for creating new product `accessToken Required`
request body sample
```json
{
    "name":"Egg",
    "price":10,
    "category":"Food"
}

```

- "http://localhost:3001/products/:id" [Delete]: this endpoint for deleting product by id

3. Order

- "http://localhost:3001/orders" [GET]: this endpoint for getting a list of all orders

- "http://localhost:3001/orders/:id" [Get]: this endpoint for getting a specific order by id

- "http://localhost:3001/orders" [POST]: this endpoint for creating a new order for a specific user 
request body sample:
```json
{
    "status": "complete", 
    "user_id": 1
}

```
`user id should be exist in the users table`

- "http://localhost:3001/orders/:id" [Delete]: this endpoint for deleting a specific order by id

4. Product_order

- "http://localhost:3001/orders/:id/products" [GET]: this endpoint for getting a list of products inside specific order by id in params

- "http://localhost:3001/orders/users/:id" [GET]: this endpoint for getting a list of orders in details for specific user by id

- "http://localhost:3001/orders/complete/users/4" [GET]: this endpoint is just like the previous endpoint the difference that in this endpoint only the completed orders are returned for specific user by id

- "http://localhost:3001/orders/:id/products" [POST]: this endpoint for adding products to specific order, so the order id is added in the url params and the request looks like this:

```json
{
    "product_id": 7,
    "quantity": 1
}

```
`order id should exists in the orders table`
`product_id should exists in the product table`
`if you did not specify a certain quantity it will be set to the default which is 1`


### Installation

1. Database: you will have to start by creating a new database called `store` in postgresql

2. Run ```npm i``` to download all the needed packages

3. Run ```npm i -g db-migrate db-migrate-pg``` to avoid any problems while dealing with db-migrate cli, and please use a superuser to avoid any premissions issues

4. You have to add a  `database.json` file in your ROOT directory with your configuration, but leave the database name as mine as this file used by db-migrate. this is an example: 
```json
{
  "dev": {
    "driver": "pg",
    "host": "127.0.0.1",
    "database": "store",
    "user": "developer",
    "password": "password"
  },
  "test": {
    "driver": "pg",
    "host": "127.0.0.1",
    "database": "storetest",
    "user": "developer",
    "password": "password"
  }
}
```

5. Add your `.env` file in the ROOT directory of your application it should be something like this:
```sh
HOST=localhost
PORT=5432
DB=store
DB_TEST=storetest
USER=developer 
PASSWORD=password


SECRET=importantprivate
ROUNDS=10


ENV=dev
```

6. After making sure that you have created the database `store` and configured your database.json now you can Run ```db-migrate up```

7. Now you can run any of the scripts any try the application using any tool like `postman`

### Scripts

1. ```npm run formate```: This command will format your project

2. ```npm run start```: This command will start your application so you can try it freely 

3. ```npm run watch```: This command will watch your application while trying, so changes can have an immediate reflection on the application

4. ```npm run test```: This command is actually consists of 5 parts:
    1. ```db-migrate db:create storetest```: creating a testing db called `storetest`
    2. ```set ENV=test```: changing the environment variable to `test` instead of `dev`
    3. ```db-migrate --env test up```: running the db migrations on the testing database
    4. ```jasmine-ts```: running the tests on the endpoints
    5. ```db-migrate db:drop storetest```: deleting the testing the database, so if you ran this test script many times no overlap happens

5. ```npm run tsc```: This command will build your project in `./dist` folder in the ROOT directory
