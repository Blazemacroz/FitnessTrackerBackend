const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require("dotenv").config();
const {
    getUserById
} = require('../db')

// GET /api/health
router.get('/health', (req, res) => {
    res.send({ message: "All is well!" });
});

// GET /api/unknown
router.use('/unknown', (req, res) => {
    res.status(404).send({ message: "404 Not Found" });
})

router.use(async (req, res, next) => {
    const prefix = "Bearer ";
    const auth = req.header("Authorization");
    if (!auth) {
        next();
    } else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length);
        try {
            const { id } = jwt.verify(token, process.env.JWT_SECRET);
            if (id) {
                req.user = await getUserById(id);
                next();
            } else if (!id) {
                next({
                    message: "Authorization incorrect."
                })
            }
        } catch ({ message }) {
            next(message)
        }
    }
})

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
    if (err.status === 403) {
        res.status(403).send({
            error: err.error,
            message: err.message,
            name: err.name
        });
    } else {
        next(err);
    }
})

router.use((err, req, res, next) => {
    res.status(401).send({
        error: err.error,
        message: err.message,
        name: err.name
    })
    next(err);

})


module.exports = router;
