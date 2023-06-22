const expressAsyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")

const validateToken = expressAsyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(401)
                throw new Error("User is not authorized")
            }
            req.tokenObj = decoded.tokenObj
            console.log("Token_Data: ", req.tokenObj)
            next()
        })

        if (!token) {
            res.status(401)
            throw new Error("User is not authorized or token is missing!")
        }
    } else {
        res.status(400)
        throw new Error("Token is Missing")
    }
})

module.exports = validateToken

