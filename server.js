const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Session Configuration
app.use(session({
    secret: 'desco-secret-key-123', // Change this in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Data File Path
const DATA_FILE = path.join(__dirname, 'content.json');

// Helper to read data
const getContent = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading content.json:", err);
        return {};
    }
};

// Auth Middleware
const requireAuth = (req, res, next) => {
    if (req.session && req.session.isAuthenticated) {
        return next();
    }
    res.redirect('/login');
};

// Routes

// 1. Homepage (Public)
app.get('/', (req, res) => {
    const content = getContent();
    res.render('index', { content });
});

// 2. Login Page
app.get('/login', (req, res) => {
    if (req.session.isAuthenticated) {
        return res.redirect('/admin');
    }
    res.render('login');
});

// 3. Admin Dashboard (Protected)
app.get('/admin', requireAuth, (req, res) => {
    const content = getContent();
    res.render('admin', { content });
});

// 4. API Login
app.post('/api/login', (req, res) => {
    const { pin } = req.body;
    const content = getContent();
    const correctPin = content.security ? content.security.pin : "12345"; // Default if not set

    if (pin === correctPin) {
        req.session.isAuthenticated = true;
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Incorrect PIN' });
    }
});

// 5. API to Save Content
app.post('/api/save', requireAuth, (req, res) => {
    const newContent = req.body;
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(newContent, null, 2));
        res.json({ success: true, message: 'Content updated successfully!' });
    } catch (err) {
        console.error("Error writing content.json:", err);
        res.status(500).json({ success: false, message: 'Failed to save content.' });
    }
});

// 4. 404 Handler
app.use((req, res) => {
    const content = getContent();
    res.status(404).render('404', { content });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
