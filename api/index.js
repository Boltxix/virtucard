//Import require packages and route files
import express from "express";
import userRoutes from "./routes/user.js"
import authRoutes from "./routes/auth.js"
import postRoutes from "./routes/posts.js"
import eventRoutes from "./routes/event.js"
import commentsRoutes from "./routes/comments.js"
import likesRoutes from "./routes/likes.js"
import cookieParser from "cookie-parser";
import multer from "multer";
import cors from "cors";

// Create an instance of the Express server
const app = express()

// Configure CORS settings
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}

// Use middleware packages
app.use(express.json()) // Parse incoming JSON data
app.use(cookieParser()) // Parse cookies
app.use(cors(corsOptions)); // Enable CORS

// Configure storage options for file uploads
const postStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/public/upload/posts')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/public/upload/profiles')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

const eventsStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/public/upload/events')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})


// Create instances of the multer middleware for file uploads
const postUpload = multer({
    storage: postStorage,
    limits: {
        fileSize: 1024 * 1024 * 5, // Limit file size to 5MB
        files: 1 // Limit number of files to 1
    }
})

const profileUpload = multer({
    storage: profileStorage,
    limits: {
        fileSize: 1024 * 1024 * 5, // Limit file size to 5MB
        files: 1 // Limit number of files to 1
    }
})

const eventUpload = multer({
    storage: eventsStorage,
    limits: {
        fieldSize: 1024 * 1024 * 5,  // Limit file size to 5MB
        files: 1 // Limit number of files to 1
    }
})

// Handle file uploads for posts, profiles, and events
app.post('/api/postUpload', postUpload.single('file'), function (req, res) {
    const file = req.file
    res.status(200).json(file.filename)
})

app.post('/api/profileUpload', profileUpload.single('file'), function (req, res) {
    const file = req.file
    res.status(200).json(file.filename)
})
app.post('/api/eventUpload', eventUpload.single('file'), function (req, res) {
    const file = req.file
    res.status(200).json(file.filename)
})

// Handle requests to API endpoints for user authentication, posts, events, comments, and likes
app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/comments", commentsRoutes)
app.use("/api/likes", likesRoutes)

// Start the server and listen on port 8800
app.listen(8800, () => {
})