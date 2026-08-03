require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const path = require("path");

const connectDB = require("./config/database");

const authRoutes = require("./routes/auth");
const jobsRoutes = require("./routes/jobs");
const eventRoutes = require("./routes/events");
const mentorRoutes = require("./routes/mentors");
const donationRoutes = require("./routes/donations");
const searchRoutes = require("./routes/search");

const app = express();

const port = process.env.PORT || 2501;


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

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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

app.use("/", authRoutes);
app.use("/", jobsRoutes);
app.use("/", eventRoutes);
app.use("/", mentorRoutes);
app.use("/", donationRoutes);
app.use("/", searchRoutes);


// ============================================
// Frontend Pages
// ============================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(clientPath, "pages", "alumini.html")
    );

});

app.get("/login", (req, res) => {

    res.sendFile(
        path.join(clientPath, "pages", "login.html")
    );

});

app.get("/signup", (req, res) => {

    res.sendFile(
        path.join(clientPath, "pages", "signup.html")
    );

});

app.get("/events", (req, res) => {

    res.sendFile(
        path.join(clientPath, "pages", "firsteventpage.html")
    );

});


// ============================================
// Start Server
// ============================================

app.listen(port, () => {

    console.log("======================================");
    console.log("🚀 Alumni Management System");
    console.log(`🌐 http://localhost:${port}`);
    console.log("======================================");

});