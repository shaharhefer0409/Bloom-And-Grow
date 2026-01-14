require('dotenv').config();
const express = require('express');
const { Resend } = require('resend'); // Changed from nodemailer
const app = express();
const path = require('path');

// Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(express.urlencoded({ extended: true }));

// NOTE: Vercel usually handles the port automatically, 
// but keeping this for local testing is fine.
const PORT = 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); 
});

// We added 'async' here to allow waiting for the emails to send
app.post('/api/server', async (req, res) => {
    
    const { fullname, email, phonenumber, choicemade } = req.body;
    
    console.log("I received a submission from:", fullname);

    try {
        // --- EMAIL 1: Send to Admin (You) ---
        await resend.emails.send({
            from: 'onboarding@resend.dev', // Must use this on Free Tier (or your verified domain)
            to: 'BloomAndGrowService@gmail.com', 
            reply_to: email, // <--- CRITICAL: Allows you to hit 'Reply' and email the volunteer
            subject: `New Volunteer: ${fullname}`,
            text: `You have a new sign-up!\n\nName: ${fullname}\nEmail: ${email}\nPhone: ${phonenumber}\nInterested in: ${choicemade}`
        });

        // --- EMAIL 2: Send to User (The Volunteer) ---
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email, 
            subject: 'Welcome to the Community Garden!',
            text: `Hi ${fullname},\n\nThank you for joining our volunteer team! We saw you are interested in ${choicemade}. We will contact you soon at ${phonenumber}.`
        });

        // If we get here, both emails worked
        res.status(200).json({ success: true, message: "Emails sent successfully!" });

    } catch (error) {
        console.error("Email sending error:", error);
        res.status(500).json({ success: false, message: "Failed to send emails", error: error.message });
    }
});

module.exports = app;