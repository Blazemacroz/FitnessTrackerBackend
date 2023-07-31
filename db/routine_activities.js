const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const { rows: [activity] } = await client.query(`
    INSERT INTO routine_activities("routineId", "activityId", count, duration)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT ("routineId", "activityId") DO NOTHING
    RETURNING *;
  `, [routineId,
      activityId,
      count,
      duration]);
    if (!activity) {
      throw Error;
    } else {
      console.log("activity added to routine: ", activity);
      return activity;
    }
  } catch (err) {
    console.error(err);
  }
}

async function getRoutineActivityById(id) {
  try {
    const { rows: [routineActivity] } = await client.query(`
      SELECT * FROM routine_activities
      WHERE id=$1;
    `, [id]);
    if (!routineActivity) {
      throw Error;
    } else {
      console.log("getRoutineActivityById: ", routineActivity);
      return routineActivity;
    }
  } catch (err) {
    console.error(err);
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows: routineActivities } = await client.query(`
      SELECT * FROM routine_activities
      WHERE "routineId"=$1;
    `, [id]);
    if (!routineActivities) {
      throw Error;
    } else {
      console.log("getRoutineActivitiesByRoutine: ", routineActivities);
      return routineActivities;
    }
  } catch (err) {
    console.error(err);
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields).map((key, index) => {
    return `"${key}"=$${index + 1}`;
  });
  try {
    const { rows: [updatedRoutineActivity] } = await client.query(`
      UPDATE routine_activities
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `, Object.values(fields));
    if (!updatedRoutineActivity) {
      throw Error;
    } else {
      console.log("updateRoutineActivity: ", updatedRoutineActivity);
      return updatedRoutineActivity;
    }
  } catch (err) {
    console.error(err);
  }
}

async function destroyRoutineActivity(id) {
  try {
    const { rows: [routineActivity] } = await client.query(`
    DELETE FROM routine_activities
    WHERE id=$1
    RETURNING *;
  `, [id]);
    if (!routineActivity) {
      throw Error;
    } else {
      console.log("destroyRoutineActivity: ", routineActivity);
      return routineActivity;
    }
  } catch (err) {
    console.error(err);
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    const { rows: [routine] } = await client.query(`
      SELECT routine_activities."routineId", routines."creatorId"
      FROM routine_activities
      JOIN routines ON routine_activities."routineId"=routines.id
      WHERE routine_activities.id=$1;
    `, [routineActivityId]);
    if (!routine) {
      throw Error;
    } else {
      console.log("canEditRoutineActivity: ", routine);
      if (routine.creatorId === userId) {
        return true;
      } else {
        return false;
      }
    }
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
