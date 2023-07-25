const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
  const { rows: [routine] } = await client.query(`
    INSERT INTO routines("creatorId", "isPublic", name, goal)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
  `, [creatorId, isPublic, name, goal]);
  if (!routine) {
    throw Error;
  } else {
  console.log("routine: ", routine);
  return routine;
  }
  } catch (err) {
    console.error(err)
  }
}

// async function getRoutineById(id) { }

async function getRoutinesWithoutActivities() {
  try {
  const { rows: routines } = await client.query(`
    SELECT * FROM routines;
  `);
  if (!routines) {
    throw Error;
  } else {
  console.log("all routines: ", routines);
  return routines;
  }  
} catch (err) {
  console.log(err)
}
};

async function getAllRoutines() { 
try {
  const { rows: routines } = await client.query(`
  SELECT * FROM routines
  JOIN routine_activities ON routines.id=routine_activities."routineId";
  `)
  if (!routines) {
    throw Error;
  } else {
    console.log("getAllRoutines(before)" , routines);
const activitiesPromise = routines.map( async (routine) => {
  // const { rows: activitesReference } = await client.query(`
  // SELECT * FROM routine_activities
  // WHERE "routineId"=$1;
  // `, [routine.id])
  if (routine.routine_activities.length > 0) {
  const { rows: routineActivities } = await client.query(`
  SELECT * FROM activities
  WHERE "routineId"=$1;
  `, [routine.routine_activities[0].routineId])
  routine.activities = routineActivities;
  return routine;
  } else {
    return routine
  }
})


    console.log("getAllRoutines (after)", routines)
    return routines;
  }
} catch (err) {
  console.error(err)
}
}

async function getAllPublicRoutines() { }

// async function getAllRoutinesByUser({ username }) { }

// async function getPublicRoutinesByUser({ username }) { }

// async function getPublicRoutinesByActivity({ id }) { }

// async function updateRoutine({ id, ...fields }) { }

// async function destroyRoutine(id) { }

module.exports = {
  // getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  // getAllRoutinesByUser,
  // getPublicRoutinesByUser,
  // getPublicRoutinesByActivity,
  createRoutine,
  // updateRoutine,
  // destroyRoutine,
};
