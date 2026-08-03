const express = require("express");

const Mentor = require("../models/Mentor");
const authenticateUser = require("../middleware/auth");

const router = express.Router();


// ===========================================
// Register Mentor
// ===========================================
router.post("/mentors", authenticateUser, async (req, res) => {

    try {

        const mentor = await Mentor.create({

            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            graduationYear: req.body.graduationYear,
            expertise: req.body.expertise,
            mentorshipMethod: req.body.mentorshipMethod,
            availability: req.body.availability,
            goals: req.body.goals,
            comments: req.body.comments

        });

        console.log("Mentor Registered:", mentor._id);

        return res.redirect("/pages/network.html");

    } catch (error) {

        console.error("Mentor Registration Error:", error);

        return res.status(500).send(
            "Unable to register mentor."
        );

    }

});


// ===========================================
// Get All Mentors
// ===========================================
router.get("/mentors", async (req, res) => {

    try {

        const mentors = await Mentor.find().sort({

            createdAt: -1

        });

        return res.json(mentors);

    } catch (error) {

        console.error("Mentor Fetch Error:", error);

        return res.status(500).json({

            message: "Unable to fetch mentors."

        });

    }

});

module.exports = router;