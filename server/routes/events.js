const express = require("express");

const Event = require("../models/Event");
const authenticateUser = require("../middleware/auth");
const authenticateApiUser = require("../middleware/apiAuth");

const router = express.Router();

// ===========================================
// Create Event
// ===========================================
router.post("/api/events", authenticateUser, async (req, res) => {

    try {

        const {
            title,
            type,
            mode,
            date,
            time
        } = req.body;

        if (!title || !type || !mode || !date || !time) {
            return res.status(400).send("All fields are required.");
        }

        await Event.create({
            title,
            type,
            mode,
            date,
            time
        });

        return res.redirect("/pages/firsteventpage.html");

    } catch (error) {

        console.error("Create Event Error:", error);

        return res.status(500).send("Unable to create event.");

    }

});

// ===========================================
// Get All Events
// ===========================================
router.get("/api/events", async (req, res) => {

    try {

        const events = await Event.find().sort({
            date: 1
        });

        return res.json(events);

    } catch (error) {

        console.error("Fetch Events Error:", error);

        return res.status(500).json({
            message: "Unable to fetch events."
        });

    }

});

// ===========================================
// Register For Event
// ===========================================
router.post(
    "/api/events/register",
    authenticateApiUser,
    async (req, res) => {

        try {

            const { eventId } = req.body;

            const userId = req.user.id;

            if (!eventId) {

                return res.status(400).json({
                    message: "Event ID is required."
                });

            }

            const event = await Event.findById(eventId);

            if (!event) {

                return res.status(404).json({
                    message: "Event not found."
                });

            }

            const alreadyRegistered = event.registrations.some(
                id => id.toString() === userId
            );

            if (alreadyRegistered) {

                return res.status(400).json({
                    message: "You are already registered for this event."
                });

            }

            event.registrations.push(userId);

            await event.save();

            return res.status(200).json({
                success: true,
                message: "Successfully registered for the event."
            });

        } catch (error) {

            console.error("Registration Error:", error);

            return res.status(500).json({
                message: "Unable to register for event."
            });

        }

    }
);

module.exports = router;