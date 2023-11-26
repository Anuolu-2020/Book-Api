# Book-Api
An api server built with Nodejs. No framework used. Book api is an api for managing a bookstore 

## Api Features
- Create users for the books.
  ```
  POST http://localhost:3000/users
  ```
  Request body.
  e.g
  
  ```
  {
  "name": "Anonymous Anon",
  "email": "anony234@gmail.com",
  "password": "mousanon"
  }
  ```
- Get all users using the books
  ```
  GET http://localhost:3000/users
  ```
- Create books
  ```
  POST http://localhost:3000/books
  ```
- Update books
  ```
  PUT http://localhost:3000/books
  ```
- Loan out books
  ```
  POST http://localhost:3000/books/loan
  ```
- Return loaned books
  ```
  POST http://localhost:3000/books/returnloan
  ```
- Built in authentication for books route
- Api key needed to use book routes (can be found in .env file)

