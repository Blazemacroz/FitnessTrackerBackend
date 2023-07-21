const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const { rows: [users] } = await client.query(`
INSERT INTO users(username, password)
VALUES ($1, $2)
ON CONFLICT (username) DO NOTHING
RETURNING *;
`, [username, password]);
    console.log('users:', users);
    return users;
  } catch (error) {
    console.error(error)
  }
}

// async function getUser({ username, password }) {

// }

// async function getUserById(userId) {

// }

// async function getUserByUsername(userName) {

// }

module.exports = {
  createUser,
  // getUser,
  // getUserById,
  // getUserByUsername,
}
