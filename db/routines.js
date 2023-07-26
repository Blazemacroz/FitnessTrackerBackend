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
}

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`
  SELECT routines.id, routines."creatorId", routines."isPublic",
  routines.name, routines.goal, users.username AS "creatorName"
  FROM routines
  JOIN users ON routines."creatorId"=users.id
  ;
  `)
    console.log("getAllRoutines(before)", routines);
    if (!routines) {
      throw Error;
    } else {
      const activitiesPromise = routines.map(async (routine) => {
        const { rows: activitesReference } = await client.query(`
          SELECT * FROM routine_activities
          WHERE "routineId"=$1;
  `, [routine.id])
        if (activitesReference.length > 0) {
          const activities = activitesReference.map(async (reference) => {
            const { rows: [routineActivity] } = await client.query(`
              SELECT activities.id, activities.name, activities.description
              FROM activities
              WHERE id=$1;
      `, [reference.activityId])
            routineActivity.duration = reference.duration;
            routineActivity.count = reference.count;
            routineActivity.routineId = reference.routineId;
            routineActivity.routineActivityId = reference.id;
            console.log("routineActivities: ", routineActivity);
            return routineActivity;
          })
          routine.activities = await Promise.all(activities);
          return routine;
        } else {
          return routine;
        }
      })
      const routinesWithActivities = await Promise.all(activitiesPromise);

      console.log("getAllRoutines (after)", routinesWithActivities)
      return routinesWithActivities;
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
