const client = require("./client");
const { getUserByUsername } = require("./users");
const { attachActivitiesToRoutines } = require("./activities");
 
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

async function getRoutineById(id) {
  try {
    const { rows: [routine] } = await client.query(`
      SELECT * FROM routines
      WHERE id=$1;
    `, [id]);
    if (!routine) {
      throw Error;
    } else {
      console.log("getRoutineById: ", routine);
      return routine;
    }
  } catch (err) {
    console.error(err);
  }
}

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
  //       const { rows: activitesReference } = await client.query(`
  //         SELECT * FROM routine_activities
  //         WHERE "routineId"=$1;
  // `, [routine.id])
  //       if (activitesReference.length > 0) {
  //         const activities = activitesReference.map(async (reference) => {
  //           const { rows: [routineActivity] } = await client.query(`
  //             SELECT activities.id, activities.name, activities.description
  //             FROM activities
  //             WHERE id=$1;
  //     `, [reference.activityId])
  //           routineActivity.duration = reference.duration;
  //           routineActivity.count = reference.count;
  //           routineActivity.routineId = reference.routineId;
  //           routineActivity.routineActivityId = reference.id;
  //           return routineActivity;
  //         })
  //         routine.activities = await Promise.all(activities);
  //         return routine;
  //       } else {
  //         return routine;
  //       }
  return await attachActivitiesToRoutines(routine);
      })
      const routinesWithActivities = await Promise.all(activitiesPromise);

      console.log("getAllRoutines (after)", routinesWithActivities)
      return routinesWithActivities;
    }
  } catch (err) {
    console.error(err)
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.id, routines."creatorId", routines."isPublic",
    routines.name, routines.goal, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId"=users.id
    WHERE "isPublic"=true
    ;
    `)
    console.log("getAllPublicRoutines(before): ", routines);
    if (!routines) {
      throw Error;
    } else {
      const activitiesPromise = routines.map(async (routine) => {
  //       const { rows: activitesReference } = await client.query(`
  //         SELECT * FROM routine_activities
  //         WHERE "routineId"=$1;
  // `, [routine.id])
  //       if (activitesReference.length > 0) {
  //         const activities = activitesReference.map(async (reference) => {
  //           const { rows: [routineActivity] } = await client.query(`
  //             SELECT activities.id, activities.name, activities.description
  //             FROM activities
  //             WHERE id=$1;
  //     `, [reference.activityId])
  //           routineActivity.duration = reference.duration;
  //           routineActivity.count = reference.count;
  //           routineActivity.routineId = reference.routineId;
  //           routineActivity.routineActivityId = reference.id;
  //           return routineActivity;
  //         })
  //         routine.activities = await Promise.all(activities);
  //         return routine;
  //       } else {
  //         return routine;
  //       }
  return await attachActivitiesToRoutines(routine);
      })
      const routinesWithActivities = await Promise.all(activitiesPromise);

      console.log("getAllPublicRoutines(after): ", routinesWithActivities);
      return routinesWithActivities;
    }
  } catch (err) {
    console.error(err);
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const user = await getUserByUsername(username);
    const { rows: routines } = await client.query(`
  SELECT routines.id, routines."creatorId", routines."isPublic",
  routines.name, routines.goal, users.username AS "creatorName"
  FROM routines
  JOIN users ON routines."creatorId"=users.id
  WHERE "creatorId"=$1
  ;
  `, [user.id]);
    console.log("getAllRoutinesByUser(before): ", routines);
    if (!routines) {
      throw Error;
    } else {
      const activitiesPromise = routines.map(async (routine) => {
//         const { rows: activitesReference } = await client.query(`
//         SELECT * FROM routine_activities
//         WHERE "routineId"=$1;
// `, [routine.id])
//         if (activitesReference.length > 0) {
//           const activities = activitesReference.map(async (reference) => {
//             const { rows: [routineActivity] } = await client.query(`
//             SELECT activities.id, activities.name, activities.description
//             FROM activities
//             WHERE id=$1;
//     `, [reference.activityId])
//             routineActivity.duration = reference.duration;
//             routineActivity.count = reference.count;
//             routineActivity.routineId = reference.routineId;
//             routineActivity.routineActivityId = reference.id;
//             return routineActivity;
//           })
//           routine.activities = await Promise.all(activities);
//           return routine;
//         } else {
//           return routine;
//         }
return await attachActivitiesToRoutines(routine);
      })
      const routinesWithActivities = await Promise.all(activitiesPromise);

      console.log("getAllRoutinesByUser(after): ", routinesWithActivities);
      return routinesWithActivities;
    }
  } catch (err) {
    console.error(err);
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const user = await getUserByUsername(username);
    const { rows: routines } = await client.query(`
  SELECT routines.id, routines."creatorId", routines."isPublic",
  routines.name, routines.goal, users.username AS "creatorName"
  FROM routines
  JOIN users ON routines."creatorId"=users.id
  WHERE "creatorId"=$1 AND "isPublic"=true
  ;
  `, [user.id]);
    console.log("getAllRoutinesByUser(before): ", routines);
    if (!routines) {
      throw Error;
    } else {
      const activitiesPromise = routines.map(async (routine) => {
//         const { rows: activitesReference } = await client.query(`
//         SELECT * FROM routine_activities
//         WHERE "routineId"=$1;
// `, [routine.id])
//         if (activitesReference.length > 0) {
//           const activities = activitesReference.map(async (reference) => {
//             const { rows: [routineActivity] } = await client.query(`
//             SELECT activities.id, activities.name, activities.description
//             FROM activities
//             WHERE id=$1;
//     `, [reference.activityId])
//             routineActivity.duration = reference.duration;
//             routineActivity.count = reference.count;
//             routineActivity.routineId = reference.routineId;
//             routineActivity.routineActivityId = reference.id;
//             return routineActivity;
//           })
//           routine.activities = await Promise.all(activities);
//           return routine;
//         } else {
//           return routine;
//         }
return await attachActivitiesToRoutines(routine);
      })
      const routinesWithActivities = await Promise.all(activitiesPromise);

      console.log("getAllRoutinesByUser(after): ", routinesWithActivities);
      return routinesWithActivities;
    }
  } catch (err) {
    console.error(err);
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows: references } = await client.query(`
      SELECT "routineId" FROM routine_activities
      WHERE "activityId"=$1;
    `, [id]);
    console.log("getPublicRoutinesByActivity - references: ", references);
    const routinesPromise = references.map(async (reference) => {
      console.log("rouineId: ", reference.routineId);
      const { rows: [activityRoutine] } = await client.query(`
  SELECT routines.id, routines."creatorId", routines."isPublic",
  routines.name, routines.goal, users.username AS "creatorName"
  FROM routines
  JOIN users ON routines."creatorId"=users.id
  WHERE routines.id=$1 AND "isPublic"=true
  ;
  `, [reference.routineId]);
      console.log("activityRoutine: ", activityRoutine)
      if (activityRoutine !== undefined) {
        return activityRoutine;
      } 
    })
    const routines = await Promise.all(routinesPromise);
    const filterRoutines = routines.filter((el) => {
      return !!el;
    })
    //   const { rows: routines } = await client.query(`
    // SELECT routines.id, routines."creatorId", routines."isPublic",
    // routines.name, routines.goal, users.username AS "creatorName"
    // FROM routines
    // JOIN users ON routines."creatorId"=users.id
    // WHERE "isPublic"=true AND id=
    // ;
    // `, []);
    console.log("getPublicRoutinesByActivity(before): ", filterRoutines);
    if (!routines) {
      throw Error;
    } else {
      const activitiesPromise = filterRoutines.map(async (routine) => {
//         const { rows: activitesReference } = await client.query(`
//         SELECT * FROM routine_activities
//         WHERE "routineId"=$1;
// `, [routine.id])
//         if (activitesReference.length > 0) {
//           const activities = activitesReference.map(async (reference) => {
//             const { rows: [routineActivity] } = await client.query(`
//             SELECT activities.id, activities.name, activities.description
//             FROM activities
//             WHERE id=$1;
//     `, [reference.activityId])
//             routineActivity.duration = reference.duration;
//             routineActivity.count = reference.count;
//             routineActivity.routineId = reference.routineId;
//             routineActivity.routineActivityId = reference.id;
//             return routineActivity;
//           })
//           routine.activities = await Promise.all(activities);
//           return routine;
//         } else {
//           return routine;
//         }
return await attachActivitiesToRoutines(routine);
      })
      const routinesWithActivities = await Promise.all(activitiesPromise);

      console.log("getPublicRoutinesByActivity(after): ", routinesWithActivities);
      return routinesWithActivities;
    }
  } catch (err) {
    console.error(err);
  }
}

// async function updateRoutine({ id, ...fields }) { }

// async function destroyRoutine(id) { }

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  // updateRoutine,
  // destroyRoutine,
};
