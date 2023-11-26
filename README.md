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
  Request body.
  e.g
  ```
   {
    "name": "Messi Glory",
    "Author": "La Miasia",
    "year": 2017
   }
  ```
- Update books
  ```
  PUT http://localhost:3000/books/id
  ```
  Request Body
  e.g provide an id in the route parameter
  ```
  {
   "author": "Mike Trenor",
   "year": 2018
  }
  ```
- Loan out books
  ```
  POST http://localhost:3000/books/loan
  ```
  Provide id of book to be loaned in request body e.g
  ```
  {
   "id": 7
  }
  ```
- Return loaned books
  ```
  POST http://localhost:3000/books/returnloan
  ```
  Provide id of loaned book to be returned in request body e.g
  ```
  {
   "id": 5
  }
  ```
- Built in authentication for books route
- Api key needed to use book routes (can be found in .env file)

