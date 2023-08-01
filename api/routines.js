const express = require('express');
const router = express.Router();
const {
    getAllRoutines,
    createRoutine,
    updateRoutine,
    getRoutineById,
    destroyRoutine,
    addActivityToRoutine,
    getRoutineActivitiesByRoutine
} = require('../db');
const { requireUser } = require('./utils.js');

// GET /api/routines
router.get('/', async (req, res, next) => {
    try {
        const routines = await getAllRoutines();
        if (!routines) {
            throw Error;
        } else {
            res.send(routines);
        }
    } catch (err) {
        next(err);
    }
})

// POST /api/routines
router.post('/', requireUser, async (req, res, next) => {
    const creatorId = req.user.id;
    const { isPublic, name, goal } = req.body;
    try {
        const newRoutine = await createRoutine({ creatorId, isPublic, name, goal });
        if (!newRoutine) {
            throw Error;
        } else {
            res.send(newRoutine);
        }
    } catch (err) {
        next(err);
    }
})

// PATCH /api/routines/:routineId
router.patch('/:routineId', requireUser, async (req, res, next) => {
    const id = Number(req.params.routineId);
    const userId = req.user.id;
    try {
        const userRoutine = await getRoutineById(id);
        console.log("/routineId (user id) ", userId, userRoutine.creatorId);
        if (userRoutine.creatorId === userId) {
            const updatedRoutine = await updateRoutine({ id, ...req.body })
            res.send(updatedRoutine);
        } else {
            next({
                error: "ERROR!",
                message: `User ${req.user.username} is not allowed to update ${userRoutine.name}`,
                name: "Different User",
                status: 403
            });
        }
    } catch ({ error, message, name, status }) {
        next({ error, message, name, status });
    }
})

// DELETE /api/routines/:routineId
router.delete('/:routineId', requireUser, async (req, res, next) => {
    const id = Number(req.params.routineId);
    const userId = req.user.id;
    try {
        const userRoutine = await getRoutineById(id);
        if (userRoutine.creatorId === userId) {
            const deletedRoutine = await destroyRoutine(id);
            if (deletedRoutine) {
                res.send(deletedRoutine);
            }
        } else {
            next({
                error: "ERROR!",
                message: `User ${req.user.username} is not allowed to delete ${userRoutine.name}`,
                name: "Different user",
                status: 403
            })
        }
    } catch ({ error, message, name, status }) {
        next({ error, message, name, status });
    }
})

// POST /api/routines/:routineId/activities
router.post('/:routineId/activities', async (req, res, next) => {
    const routineId = Number(req.params.routineId);
    const id = routineId;
    const { activityId, count, duration } = req.body;
    try {
        const routineActivities = await getRoutineActivitiesByRoutine({ id });
        routineActivities.forEach((routine_activity) => {
            if (routine_activity.activityId === activityId) {
                next({
                    error: "ERROR!",
                    message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`,
                    name: "Duplicate routineActivities"
                });
            }
        })
        const activityToRoutine = await addActivityToRoutine({ routineId, activityId, count, duration });
        if (activityToRoutine) {
            res.send(activityToRoutine);
        }
    } catch (err) {
        next(err);
    }
})

module.exports = router;
