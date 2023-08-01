const express = require('express');
const router = express.Router();
const {
    updateRoutineActivity,
    canEditRoutineActivity,
    getRoutineActivityById,
    getRoutineById,
    destroyRoutineActivity
} = require('../db');
const { requireUser } = require('./utils.js');

// PATCH /api/routine_activities/:routineActivityId
router.patch('/:routineActivityId', requireUser, async (req, res, next) => {
    const id = req.params.routineActivityId;
    const user = req.user;
    const fields = req.body;
    try {
        const canUpdate = await canEditRoutineActivity(id, user.id);
        if (!canUpdate) {
            const routineActivity = await getRoutineActivityById(id);
            const routine = await getRoutineById(routineActivity.routineId);
            next({
                error: "ERROR!",
                message: `User ${user.username} is not allowed to update ${routine.name}`,
                name: "Different User"
            })
        } else {
            const routineActivityToUpdate = await updateRoutineActivity({ id, ...fields });
            if (routineActivityToUpdate) {
                res.send(routineActivityToUpdate);
            }
        }
    } catch ({ error, message, name }) {
        next({ error, message, name });
    }
})

// DELETE /api/routine_activities/:routineActivityId
router.delete('/:routineActivityId', requireUser, async (req, res, next) => {
    const id = req.params.routineActivityId;
    const user = req.user;
    try {
        const canDelete = await canEditRoutineActivity(id, user.id);
        if (!canDelete) {
            const routineActivity = await getRoutineActivityById(id);
            const routine = await getRoutineById(routineActivity.routineId);
            next({
                error: "ERROR!",
                message: `User ${user.username} is not allowed to delete ${routine.name}`,
                name: "Different User",
                status: 403
            });
        } else {
            const routineActivityToDelete = await destroyRoutineActivity(id);
            if (routineActivityToDelete) {
                res.send(routineActivityToDelete);
            }
        }
    } catch ({ error, message, name, status }) {
        next({ error, message, name, status });
    }
})

module.exports = router;
