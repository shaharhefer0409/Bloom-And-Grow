require('dotenv').config();
const express = require('express');
const emailjs = require('@emailjs/nodejs'); // Import the new library
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

const PORT = 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); 
});

app.post('/api/server', async (req, res) => {
    const { fullname, email, phonenumber, choicemade } = req.body;
    console.log("Processing submission for:", fullname);

    // Initialize EmailJS with your keys
    emailjs.init({
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY, 
    });

    // These params MUST match the {{variables}} in your EmailJS templates
    const templateParams = {
        fullname: fullname,
        email: email,
        phonenumber: phonenumber,
        choicemade: choicemade
    };

    try {
        // --- EMAIL 1: Send to Admin (You) ---
        await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_ADMIN_TEMPLATE_ID, // Use the Admin Template ID
            templateParams
        );
        console.log("✅ Admin email sent successfully");

        // --- EMAIL 2: Send to User (The Volunteer) ---
        // Note: For this to work, make sure your User Template has 'To Email' set to {{email}}
        await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_USER_TEMPLATE_ID, // Use the User/Welcome Template ID
            templateParams
        );
        console.log("✅ User email sent successfully");

        res.status(200).json({ success: true, message: "Emails sent successfully!" });

    } catch (error) {
        console.error("❌ Email failed:", error);
        res.status(500).json({ success: false, message: "Failed to send emails", error });
    }
});

module.exports = app;