const http = require("http");
const path = require("path");
const fs = require("fs");

const PORT = 3000;

const usersDB = path.join(__dirname, "DB", "users.json");

const bookDB = path.join(__dirname, "DB", "books.json");

const loanedbookDB = path.join(__dirname, "DB", "loanedBooks.json");

function requestHandler(req, res) {
  const controller = new requestController(req, res);

  res.setHeader("Content-Type", "application/json");

  if (req.url === "/users" && req.method === "GET") {
    controller.getAllUsers();
  } else if (req.url === "/users" && req.method === "POST") {
    controller.createUser();
  } else if (req.url === "/books" && req.method === "POST") {
    controller.createBook();
  } else if (req.url.startsWith("/books") && req.method === "DELETE") {
    controller.deleteBook();
  } else if (req.url === "/books/loan" && req.method === "POST") {
    controller.loanOut();
  } else if (req.url === "/books/returnloan" && req.method === "POST") {
    controller.returnLoan();
  } else if (req.url.startsWith("/books") && req.method === "PUT") {
    controller.updateBook();
  }
}

// function authenticateUser(req, res) {
//   return new Promise((resolve, reject) => {});
// }

class requestController {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  //GET TOTAL USERS
  getAllUsers() {
    fs.readFile(usersDB, "utf-8", (err, data) => {
      if (err) {
        console.log("An Error Ocurred");
        this.res.writeHead(500);
        this.res.end(JSON.stringify("Error occured while reading db"));
      }

      this.res.statusCode = 200;
      this.res.end(data);
    });
  }

