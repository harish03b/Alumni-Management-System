require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const multer = require("multer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const authRoutes = require("./routes/auth");
const connectDB = require("./config/database");
const jobsRoutes = require("./routes/jobs");
const app = express();
const port = process.env.PORT || 2501;
const eventRoutes = require("./routes/events");
// ============================================
// Database Connection
// ============================================
connectDB();

// ============================================
// Middleware
// ============================================
app.use(helmet());
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", authRoutes);
app.use(cookieParser());
app.use("/", jobsRoutes);
app.use("/", eventRoutes);
// ============================================
// Static Files
// ============================================
const clientPath = path.join(__dirname, "../client");

app.use(express.static(clientPath));
app.use("/css", express.static(path.join(clientPath, "css")));
app.use("/js", express.static(path.join(clientPath, "js")));
app.use("/images", express.static(path.join(clientPath, "images")));
app.use("/uploads", express.static(path.join(clientPath, "uploads")));

// ============================================
// Routes
// ============================================

app.get("/", (req, res) => {
    res.sendFile(path.join(clientPath, "pages", "alumini.html"));
});

app.get("/signup", (req, res) => {
    res.sendFile(path.join(clientPath, "pages", "signup.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(clientPath, "pages", "login.html"));
});

// ============================================
// User Schema
// ============================================
const User = require("./models/User");
// ============================================
// Signup
// ============================================



// ============================================
// Login
// ============================================


// ==============================
// Search Users by Location
// ==============================
app.post("/search", async (req, res) => {
    const { locationsearch } = req.body;

    if (!locationsearch) {
        return res.status(400).json({
            success: false,
            message: "Location search term is required."
        });
    }

    try {
        const users = await User.find({
            address: {
                $regex: locationsearch,
                $options: "i"
            }
        });

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found in the specified location."
            });
        }

        return res.status(200).json(users);

    } catch (error) {
        console.error("Search Error:", error);

        return res.status(500).json({
            success: false,
            message: "Error searching users."
        });
    }
});


// ==============================
// Get All Users
// ==============================
app.get("/all-users", async (req, res) => {
    try {

        const users = await User.find(
            {},
            "firstName lastName userType email address"
        );

        return res.status(200).json(users);

    } catch (error) {

        console.error("Fetch Users Error:", error);

        return res.status(500).json({
            success: false,
            message: "Error fetching users."
        });
    }
});


// ==============================
// Mentor Schema
// ==============================
const mentorSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        graduationYear: {
            type: Number,
            required: true
        },

        expertise: {
            type: String,
            required: true
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

const Mentor = mongoose.model("Mentor", mentorSchema);


// ==============================
// Register Mentor
// ==============================
app.post("/mentors", async (req, res) => {

    try {

        const mentor = new Mentor(req.body);

        await mentor.save();

        return res.redirect("/pages/network.html");

    } catch (error) {

        console.error("Mentor Registration Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to save mentor."
        });

    }

});


// ==============================
// Get All Mentors
// ==============================
app.get("/mentors", async (req, res) => {

    try {

        const mentors = await Mentor.find().sort({
            createdAt: -1
        });

        return res.status(200).json(mentors);

    } catch (error) {

        console.error("Mentor Fetch Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch mentors."
        });

    }

});


// ==============================
// Static Files
// ==============================

app.use(
    express.static(
        path.join(__dirname, "../client")
    )
);

app.use(express.urlencoded({ extended: true }));


// ===========================================
// Event Schema
// ===========================================


// ===========================================
// Create Event
// ===========================================



// ===========================================
// Get All Events
// ===========================================

// ===========================================
// Register for Event
// ===========================================
app.get("/events", (req, res) => {
    res.sendFile(path.join(clientPath, "pages", "firsteventpage.html"));
});
// ===========================================
// Donation Schema
// ===========================================
const donationSchema = new mongoose.Schema(
{
    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    paymentMethod: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    }

},
{
    timestamps:true
});

const Donation = mongoose.model("Donation", donationSchema);


// ===========================================
// Donation Receipt
// ===========================================
app.post("/donate", async (req, res) => {

    try {

        const {
            firstName,
            lastName,
            email,
            amount,
            paymentMethod
        } = req.body;

        if (
            !firstName ||
            !lastName ||
            !email ||
            !amount ||
            !paymentMethod
        ) {

            return res.status(400).json({
                success:false,
                message:"All fields are required."
            });

        }

        const donation = await Donation.create({
            firstName,
            lastName,
            email,
            amount,
            paymentMethod
        });

        const pdfPath = path.join(
            __dirname,
            "uploads",
            `donation_${donation._id}.pdf`
        );

        const doc = new PDFDocument();

        doc.pipe(fs.createWriteStream(pdfPath));

        doc.fontSize(22).text("Donation Receipt", {
            align:"center"
        });

        doc.moveDown();

        doc.fontSize(14).text(`Name : ${firstName} ${lastName}`);
        doc.text(`Email : ${email}`);
        doc.text(`Amount : ₹${amount}`);
        doc.text(`Payment : ${paymentMethod}`);
        doc.text(`Date : ${donation.date}`);

        doc.end();

        return res.status(201).json({

            success:true,
            message:"Donation recorded successfully.",

            downloadUrl:`/download/${donation._id}`

        });

    } catch (error) {

        console.error("Donation Error:", error);

        return res.status(500).json({

            success:false,
            message:"Unable to process donation."

        });

    }

});


// ===========================================
// Download Receipt
// ===========================================
app.get("/download/:id", (req, res) => {

    const pdfPath = path.join(
        __dirname,
        "uploads",
        `donation_${req.params.id}.pdf`
    );

    if (!fs.existsSync(pdfPath)) {

        return res.status(404).json({

            success:false,
            message:"Receipt not found."

        });

    }

    return res.download(pdfPath);

});


// ===========================================
// Start Server
// ===========================================
app.listen(port, () => {

    console.log("======================================");
    console.log(`🚀 Server Running`);
    console.log(`🌐 http://localhost:${port}`);
    console.log("======================================");

});


