const express = require('express');
const router = express.Router();

// GET /api/health
router.get('/health', async (req, res, next) => {
res.send("All is well!")
});


// ROUTER: /api/users
const usersRouter = require('./users');
router.use('/users', usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require('./activities');
router.use('/activities', activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require('./routines');
router.use('/routines', routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require('./routineActivities');
router.use('/routine_activities', routineActivitiesRouter);

router.use((err, req, res, next) => {
    res.send({
        error: err.error,
        message: err.message,
        name: err.name
    })
})
module.exports = router;
