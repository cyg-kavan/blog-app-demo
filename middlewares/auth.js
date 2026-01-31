//Authentication middleware

const jwt = require("jsonwebtoken");
const { User } = require("../database/schema/Schema.js");

require("dotenv").config();

const authentication = async (req, res, next) => {
    const token = req.cookies?.token;
    console.log("Token from cookie:", token);

    // const authHeader = req.headers.authorization;
    // console.log("Authorization header:", authHeader);

    // if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //     return res.status(401).json({ message: "Token missing" });
    // }

    // const token = authHeader.split(" ")[1];

    try {
        if (!token) {
            return res.status(401).send({ message: "Authentication required, Token missing" });
        }

        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = decoded; //we are getting data in req object
        console.log("Decoded user", decoded);
        console.log("User ID from token:", req.user.id);

        const user = await User.findById(decoded.id);
        if(!user) {
            return res.status(404).send({ message: "User doesn't exist"});
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).send({ message: "Invalid or expired token" });
    }
};

module.exports = authentication;