  //LOGIN AS A USER
  createUser() {
    const body = [];

    this.req.on("data", (chunk) => {
      body.push(chunk);
    });

    this.req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();

      if (!parsedBody) {
        this.res.writeHead(400);
        this.res.end("No data received");
        return;
      }

      const newUser = JSON.parse(parsedBody);

      fs.readFile(usersDB, "utf-8", (err, data) => {
        if (err) {
          console.log(err);
          this.res.writeHead(400);
          this.res.end("An error occured");
        }

        const users = JSON.parse(data);

        const lastUserIndex = users.length - 1;

        const lastUser = users[lastUserIndex];

        if (lastUserIndex == -1) {
          newUser.id = 1;
        } else {
          newUser.id = lastUser.id + 1;
        }

        const allUsers = [...users, newUser];

        fs.writeFile(usersDB, JSON.stringify(allUsers), (err) => {
          if (err) {
            console.log(err);
            this.res.writeHead(400);
            this.res.end("An error occured");
          }

          this.res.writeHead(201);
          this.res.end(JSON.stringify(allUsers));
        });
      });
    });
  }

  //ADD A BOOK TO THE BOOKSTORE
  createBook() {
    const body = [];

    this.req.on("data", (chunk) => {
      body.push(chunk);
    });

    this.req.on("end", () => {
      const reqBody = Buffer.concat(body).toString();

      const newBook = JSON.parse(reqBody);

      if (!reqBody) {
        this.res.writeHead(400);
        this.res.end("No data received");
        return;
      }

      fs.readFile(bookDB, "utf-8", (err, data) => {
        if (err) {
          console.log(err);
          this.res.statusCode = 500;
          this.res.end("An error occurred");
        }

        const oldBooks = JSON.parse(data);

        const lastBookIndex = oldBooks.length - 1;

        const lastItem = oldBooks[lastBookIndex];

        if (lastBookIndex == -1) {
          newBook.id = 1;
        } else {
          newBook.id = lastItem.id + 1;
        }

        const allBooks = [...oldBooks, newBook];

        fs.writeFile(bookDB, JSON.stringify(allBooks), (err) => {
          if (err) {
            console.log(err);
            this.res.statusCode = 500;
            this.res.end("An error occured");
          }

          this.res.statusCode = 201;
          this.res.end(JSON.stringify(allBooks));
        });
      });
    });
  }

  //REMOVE A BOOK FROM THE BOOKSHOP
  deleteBook() {
    const bookId = this.req.url.split("/")[2];

    fs.readFile(bookDB, "utf-8", (err, data) => {
      if (err) {
        this.res.statusCode = 500;
        res.end("An error occurred");
      }

      const books = JSON.parse(data);

      const bookToDeletedId = books.findIndex((book) => {
        return book.id === parseInt(bookId);
      });

      if (bookToDeletedId === -1) {
        this.res.statusCode = 404;
        this.res.end("Book not found");
      }

      books.splice(bookToDeletedId, 1);

      fs.writeFile(bookDB, JSON.stringify(books), (err) => {
        if (err) {
          this.res.statusCode = 500;
          this.res.end("An error occurred");
        }

        this.res.statusCode = 200;
        this.res.end("Book deleted successfully");
      });
    });
  }

  //LOAN OUT BOOK FROM BOOKSHOP
  loanOut() {
    const body = [];

    this.req.on("data", (chunk) => {
      body.push(chunk);
    });

    this.req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();

      const reqBody = JSON.parse(parsedBody);

      const bookId = reqBody.id;

      fs.readFile(bookDB, "utf-8", (err, data) => {
        if (err) {
          this.res.statusCode = 500;
          this.res.end("An error occured");
        }

        const books = JSON.parse(data);

        const bookToloan = books.find((book) => book.id == bookId);

        if (!bookToloan) {
          this.res.statusCode = 404;
          this.res.end("Book not found");
          return;
        }

        const loanedBookIndex = books.findIndex((book) => {
          return book.id === bookId;
        });

        books.splice(loanedBookIndex, 1);

        fs.readFile(loanedbookDB, "utf-8", (err, data) => {
          if (err) {
            this.res.statusCode = 500;
            this.res.end("An error occured");
          }

          const loanBooks = JSON.parse(data);

          const updatedloanBook = [...loanBooks, bookToloan];

          fs.writeFile(loanedbookDB, JSON.stringify(updatedloanBook), (err) => {
            if (err) {
              this.res.statusCode = 500;
              this.res.end("An error occured");
            }

            this.res.statusCode = 200;
            this.res.end(
              JSON.stringify({
                message: "Book Loaned Successfully",
                data: updatedloanBook,
              })
            );
          });
        });

        fs.writeFile(bookDB, JSON.stringify(books), (err) => {
          if (err) {
            this.res.statusCode = 500;
            this.res.end("An Error Occured");
          }
        });
      });
    });
  }

  //RETURN LOANED BOOK
  returnLoan() {
    const body = [];

    this.req.on("data", (chunk) => {
      body.push(chunk);
    });

    this.req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();

      const reqBody = JSON.parse(parsedBody);

      const bookId = reqBody.id;

      fs.readFile(loanedbookDB, "utf-8", (err, data) => {
        if (err) {
          this.res.statusCode = 500;
          this.res.end("An error occured");
        }

        const books = JSON.parse(data);

        const bookToReturn = books.find((book) => book.id == bookId);

        if (!bookToReturn) {
          this.res.statusCode = 404;
          this.res.end("Book not found");
          return;
        }

        const bookToReturnIndex = books.findIndex((book) => {
          return book.id === bookId;
        });

        books.splice(bookToReturnIndex, 1);

        fs.readFile(bookDB, "utf-8", (err, data) => {
          if (err) {
            this.res.statusCode = 500;
            this.res.end("An error occurred");
          }

          const bookShop = JSON.parse(data);

          const bookShopLastIndex = bookShop.length - 1;

          const lastItem = bookShop[bookShopLastIndex];

          bookToReturn.id = lastItem.id + 1;

          const updatedBook = [...bookShop, bookToReturn];

          fs.writeFile(bookDB, JSON.stringify(updatedBook), (err) => {
            if (err) {
              this.res.statusCode = 500;
              this.res.end("An error occured");
            }

            this.res.statusCode = 200;
            this.res.end(
              JSON.stringify({
                message: "Book Returned Successfully",
                data: updatedBook,
              })
            );
          });
        });

        fs.writeFile(loanedbookDB, JSON.stringify(books), (err) => {
          if (err) {
            this.res.statusCode = 500;
            this.res.end("An Error Occured");
          }
        });
      });
    });
  }

  //Update a book in the bookshop
  updateBook() {
    const body = [];

    this.req.on("data", (chunk) => {
      body.push(chunk);
    });

    this.req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();

      const reqBody = JSON.parse(parsedBody);

      fs.readFile(bookDB, "utf-8", (err, data) => {
        if (err) {
          this.res.statusCode = 500;
          this.res.end("An error occurred");
        }

        const books = JSON.parse(data);

        const bookId = this.req.url.split("/")[2];

        const bookUpdateIndex = books.findIndex((book) => book.id == bookId);

        if (bookUpdateIndex == -1) {
          this.res.statusCode = 404;
          this.res.end("Book not found");
          return;
        }

        books[bookUpdateIndex] = { ...books[bookUpdateIndex], ...reqBody };

        fs.writeFile(bookDB, JSON.stringify(books), (err) => {
          if (err) {
            this.res.statusCode = 500;
            this.res.end("An error occurred");
          }

          this.res.statusCode = 200;
          this.res.end(
            JSON.stringify({
              message: "Updated Successfully",
              data: books,
            })
          );
        });
      });
    });
  }
}

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
