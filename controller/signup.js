const { User } = require("../database/schema/Schema.js");

const { createSecretToken } = require("../token-generation/generateToken");
const bcrypt = require("bcrypt");

const createUser = async(req, res) => {
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

        res.json(user);

    } catch (error) {
        console.log("Got an error in signup", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = createUser;