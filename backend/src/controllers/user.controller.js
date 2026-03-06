const User = require("../models/user.model");

const { createSecretToken } = require("../utils/generateToken");
const bcrypt = require("bcrypt");

const signup = async(req, res) => {
    try{
        const { name, email, password } = req.body
        // if(!(
        //     req.body.name &&
        //     req.body.email &&
        //     req.body.password
        // ))
        // {
        //     return res.status(400).send("All inputs are required");
        // }

        if(!(name && email && password)) {
            return res.status(400).send("All inputs are required")
        }

        const isEmail = (email) => {
            const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/; 
            return emailFormat.test(email);
        };
        if (!isEmail(email)) {
            return res.status(400).send({ message: 'Invalid email format.' });
        }

        const isStrongPassword = (password) => {

            if(password.length < 6){
                return false;
            }

            const digit = /[0-9]/;
            const uppercase = /[A-Z]/;
            const lowercase = /[a-z]/;
            const nonAlphanumeric = /[^0-9A-Za-z]/;

            return [digit, uppercase, lowercase, nonAlphanumeric].every((re) => re.test(password))
        }
        if (!isStrongPassword(password)) {
            return res.status(400).send({ message: 'Password must contain atleast 6 characters contain at least one digit, one uppercase letter, one lowercase letter, and one special character.'})
        }

        const existingUser = await User.findOne({ email: email });

        if(existingUser){
            return res.status(409).send({ message: "User already exist, Please Login." });
        }

        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
        });

        const user = await newUser.save();
        const token = createSecretToken(user._id);

        res.cookie("token", token, {
            path:"/",
            expires: new Date(Date.now() + 86400000),
            httpOnly: true,
        })

        console.log("Cookie set successfully");

        return res.status(201).json({
            message: "Signup Or Registration successful",
            user
        });

    } catch (error) {
        console.log("Got an error in signup", error);
        res.status(500).send("Internal Server Error");
    }
};

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

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, password } = req.body;

        const updateData = {};

        if (name) updateData.name = name;

        // if(password) {
        //     if(password.length < 6) {
        //         return res.status(400).send({ message: "Password must be atleast 6 characters long"});
        //     }

        //     const salt = 10;
        //     updateData.password = await bcrypt.hash(password, salt);
        // }

        if(password) {
            const isStrongPassword = (password) => {

                if(password.length < 6){
                    return false;
                }

                const digit = /[0-9]/;
                const uppercase = /[A-Z]/;
                const lowercase = /[a-z]/;
                const nonAlphanumeric = /[^0-9A-Za-z]/;

                return [digit, uppercase, lowercase, nonAlphanumeric].every((re) => re.test(password))
            }
            if (!isStrongPassword(password)) {
                return res.status(400).send({ message: 'Password must contain atleast 6 characters contain at least one digit, one uppercase letter, one lowercase letter, and one special character.'})
            }

            const salt = 10;
            updateData.password = await bcrypt.hash(password, salt);
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "Nothing to update" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        )

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "Profile updated successfully",
            user: updatedUser,
        });

        //findbyId and then save
        // const user = await User.findById(userId);

        // if (!user) {
        //     return res.status(404).json({ message: "User not found" });
        // }

        // if (name) {
        //     user.name = name;
        // }

        // if(password) {
        //     if(password.length < 6) {
        //         return res.status(400).send({ message: "Password must be atleast 6 characters long"});
        //     }

        //     const salt = 10;
        //     user.password = await bcrypt.hash(password, salt);
        // }

        // await user.save();

        // res.json({
        //     message: "Profile updated successfully",
        //     user: user,
        // });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const checkAuth = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

module.exports = { signup, login, updateProfile, checkAuth };