

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const app = express();
const port = 2501;

// Connect to MongoDB without deprecated options
mongoose.set('debug', true);
mongoose.connect('mongodb://localhost:27017/AluminiDataBase')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Define a route for the root path to serve alumni.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'alumini.html')); // Ensure alumni.html is in the same directory
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

app.get('/signup', (req, res) => {
    console.log(req.body);
    res.sendFile(path.join(__dirname, 'signup.html')); // Adjust path as needed
});

app.post('/signup', async (req, res) => {
    console.log('Incoming request data:', req.body); // Log incoming data

    const { username, password, userType, firstName, lastName, email, address } = req.body;

    if (req.body.password !== req.body['confirm-password']) {
        return res.status(400).send('Passwords do not match.');
    }

    const newUser = new User({
        username,
        password,
        userType,
        firstName,
        lastName,
        email,
        address,
    });

    try {
        const savedUser = await newUser.save();
        console.log('User saved:', savedUser); // Log saved user
        res.redirect('alumini.html').alert("singup Successfully");
    } catch (error) {
        console.error('Error saving user:', error); // Log the entire error
        if (error.code === 11000) {
            // Duplicate key error
            return res.status(400).send('Username or email already exists.');
        }
        res.status(500).send('Error saving user to the database.');
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Log the received username and password for debugging
        console.log(`Login attempt: username=${username}`);

        // Check if both username and password are provided
        if (!username || !password) {
            return res.status(400).send('Both username and password are required');
        }

        // Find the user by username
        const user = await User.findOne({ username,password});
        if (!user) {
            console.log(`Login failed: user not found - username=${username}`);
            return res.status(400).send('Invalid username or password');
        }

        // Compare the hashed password
        //const isMatch = await bcrypt.compare(password, user.password);
        if (password!==user.password)
        {
            console.log(`Login failed: incorrect password - username=${username}`);
            return res.status(400).send('Invalid username or password');
        }
        console.log(password);
        console.log(user.password);
        //console.log(isMatch);
        // if (!isMatch) {
        //     console.log(`Login failed: incorrect password - username=${username}`);
        //     return res.status(400).send('Invalid username or password');
        // }

        // If login is successful
        console.log(`Login successful: username=${username}`);
        res.redirect('/alumini.html?message=login-success');

    } catch (error) {
        console.error(`Login error: ${error.message}`);
        res.status(500).send('An error occurred while processing the login request');
    }
});
app.post('/search', async (req, res) => {
    const { locationsearch } = req.body;

    if (!locationsearch) {
        return res.status(400).send('Location search term is required.');
    }
    console.log(locationsearch); // Log the search term for debugging

    try {
        // Search for users whose address contains the location search term (case-insensitive)
        const results = await User.find({ address: { $regex: locationsearch, $options: 'i' } });

        if (results.length === 0) {
            return res.status(404).json({ message: 'No users found in the specified location.' });
        }

        res.json(results); // Send the matching users back to the frontend
    } catch (error) {
        console.error('Error searching for users:', error);
        res.status(500).send('Error searching for users.');
    }
});

app.get('/all-users', async (req, res) => {
    try {
        // Only fetch the specified fields
        const users = await User.find({}, 'firstName lastName userType email address');

        // Check if users were found
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found in the database.' });
        }

        // Return the users as JSON
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users.');
    }
});


// Define the mentor schema
const mentorSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phone: String,
    graduationYear: Number,
    expertise: String,
    mentorshipMethod: String,
    availability: String,
    goals: String,
    comments: String,
});

// Create the model for the mentors collection
const Mentor = mongoose.model('Mentor', mentorSchema);

// Route to handle form submission
app.post('/mentors', async (req, res) => {
    const {
        fullName,
        email,
        phone,
        graduationYear,
        expertise,
        mentorshipMethod,
        availability,
        goals,
        comments
    } = req.body;

    try {
        const newMentor = new Mentor({
            fullName,
            email,
            phone,
            graduationYear,
            expertise,
            mentorshipMethod,
            availability,
            goals,
            comments,
        });
        await newMentor.save();
        res.redirect('networking-career-vertical-html%20(1).html');
        res.status(201).json({ message: 'Mentor data saved successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving mentor data', error });
    }
});

app.get('/mentors', async (req, res) => {
    try {
        const mentors = await Mentor.find(); // Fetch all mentors
        res.status(200).json(mentors);       // Send as JSON response
    } catch (error) {
        res.status(500).json({ message: 'Error fetching mentors data', error });
    }
});

// Define Job schema
const jobSchema = new mongoose.Schema({
    jobTitle: { type: String, required: true },
    companyName: { type: String, required: true },
    jobLocation: { type: String, required: true },
    jobDescription: { type: String, required: true },
    qualifications: { type: String, required: true },
    salaryRange: { type: String, required: false },
    contactPerson: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: false },
    postingDuration: { type: Number, required: true },
    companyLogo: { type: String, required: false } // Path to uploaded logo
});

