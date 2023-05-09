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


const app = express()

app.use(express.json())
app.use(cookieParser())
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
    filename: function(req,file,cb){
        cb(null, Date.now()+file.originalname)
    }
})



const postUpload = multer({ 
    storage: postStorage,
    limits: {
        fileSize: 1024 * 1024 * 5,
        files: 1
    }
})

const profileUpload = multer({ 
    storage: profileStorage,
    limits: {
        fileSize: 1024 * 1024 * 5,
        files: 1
    }
})

const eventUpload = multer({
    storage: eventsStorage,
    limits:{
        fieldSize:1024 * 1024 * 5,
        files:1
    }
})


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



app.use(cors({
    origin: "http://localhost:3000"
  }));

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/comments", commentsRoutes)
app.use("/api/likes", likesRoutes)




app.listen(8800, () => {
    console.log("Connected!")
})