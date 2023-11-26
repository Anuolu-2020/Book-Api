require("dotenv").config();

const API_KEY = process.env.API_KEY;

function authenticateUser(req, res) {
  return new Promise((resolve, reject) => {
    let token = req.headers.authorization;

    if (!token) {
      reject("Provide an api key");
    }

    if (token !== API_KEY) {
      reject("Invalid api key");
    }

    resolve();
  });
}

module.exports = { authenticateUser };
