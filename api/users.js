/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken')
require('dotenv').config()
const {
    getUserByUsername,
    createUser,
} =require('../db')

// POST /api/users/register
router.post('/register', async (req, res, next)=>{
    const {username, password} = req.body
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
                message:  `User ${existingUser.username} is already taken.`,
                name: "duplicate user"
            })
        } else {
            const newUser = await createUser({username, password}) 
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

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
