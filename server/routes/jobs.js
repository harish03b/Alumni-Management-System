const express = require("express");
const path = require("path");
const multer = require("multer");

const Job = require("../models/Job");
const authenticateUser = require("../middleware/auth");

const router = express.Router();

// ===========================================
// Multer Configuration
// ===========================================

const storage = multer.diskStorage({

    destination(req, file, cb) {
        cb(null, path.join(__dirname, "../uploads"));
    },

    filename(req, file, cb) {

        cb(
            null,
            Date.now() + "-" + file.originalname
        );

    }

});

const upload = multer({ storage });


// ===========================================
// Post Job
// ===========================================

router.post(
    "/postjob",
    authenticateUser,
    upload.single("company-logo"),
    async (req, res) => {

        try {

            const {

                jobTitle,
                companyName,
                jobLocation,
                jobDescription,
                qualifications,
                salaryRange,
                contactPerson,
                contactEmail,
                contactPhone,
                postingDuration

            } = req.body;

            const job = await Job.create({

                jobTitle,
                companyName,
                jobLocation,
                jobDescription,
                qualifications,
                salaryRange,
                contactPerson,
                contactEmail,
                contactPhone,
                postingDuration,

                companyLogo: req.file
                    ? `/uploads/${req.file.filename}`
                    : null

            });

            console.log("Job Posted:", job._id);

            return res.redirect("/");

        } catch (error) {

            console.error(error);

            return res.status(500).send("Unable to post job.");

        }

    }
);


// ===========================================
// Get All Jobs
// ===========================================

router.get("/jobs", async (req, res) => {

    try {

        const jobs = await Job.find().sort({

            createdAt: -1

        });

        return res.json(jobs);

    } catch (error) {

        console.error(error);

        return res.status(500).send("Unable to fetch jobs.");

    }

});

module.exports = router;