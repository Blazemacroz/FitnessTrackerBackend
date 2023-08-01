async function requireUser(req, res, next) {
    if (!req.user) {
        next({
            error: "ERROR",
            message: "You must be logged in to perform this action",
            name: "Not logged in"
        })
    }
    next()
}
module.exports = {
    requireUser
}
