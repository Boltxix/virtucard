import express from "express"
import { addEvent, deleteEvent, getEvent, getEvents } from "../controllers/event.js"

const router = express.Router()

router.get("/:uid", getEvents)
router.get("/:id", getEvent)
router.post("/", addEvent)
router.delete("/:id", deleteEvent)

export default router