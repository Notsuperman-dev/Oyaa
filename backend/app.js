// backend/app.js

const express = require('express');
const path = require('path');
const multer = require('multer');
const dotenv = require('dotenv');
const sessionMiddleware = require('./config/session');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const worldChatRoutes = require('./routes/worldChatRoutes');
const roomRoutes = require('./routes/roomRoutes');
const trendingRoutes = require('./routes/trendingRoutes');
const leaderboardRouter = require('./routes/leaderboard');
const fs = require('fs');
const { Sequelize, DataTypes } = require('sequelize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, 
    legacyHeaders: false,
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend')));

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'uploads.db')
});

const UploadedImage = sequelize.define('UploadedImage', {
    filePath: {
        type: DataTypes.STRING,
        allowNull: false
    },
    uploadedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
});

sequelize.sync({ force: false })
    .then(() => {
        console.log('UploadedImage table has been created.');
    })
    .catch(err => {
        console.error('Error syncing with the database:', err);
    });

app.set('UploadedImage', UploadedImage);

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        const dir = path.join(__dirname, '../uploads/images');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

app.post('/upload-image', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/images/${req.file.filename}`;
    const uploadTime = new Date();
    const deleteTime = new Date(uploadTime.getTime() + 90 * 60 * 1000);

    try {
        const UploadedImage = req.app.get('UploadedImage');
        await UploadedImage.create({ filePath: fileUrl });

        console.log(`File uploaded: ${req.file.filename}`);
        console.log(`Uploaded at: ${uploadTime}`);
        console.log(`Scheduled for deletion at: ${deleteTime}`);

        res.json({ success: true, fileUrl });
    } catch (error) {
        console.error('Error saving uploaded file info:', error);
        res.status(500).json({ success: false, message: 'Error saving file info' });
    }
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/world-chat', worldChatRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/trending', trendingRoutes);
app.use('/api/leaderboard', leaderboardRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/auth/landing.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/auth/signup.html'));
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/auth/signin.html'));
});

app.get('/mainmenu', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/mainmenu/mainmenu.html'));
});

app.get('/worldchat', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/worldchat/worldchat.html'));
});

app.get('/createroom', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/funRooms/createroom.html'));
});

app.get('/joinroom', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/funRooms/joinroom.html'));
});

app.get('/trending', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/funRooms/trending.html'));
});

app.get('/chatrooms', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/funRooms/chatrooms.html'));
});

app.get('/MyGroup', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/funRooms/MyGroup.html'));
});

app.get('/Leaderboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/funRooms/Leaderboard.html'));
});

app.get('/friends', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/funRooms/friends.html'));
});

app.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/settings/settings.html'));
});

app.get('/bio', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/settings/bio.html'));
});

app.get('/Kinship', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/settings/Kinship.html'));
});

app.get('/blocked-users', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/settings/blocked-users.html'));
});

app.get('/blacklist', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/settings/blacklist.html'));
});

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, '../frontend/html/404.html'));
});

module.exports = app;
