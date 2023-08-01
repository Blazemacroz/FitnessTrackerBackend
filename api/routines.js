const express = require('express');
const router = express.Router();
const {
    getAllRoutines,
} = require('../db');

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

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
