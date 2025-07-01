

// Middleware
app.use(cors());
app.use(bodyParser.json()); // To parse JSON request bodies

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/alumni', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Event Model
const Event = mongoose.model('Event', new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    mode: { type: String, required: true },
    date: { type: String, required: true },  // For simplicity, storing as string
    time: { type: String, required: true }   // Storing as string (HH:MM format)
}));

// POST endpoint to create an event
app.post('/api/events', async (req, res) => {
    try {
        console.log("Received request to create event:", req.body); // Log incoming data

        const { title, type, mode, date, time } = req.body;

        // Validate request body
        if (!title || !type || !mode || !date || !time) {
            console.error("Validation Error: Missing required fields"); // Log validation error
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Create and save new event to database
        const newEvent = new Event({ title, type, mode, date, time });
        await newEvent.save();  // Save the event to MongoDB

        console.log("Event saved successfully:", newEvent);  // Log success
        return res.status(201).json({ message: 'Event created successfully!' });
    } catch (error) {
        console.error('Error creating event:', error); // Log any errors
        return res.status(500).json({ message: 'Error creating event' });
    }
});


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// GET endpoint to fetch all events
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find();  // Fetch all events from MongoDB
        return res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        return res.status(500).json({ message: 'Error fetching events' });
    }
});

