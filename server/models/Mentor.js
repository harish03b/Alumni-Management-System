const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        graduationYear: {
            type: Number,
            required: true
        },

        expertise: {
            type: String,
            required: true,
            trim: true
        },

        mentorshipMethod: {
            type: String,
            required: true
        },

        availability: {
            type: String,
            required: true
        },

        goals: {
            type: String,
            default: ""
        },

        comments: {
            type: String,
            default: ""
        }

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Mentor", mentorSchema);