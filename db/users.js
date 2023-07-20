const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
const { rows: [user] } = client.query(`
INSERT INTO users(username, password)
VALUES ($1, $2)
ON CONFLICT (username) DO NOTHING
RETURN *;
`, [username, password]);
console.log('user:', user);
return user;
  } catch (error) {
    console.error(error)
  }
}

async function getUser({ username, password }) {

}

async function getUserById(userId) {

}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
