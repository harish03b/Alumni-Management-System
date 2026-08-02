const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        jobTitle: {
            type: String,
            required: true,
            trim: true
        },

        companyName: {
            type: String,
            required: true,
            trim: true
        },

        jobLocation: {
            type: String,
            required: true,
            trim: true
        },

        jobDescription: {
            type: String,
            required: true
        },

        qualifications: {
            type: String,
            required: true
        },

        salaryRange: {
            type: String,
            default: ""
        },

        contactPerson: {
            type: String,
            required: true,
            trim: true
        },

        contactEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        contactPhone: {
            type: String,
            default: ""
        },

        postingDuration: {
            type: Number,
            required: true
        },

        companyLogo: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Job", jobSchema);