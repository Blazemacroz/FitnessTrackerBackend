/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken')
require('dotenv').config()
const {
    getUserByUsername,
    createUser,
    getUser,
    getPublicRoutinesByUser,
    getAllRoutinesByUser,
    // getAllPublicRoutines
} = require('../db')
const {
    requireUser
} = require('./utils.js')

// POST /api/users/register
router.post('/register', async (req, res, next) => {
    const { username, password } = req.body
    try {
        const existingUser = await getUserByUsername(username)
        if (password.length < 8) {
            next({
                error: "ERROR",
                message: "Password Too Short!",
                name: "Password Length"
            })
        } else if (existingUser) {
            next({
                error: "ERROR",
                message: `User ${existingUser.username} is already taken.`,
                name: "duplicate user"
            })
        } else {
            const newUser = await createUser({ username, password })
            const encryptedUser = jwt.sign({
                id: newUser.id,
                username
            }, process.env.JWT_SECRET, {
                expiresIn: "1w"
            })
            res.send({
                message: 'Thank you for signing up.',
                token: encryptedUser,
                user: newUser,
            })
        }
    } catch ({
        error,
        message,
        name
    }) {
        next({
            error,
            message,
            name
        })
    }
})
// POST /api/users/login
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body
    try {
        const user = await getUser({ username, password })
        if (!user) {
            next({
                message: "username or password does not exist"
            })
        } else {
            const encryptedUser = jwt.sign({
                id: user.id,
                username
            }, process.env.JWT_SECRET, {
                expiresIn: "1w"
            })
            res.send({
                message: "you're logged in!",
                token: encryptedUser,
                user
            })
        }
    } catch ({
        error,
        message,
        name,
    }) {
        next({
            error,
            message,
            name,
        })
    }
})
// GET /api/users/me
router.get('/me', requireUser, async (req, res, next) => {
    const { username } = req.user;
    try {
        const currentUser = await getUserByUsername(username)
        if (!currentUser) {
            throw Error;
        } else {
            res.send(currentUser)
        }
    } catch (error) {
        next(error)
    }
})
// GET /api/users/:username/routines
router.get('/:username/routines', requireUser, async (req, res, next) => {
    const username = req.params.username;
    const user = req.user;
    console.log("req.user", req.user);
    try {
        const userRoutines = await getAllRoutinesByUser(user);
        const publicRoutines = await getPublicRoutinesByUser({ username });
        if (!userRoutines || !publicRoutines) {
            throw Error;
        } else {
            // This is where we left off
            if (req.user.username === username) {
                res.send([
                    ...userRoutines
                ])
            } else {
                res.send([
                    ...publicRoutines
                ])
            }
        }
    } catch (error) {
        next(error)
    }
})
module.exports = router;
