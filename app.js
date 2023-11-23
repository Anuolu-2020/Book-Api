const http = require("http");
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "DB", "users.json");

const PORT = 3000;

const users = [,];

function requestHandler(req, res) {
  const controller = new requestController(req, res);
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET" && req.url === "/users") {
    controller.getAllUsers();
  } else if (req.method === "POST" && req.url === "/users") {
  }
}

class requestController {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  getAllUsers() {
    if (!users) {
      res.writeHead(404);
      res.end(JSON.stringify("User Not found"));
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

  createUser() {}
}

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
