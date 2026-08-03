# 🎓 Alumni Management System

A full-stack web application that helps educational institutions connect students, alumni, and faculty through networking, mentorship, job opportunities, event management, and donations.

The project is built using **Node.js**, **Express.js**, **MongoDB**, and **Vanilla HTML/CSS/JavaScript** following a modular backend architecture.

---

## 🚀 Features

### 👤 Authentication
- User Registration
- User Login
- Password Hashing using BCrypt
- JWT Authentication
- Cookie-based Session Management

### 🎉 Event Management
- Create Events
- View Upcoming Events
- Register for Events

### 🤝 Networking & Career
- Alumni Search by Location
- Mentor Registration
- Mentor Directory
- Job Posting
- Job Listings
- Job Application

### ❤️ Donations
- Donation Form
- Donation Receipt Generation
- PDF Receipt Download
- MongoDB Storage

---

# 🛠 Tech Stack

## Frontend
- HTML5
- CSS3
- JavaScript (ES6)

## Backend
- Node.js
- Express.js

## Database
- MongoDB Atlas
- Mongoose

## Authentication
- JSON Web Token (JWT)
- BCrypt
- Cookie Parser

## Other Libraries
- Helmet
- CORS
- PDFKit
- Multer
- Dotenv

---

# 📂 Project Structure

```
Alumni-Management-System/
│
├── client/
│   ├── css/
│   ├── images/
│   ├── js/
│   └── pages/
│
├── server/
│   ├── config/
│   │   └── database.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   └── apiAuth.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Mentor.js
│   │   ├── Job.js
│   │   └── Donation.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── events.js
│   │   ├── jobs.js
│   │   ├── mentors.js
│   │   ├── donations.js
│   │   └── search.js
│   │
│   ├── uploads/
│   ├── package.json
│   └── server.js
│
├── .env
├── package.json
└── README.md
```

---

# ⚙ Installation

Clone the repository

```bash
git clone https://github.com/<your-github-username>/Alumni-Management-System.git
```

Move into the project

```bash
cd Alumni-Management-System
```

Install server dependencies

```bash
cd server
npm install
```

Create a `.env` file

```env
PORT=2501

MONGODB_URL=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

Start the server

```bash
npm start
```

Open

```
http://localhost:2501
```

---

# 🔑 Main Modules

## Authentication
- Signup
- Login
- JWT Token Generation
- Protected Routes

## Events
- Create Event
- View Events
- Register for Event

## Networking
- Mentor Registration
- Mentor Directory
- Alumni Search

## Jobs
- Post Jobs
- Browse Jobs
- Apply for Jobs

## Donations
- Donate
- Generate PDF Receipt
- Download Receipt

---

# 🔒 Security

- Password hashing using BCrypt
- JWT Authentication
- HTTP Security Headers using Helmet
- Cookie-based Authentication
- Environment Variables using Dotenv

---

# 📸 Screenshots

Add screenshots of:

- Home Page
- Login
- Signup
- Events
- Mentorship
- Jobs
- Donations

---

# 🔮 Future Improvements

- Role-Based Access Control
- Admin Dashboard
- Email Notifications
- Forgot Password
- Profile Management
- File Upload Improvements
- Swagger API Documentation
- Unit Testing
- Docker Deployment

---

# 👨‍💻 Author

**Harish Thakre**

Bachelor of Engineering (Information Technology)

Pune, Maharashtra

GitHub: https://github.com/harish03b