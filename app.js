const http = require("http");
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "DB", "users.json");

const PORT = 3000;

const users = [,];

function requestHandler(req, res) {
  const controller = new requestController(req, res);
  res.setHeader("Content-Type", "application/json");

  if (req.url === "/users" && req.method === "GET") {
    controller.getAllUsers();
  } else if (req.url === "/users" && req.method === "POST") {
    controller.createUser();
  }
}

class requestController {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  getAllUsers() {
    if (!users) {
      this.res.writeHead(404);
      this.res.end(JSON.stringify("User Not found"));
    }

    fs.readFile(dbPath, "utf-8", (err, data) => {
      if (err) {
        console.log("An Error Ocurred");
        this.res.writeHead(500);
        this.res.end(JSON.stringify("Error occured while reading db"));
      }

      this.res.writeHead(200);
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

      const newBook = JSON.parse(parsedBody);

      fs.readFile(dbPath, "utf-8", (err, data) => {
        if (err) {
          console.log(err);
          this.res.writeHead(400);
          this.res.end("An error occured");
        }

        const oldBooks = JSON.parse(data);

        const bookLength = oldBooks.length - 1;

        const lastItem = oldBooks[bookLength];

        newBook.id = lastItem.id + 1;

        const allbooks = [...oldBooks, newBook];

        fs.writeFile(dbPath, JSON.stringify(allbooks), (err) => {
          if (err) {
            console.log(err);
            this.res.writeHead(400);
            this.res.end("An error occured");
          }

          this.res.writeHead(201);
          this.res.end({
            message: "User Created successfully",
            data: JSON.stringify(allbooks),
          });
        });
      });
    });
  }
}

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
