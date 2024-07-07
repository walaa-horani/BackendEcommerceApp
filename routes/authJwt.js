const { expressjwt } = require("express-jwt");
require('dotenv').config();

function authJwt() {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
        throw new Error("ACCESS_TOKEN_SECRET is not defined in the environment variables");
    }
    return expressjwt({
        secret: secret,
        algorithms: ["HS256"],
        isRevoked: isRevoked
    }).unless({
        path: [
            { url: /\/api\/product\/products(.*)/, methods: ["GET", "OPTIONS"] },
            { url: /\/api\/v1\/category(.*)/, methods: ["GET", "OPTIONS"] },
            "/api/user/login",
            "/api/user/register",
        ]
    });
}

async function isRevoked(req, token) {
    if (!token.payload.isAdmin) {
        return true;
    }
    req.user = token.payload; // Add this line to set the user object
    return false;
}

module.exports = {authJwt}