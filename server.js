const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware for parsing JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// File path for storing data
const dataFilePath = path.join(__dirname, 'data.json');

// Load data from the JSON file
function loadData() {
    if (fs.existsSync(dataFilePath)) {
        const data = fs.readFileSync(dataFilePath);
        return JSON.parse(data);
    }
    return { content: '', media: [], bookings: [] }; // Default empty data
}

// Save data to the JSON file
function saveData(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// Public route: Get saved content and media (accessible by everyone)
app.get('/data', (req, res) => {
    const data = loadData();
    res.json(data);
});

// Public route: Save content (anyone can update the content)
app.post('/save-content', (req, res) => {
    const { content } = req.body;
    const data = loadData();
    data.content = content;
    saveData(data);
    res.json({ message: 'Content saved successfully!' });
});

// Public route: Save uploaded media with upload date (anyone can upload media)
app.post('/upload-media', (req, res) => {
    const { mediaFiles } = req.body;
    const data = loadData();
    const uploadDate = new Date().toISOString(); // Store upload date

    mediaFiles.forEach(file => {
        file.uploadDate = uploadDate; // Add upload date to each file
    });

    data.media.push(...mediaFiles); // Add new media files to existing data
    saveData(data);

    res.json({ message: 'Media saved successfully!' });
});

// Public route: Handle booking (accessible by everyone)
app.post('/book', (req, res) => {
    const { name, email, date } = req.body;

    // Here, you can add your Google Calendar integration logic
    // For demonstration purposes, we’ll just log the booking
    console.log(`Booking received: ${name}, ${email}, Date: ${date}`);
    
    const data = loadData();
    data.bookings.push({ name, email, date });
    saveData(data);
    
    res.status(200).json({ message: 'Booking successful!' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
