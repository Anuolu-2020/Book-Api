const http = require("http");
const path = require("path");
const fs = require("fs");

const PORT = 3000;

const usersDB = path.join(__dirname, "DB", "users.json");

const bookDB = path.join(__dirname, "DB", "books.json");

function requestHandler(req, res) {
  const controller = new requestController(req, res);
  res.setHeader("Content-Type", "application/json");

  if (req.url === "/users" && req.method === "GET") {
    controller.getAllUsers();
  } else if (req.url === "/users" && req.method === "POST") {
    controller.createUser();
  } else if (req.url === "/books" && req.method === "POST") {
    controller.createBook();
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
        const oldBooks = JSON.parse(data);

        const lastBookIndex = oldBooks.length - 1;

        const lastItem = oldBooks[lastBookIndex];

        if (lastBookIndex == -1) {
          newBook.id = 1;
        } else {
          newBook.id = lastItem.id + 1;
        }

        fs.writeFile(bookDB, JSON.stringify(newBook), (err) => {
          if (err) {
            console.log(err);
            this.res.statusCode = 500;
            this.res.end("An error occured");
          }

          this.res.statusCode = 201;
          this.res.end(JSON.stringify(newBook));
        });
      });
    });
  }
}

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
