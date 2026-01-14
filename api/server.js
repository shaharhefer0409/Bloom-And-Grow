require('dotenv').config();
const express = require('express');
const emailjs = require('@emailjs/nodejs'); // <--- New Library
const app = express();
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Ensure we can parse JSON bodies

// NOTE: Vercel usually handles the port automatically
const PORT = 3000;

// Initialize EmailJS with your keys from .env
emailjs.init({
    publicKey: process.env.EMAILJS_PUBLIC_KEY,
    privateKey: process.env.EMAILJS_PRIVATE_KEY, 
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); 
});

app.post('/api/server', async (req, res) => {
    
    // 1. Get the data exactly like before
    const { fullname, email, phonenumber, choicemade } = req.body;
    
    console.log("I received a submission from:", fullname);

    // 2. Bundle the data to send to your EmailJS templates
    // These names (fullname, email, etc.) must match the {{variables}} in your templates
    const templateParams = {
        fullname: fullname,
        email: email,
        phonenumber: phonenumber,
        choicemade: choicemade
    };

    try {
        // --- EMAIL 1: Send to Admin (You) ---
        // Uses the specific "Admin" template ID you created
        await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_ADMIN_TEMPLATE_ID, 
            templateParams
        );
        console.log("✅ Admin email sent successfully");

        // --- EMAIL 2: Send to User (The Volunteer) ---
        // Uses the "User/Welcome" template ID
        // Note: Ensure this template is set to send 'To Email': {{email}} in the dashboard
        await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_USER_TEMPLATE_ID,
            templateParams
        );
        console.log("✅ User email sent successfully");

        // 3. Return the exact same success response
        res.status(200).json({ success: true, message: "Emails sent successfully!" });

    } catch (error) {
        console.error("❌ Email failed:", error);
        // Return the exact same error response structure
        res.status(500).json({ success: false, message: "Failed to send emails", error });
    }
});

module.exports = app;