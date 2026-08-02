const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

// ===========================================
// Register User
// ===========================================
router.post("/signup", async (req, res) => {

    try {

        const {
            username,
            password,
            userType,
            firstName,
            lastName,
            email,
            address
        } = req.body;

        if (
            !username ||
            !password ||
            !userType ||
            !firstName ||
            !lastName ||
            !email ||
            !address
        ) {
            return res.status(400).send("All fields are required.");
        }

        if (req.body["confirm-password"] !== password) {
            return res.status(400).send("Passwords do not match.");
        }

        const existingUsername = await User.findOne({ username });

        if (existingUsername) {
            return res.status(409).send("Username already exists.");
        }

        const existingEmail = await User.findOne({ email });

        if (existingEmail) {
            return res.status(409).send("Email already registered.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({

            username,
            password: hashedPassword,
            userType,
            firstName,
            lastName,
            email,
            address

        });

        return res.redirect("/login");

    } catch (error) {

        console.error(error);

        return res.status(500).send("Registration Failed.");

    }

});

// ===========================================
// Login User
// ===========================================
router.post("/login", async (req, res) => {

    try {

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send("Username and Password are required.");
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).send("Invalid Username or Password.");
        }

        const passwordMatched = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatched) {
            return res.status(401).send("Invalid Username or Password.");
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                role: user.userType
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000
});

        return res.redirect("/");

    } catch (error) {

        console.error(error);

        return res.status(500).send("Login Failed.");

    }

});

// ===========================================
// Logout
// ===========================================
router.get("/logout", (req, res) => {

    res.clearCookie("token");

    return res.redirect("/login");

});

module.exports = router;