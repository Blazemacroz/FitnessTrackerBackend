const client = require("./client");
const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const hashedPasword = await bcrypt.hash(password, SALT_COUNT);
    const { rows: [users] } = await client.query(`
  INSERT INTO users(username, password)
  VALUES ($1, $2)
  ON CONFLICT (username) DO NOTHING
  RETURNING *;
`, [username, hashedPasword]);
    if (!users) {
      throw Error;
    } else {
      delete users.password;
      console.log('users:', users);
      return users;
    }
  } catch (error) {
    console.error(error)
  }
}

async function getUserByUsername(userName) {
  try {
    const { rows: [user] } = await client.query(`
    SELECT * FROM users
    WHERE username=$1;
  `, [userName]);
    if (!user) {
      throw Error;
    } else {
      console.log("getUserByUsername: ", user);
      return user;
    }
  } catch (err) {
    console.error(err);
  }
}

async function getUser({ username, password }) {
  try {
    const user = await getUserByUsername(username);
    const hashedPasword = user.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPasword);
    if (passwordsMatch) {
      delete user.password;
      console.log("getUser: ", user);
      return user;
    } else {
      throw Error;
    }
  } catch (err) {
    console.error(err);
  }
}

async function getUserById(userId) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT * FROM users
      WHERE id=$1;
    `, [userId]);
    if (!user) {
      throw Error;
    } else {
      delete user.password;
      console.log("getUserById: ", user);
      return user;
    }
  } catch (err) {
    console.error(err);
  }
}


module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
