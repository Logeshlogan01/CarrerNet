// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import path from "path";
import nodemailer from "nodemailer";
import { google } from "googleapis";

// 👇 Modular Imports
import { protect } from "./middleware/authMiddleware.js";
import userRoutes from "./Routes/userRoutes.js";
import eventRoutes from "./Routes/eventsRoutes.js";
import scholarshipRoutes from "./Routes/scholarshipRoutes.js";
import feedRoutes from "./Routes/feedRoutes.js";
import recommendationsRoutes from "./Routes/recommendations.js";

import User from "./models/User.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); // Serve uploaded files

// ✅ Use the recommendation route
app.use("/api/recommendations", recommendationsRoutes);

app.use("/api/feeds", feedRoutes);

/* ==========================
   Multer Setup
========================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

/* ==========================
   MongoDB Connection
========================== */
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

/* ==========================
   Routes
========================== */
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/scholarships", scholarshipRoutes);

app.get("/api/dashboard", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("name email");
    res.json({ msg: `Welcome ${user.name}, this is your dashboard.`, user });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ==========================
   Email Notifications
========================== */
app.post("/api/notify", async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
    res.json({ msg: "✅ Notification sent successfully!" });
  } catch (err) {
    console.error("Notification Error:", err);
    res.status(500).json({ msg: "Failed to send email" });
  }
});

/* ==========================
   Google Calendar
========================== */
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

app.post("/api/calendar/add", async (req, res) => {
  try {
    const { summary, description, startTime, endTime } = req.body;

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    const event = {
      summary,
      description,
      start: { dateTime: startTime, timeZone: "Asia/Kolkata" },
      end: { dateTime: endTime, timeZone: "Asia/Kolkata" },
    };

    await calendar.events.insert({ calendarId: "primary", resource: event });
    res.json({ msg: "✅ Event added to Google Calendar!" });
  } catch (err) {
    console.error("Google Calendar Error:", err);
    res.status(500).json({ msg: "Failed to add event to calendar" });
  }
});

/* ==========================
   Start Server
========================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