const Job = mongoose.model('Job', jobSchema);

// Serve static files from the same directory
app.use(express.static(path.join(__dirname))); // Serve HTML and CSS

// Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
});
const upload = multer({ storage: storage });

// Body parser middleware for form submissions
app.use(express.urlencoded({ extended: true }));

// API endpoint to handle job form submission
app.post('/postjob', upload.single('company-logo'), async (req, res) => {
    try {
        const { jobTitle, companyName, jobLocation, jobDescription, qualifications, salaryRange, contactPerson, contactEmail, contactPhone, postingDuration } = req.body;

        const newJob = new Job({
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
            companyLogo: req.file ? `/uploads/${req.file.filename}` : null // Save the path to the uploaded file
        });

        await newJob.save(); // Save the new job to the database
        res.status(200).json({ message: 'Job posted successfully' });
        res.redirect('networking-career-vertical-html%20(1).html') // Respond to client
    } catch (error) {
        console.error('Error posting job:', error);
        res.status(500).json({ message: 'Failed to post job' }); // Error handling
    }
});




// API endpoint to fetch all jobs
app.get('/jobs', async (req, res) => {
    try {
        const jobs = await Job.find(); // Fetch all jobs
        res.status(200).json(jobs); // Respond with jobs as JSON
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Failed to fetch jobs' }); // Error handling
    }
});

//create event


// Define Event Schema and Model with explicit collection name 'Create_event'
const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    mode: { type: String, required: true, enum: ['online', 'offline'] },
    date: { type: Date, required: true },
    time: { type: String, required: true }, // Alternatively, use a more specific time type
}, { 
    timestamps: true,
    collection: 'Create_event' // Explicitly specify the collection name
});

const Event = mongoose.model('Event', eventSchema);



// API Endpoint to handle event creation
app.post('/api/events', async (req, res) => {
    try {
        console.log("Received event data:", req.body);

        const { title, type, mode, date, time } = req.body;

        // Validate required fields
        if (!title || !type || !mode || !date || !time) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Create new event
        const newEvent = new Event({
            title,
            type,
            mode,
            date,
            time
        });

        // Save to MongoDB
        const savedEvent = await newEvent.save();
        console.log('Event saved:', savedEvent);

        res.redirect('firsteventpage.html').status(201).json({ message: 'Event created successfully!', event: savedEvent });
    
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Error creating event.', error: error.message });
    }
});

// Optional: API Endpoint to get all events
// server.js
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Error fetching events.', error: error.message });
    }
});


// POST endpoint to register for an event
app.post('/api/events/register', async (req, res) => {
    try {
        const { eventId, userId } = req.body;

        if (!eventId || !userId) {
            return res.status(400).json({ message: 'Event ID and User ID are required.' });
        }

        // Find the event
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        // Check if the user is already registered
        if (event.registrations.includes(userId)) {
            return res.status(400).json({ message: 'User already registered for this event.' });
        }

        // Add the user to registrations
        event.registrations.push(userId);
        await event.save();

        res.status(200).json({ message: 'Successfully registered for the event.' });
    } catch (error) {
        console.error('Error registering for event:', error);
        res.status(500).json({ message: 'Error registering for event.', error: error.message });
    }
});

//donations



// Define the Donation schema and model
const donationSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const Donation = mongoose.model('Donation', donationSchema);

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));


// POST route to save donor information and generate a PDF
app.post('/donate', async (req, res) => {
    try {
        const { firstName, lastName, email, amount, paymentMethod } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !amount || !paymentMethod) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new donation entry
        const newDonation = new Donation({
            firstName,
            lastName,
            email,
            amount,
            paymentMethod
        });

        await newDonation.save(); // Save the donation to MongoDB

        // Generate PDF
        const doc = new PDFDocument();
        const filePath = path.join(__dirname, `donation_${newDonation._id}.pdf`);
        
        doc.pipe(fs.createWriteStream(filePath));  // Save PDF to a file

        doc.fontSize(25).text('Donation Receipt', { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(`Donor Name: ${firstName} ${lastName}`);
        doc.text(`Email: ${email}`);
        doc.text(`Amount: ₹${amount}`);
        doc.text(`Payment Method: ${paymentMethod}`);
        doc.text(`Date: ${newDonation.date}`);
        
        doc.end();  // Finalize the PDF and save

        // Send a response that the donation was successful
        res.status(201).json({
            message: 'Donation successful! PDF generated.',
            pdfPath: `/download/${newDonation._id}`
        });
        
    } catch (error) {
        console.error('Error saving donation or generating PDF:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// GET route to download the PDF
app.get('/download/:id', (req, res) => {
    const pdfPath = path.join(__dirname, 'public', `donation_${req.params.id}.pdf`);
    
    if (fs.existsSync(pdfPath)) {
        res.download(pdfPath, `donation_${req.params.id}.pdf`);  // Download the PDF
    } else {
        res.status(404).json({ message: 'PDF not found' });
    }
});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});


