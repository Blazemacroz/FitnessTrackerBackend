const express = require('express');
const router = express.Router();
const {
    getAllActivities,
    createActivity,
    getActivityByName,
    getActivityById,
    updateActivity,
    getPublicRoutinesByActivity
} = require('../db');
const { requireUser } = require('./utils.js');

// GET /api/activities
router.get('/', async (req, res, next) => {
    try {
        const activities = await getAllActivities();
        if (!activities) {
            throw Error;
        } else {
            // console.log("/")
            res.send(activities);
        }
    } catch (err) {
        next(err);
    }
})

// POST /api/activities
router.post('/', requireUser, async (req, res, next) => {
    const { name, description } = req.body;
    try {
        const allActivities = await getActivityByName(name);
        if (allActivities) {
            next({
                error: "ERROR!",
                message: `An activity with name ${name} already exists`,
                name: "Duplicate name"
            })
        } else {
            const newActivity = await createActivity({ name, description });
            res.send(newActivity);
        }
    } catch ({ error, message, name }) {
        next({ error, message, name });
    }
})

// PATCH /api/activities/:activityId
router.patch('/:activityId', requireUser, async (req, res, next) => {
    const id = Number(req.params.activityId);
    const name = req.body.name;
    console.log("/:activityId ", name);
    try {
        const existingActivity = await getActivityById(id);
        const nameActivity = await getActivityByName(name);
        if (!existingActivity) {
            next({
                error: "ERROR!",
                message: `Activity ${id} not found`,
                name: "Missing activity"
            })
        } else if (!nameActivity) {
            const activityToUpdate = await updateActivity({ id, ...req.body });
            if (activityToUpdate) {
                console.log(":activityId (patch) ", activityToUpdate);
                res.send({
                    description: req.body.description,
                    id: id,
                    name
                });
            }
        } else {
            next({
                error: "ERROR!",
                message: `An activity with name ${name} already exists`,
                name: "Duplicate name"
            })

        }
    } catch ({ error, message, name }) {
        next({ error, message, name });
    }
})

// GET /api/activities/:activityId/routines
router.get('/:activityId/routines', async (req, res, next) => {
    const id = Number(req.params.activityId);
    try {
        const activity = await getActivityById(id);
        if (!activity) {
            next({
                error: "ERROR!",
                message: `Activity ${id} not found`,
                name: "Missing activity"
            });
        } else {
            const activityRoutines = await getPublicRoutinesByActivity({ id });
            console.log("/activityId/routines ", activityRoutines);
            res.send(activityRoutines);
        }
    } catch ({ error, message, name }) {
        next({ error, message, name });
    }
})

module.exports = router;
