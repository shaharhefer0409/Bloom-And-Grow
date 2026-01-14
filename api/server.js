require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const path = require('path');
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); 
});


app.post('/api/server', (req, res) => {
    

    const { fullname, email, phonenumber, choicemade } = req.body;
    
    console.log("I received a submission from:", fullname);

 
    const transporter = nodemailer.createTransport({
        service: 'gmail',
auth: {
    user: 'BloomAndGrowService@gmail.com',
    pass: process.env.GMAIL_PASS // <--- SAFE!
}
    });


    const mailToAdmin = {
        from: 'BloomAndGrowService@gmail.com', 
        to: 'BloomAndGrowService@gmail.com',   
        subject: `New Volunteer: ${fullname}`,
        text: `You have a new sign-up!\n\nName: ${fullname}\nEmail: ${email}\nPhone: ${phonenumber}\nInterested in: ${choicemade}`
    };


    const mailToUser = {
        from: 'BloomAndGrowService@gmail.com',
        to: email, 
        subject: 'Welcome to the Community Garden!',
        text: `Hi ${fullname},\n\nThank you for joining our volunteer team! We saw you are interested in ${choicemade}. We will contact you soon at ${phonenumber}.`
    };



    transporter.sendMail(mailToAdmin, (error, info) => {
        if (error) {
            console.log("Admin mail error: ", error);

            return res.status(500).json({ success: false, message: "Admin mail failed" });
        }
        
        transporter.sendMail(mailToUser, (err, info) => {
            if (err) {
                console.log("User mail error: ", err);

                return res.status(500).json({ success: false, message: "User mail failed" });
            }
            

            res.status(200).json({ success: true, message: "Email sent!" });
        });
    });
});



module.exports = app;