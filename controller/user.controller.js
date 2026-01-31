const { User } = require("../database/schema/Schema.js");
const bcrypt = require("bcrypt");

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

module.exports = updateProfile;