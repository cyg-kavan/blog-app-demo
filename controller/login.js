const { User } = require("../database/schema/Schema.js");
const bcrypt = require("bcrypt");

const env = require("dotenv");
const { createSecretToken } = require("../token-generation/generateToken");

env.config();

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
    if (!(email && password)) {
        return res.status(400).json({ message: "All input is required" });
    }

    const user = await User.findOne({ email });
    if (!(user && (await bcrypt.compare(password, user.password)))) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createSecretToken(user._id);
    res.cookie("token", token, {
        // domain: process.env.FRONTEND_URL,
        path: "/",
        expires: new Date(Date.now() + 86400000),
        httpOnly: true,
    });

    res.json({ token });
    } catch (error) {
        console.log("Got an error in login", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = login;