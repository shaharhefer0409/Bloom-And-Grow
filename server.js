const express = require('express');
const nodemailer = require('nodemailer'); // Move this to the top
const app = express();

app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

// 1. SHOW THE FORM
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); 
});

// 2. THE ACTION (Everything happens inside here)
app.post('/send-email', (req, res) => {
    
    // A. Capture the data from the form
    const { fullname, email, phonenumber, choicemade } = req.body;
    
    console.log("I received a submission from:", fullname);

    // B. Setup the Transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'BloomAndGrowService@gmail.com',
            pass: 'acrvnqpvvkcteayf' // Your App Password
        }
    });

    // C. The Email for YOU (Admin)
    const mailToAdmin = {
        from: 'BloomAndGrowService@gmail.com', // Use your bot email
        to: 'BloomAndGrowService@gmail.com',   // Put your real email here to get the alert!
        subject: `New Volunteer: ${fullname}`,
        text: `You have a new sign-up!\n\nName: ${fullname}\nEmail: ${email}\nPhone: ${phonenumber}\nInterested in: ${choicemade}`
    };

    // D. The Email for THE USER (Thank you)
    const mailToUser = {
        from: 'BloomAndGrowService@gmail.com',
        to: email, 
        subject: 'Welcome to the Community Garden!',
        text: `Hi ${fullname},\n\nThank you for joining our volunteer team! We saw you are interested in ${choicemade}. We will contact you soon at ${phonenumber}.`
    };

    // E. Send the Emails
    transporter.sendMail(mailToAdmin, (error, info) => {
        if (error) {
            console.log("Admin mail error: ", error);
            return res.send("<h1>System Error: Could not process registration.</h1>");
        }
        
        // If first mail succeeds, send the second one
        transporter.sendMail(mailToUser, (err, info) => {
            if (err) console.log("User thank-you mail failed: ", err);
            
            // Finally, send ONE response back to the browser
            res.send("<h1>Registration Successful! Check your email.</h1>");
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});