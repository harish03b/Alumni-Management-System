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

// Backward-compatible legacy asset routes for deployed relative links
const legacyAssets = [
    ["/style.css", "/css/style.css"],
    ["/login.css", "/css/login.css"],
    ["/signup.css", "/css/signup.css"],
    ["/firsteventpage.css", "/css/firsteventpage.css"],
    ["/upcome.css", "/css/upcome.css"],
    ["/styles.css", "/css/styles.css"],
    ["/network.css", "/css/network.css"],
    ["/job-application-form-css.css", "/css/job-application-form-css.css"],
    ["/job-posting-form-css.css", "/css/job-posting-form-css.css"],
    ["/location-search-form-css.css", "/css/location-search-form-css.css"],
    ["/mentorship-form-css.css", "/css/mentorship-form-css.css"],
    ["/mentors.css", "/css/mentors.css"],
    ["/login_singup.js", "/js/login_singup.js"],
    ["/script1.js", "/js/script1.js"],
    ["/script2.js", "/js/script2.js"],
    ["/jobs.js", "/js/jobs.js"],
    ["/popup.js", "/js/popup.js"],
    ["/fetch_events.js", "/js/fetch_events.js"],
    ["/createevent.js", "/js/createevent.js"],
    ["/User_Profile.png", "/images/User_Profile.png"],
    ["/user-management.png", "/images/user-management.png"],
    ["/Network-People-PNG-File.png", "/images/Network-People-PNG-File.png"],
    ["/Events_Management.png", "/images/Events_Management.png"],
    ["/Donation.png", "/images/Donation.png"],
    ["/create2.webp", "/images/create2.webp"],
    ["/up.webp", "/images/up.webp"]
];

legacyAssets.forEach(([from, to]) => {
    app.get(from, (req, res) => res.redirect(301, to));
});

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
    res.sendFile(path.join(clientPath, "pages", "alumini.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(clientPath, "pages", "login.html"));
});

app.get("/signup", (req, res) => {
    res.sendFile(path.join(clientPath, "pages", "signup.html"));
});

app.get("/events", (req, res) => {
    res.sendFile(path.join(clientPath, "pages", "firsteventpage.html"));
});

app.get("/network", (req, res) => {
    res.sendFile(path.join(clientPath, "pages", "network.html"));
});

app.get("/networking-career-vertical-html (1).html", (req, res) => {
    res.sendFile(path.join(clientPath, "pages", "network.html"));
});

app.get("/networking-career-vertical-html%20(1).html", (req, res) => {
    res.sendFile(path.join(clientPath, "pages", "network.html"));
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
