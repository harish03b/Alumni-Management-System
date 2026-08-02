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