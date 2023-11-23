const http = require("http");

const PORT = 3000;

const books = [
  { id: 1, name: "The good book", author: "Arebi" },
  { id: 2, name: "The bad book", author: "chemi" },
];

function requestHandler(req, res) {
  res.setHeader("Content-Type", "application/json");
  if (req.method === "GET" && req.url === "/books") requestController(req, res);
}

const requestController = async (req, res) => {
  if (!books) {
    res.writeHead(404);
    res.end(JSON.stringify("Book Not found"));
  }
  const response = await books;
  res.writeHead(200);
  res.end(JSON.stringify(books));
};

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
