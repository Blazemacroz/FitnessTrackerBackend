const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  try {
    // return the new activity
    const { rows: [activity] } = await client.query(`
    INSERT INTO activities(name, description)
    VALUES ($1,  $2)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
  `, [name, description]);
    if (!activity) {
      throw Error;
    } else {
      console.log("activity: ", activity);
      return activity;
    }
  } catch (err) {
    console.error(err);
  }
}

async function getAllActivities() {
  try {
    // select and return an array of all activities
    const { rows: activities } = await client.query(`
    SELECT * FROM activities;
  `);
    if (!activities) {
      throw Error;
    } else {
      console.log("all activites: ", activities);
      return activities;
    }
  } catch (err) {
    console.error(err);
  }
}

async function getActivityById(id) {
  try {
    const { rows: [activity] } = await client.query(`
      SELECT * FROM activities
      WHERE id=$1;
    `, [id]);
    if (!activity) {
      throw Error;
    } else {
      console.log("getActivityById: ", activity);
      return activity;
    }
  } catch (err) {
    console.error(err);
  }
}

// async function getActivityByName(name) { }

// used as a helper inside db/routines.js
// async function attachActivitiesToRoutines(routines) { }

// async function updateActivity({ id, ...fields }) {
//   // don't try to update the id
//   // do update the name and description
//   // return the updated activity
// }

module.exports = {
  getAllActivities,
  getActivityById,
  // getActivityByName,
  // attachActivitiesToRoutines,
  createActivity,
  // updateActivity,
};
