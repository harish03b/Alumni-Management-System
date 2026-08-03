const express = require("express");

const User = require("../models/User");

const router = express.Router();


// ===========================================
// Search Users by Location
// ===========================================

router.post("/search", async (req, res) => {

    try {

        const { locationsearch } = req.body;

        if (!locationsearch) {

            return res.status(400).json({

                success: false,

                message: "Location search term is required."

            });

        }

        const users = await User.find({

            address: {

                $regex: locationsearch,

                $options: "i"

            }

        });

        if (users.length === 0) {

            return res.status(404).json({

                success: false,

                message: "No users found."

            });

        }

        return res.status(200).json(users);

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Search failed."

        });

    }

});


// ===========================================
// Get All Users
// ===========================================

router.get("/all-users", async (req, res) => {

    try {

        const users = await User.find(

            {},

            "firstName lastName userType email address"

        );

        return res.status(200).json(users);

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Unable to fetch users."

        });

    }

});

module.exports = router;