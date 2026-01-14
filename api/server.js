const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.urlencoded({ extended: true }));

const PORT = 3000;


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); 
});


app.post('/send-email', (req, res) => {
    

    const { fullname, email, phonenumber, choicemade } = req.body;
    
    console.log("I received a submission from:", fullname);

 
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'BloomAndGrowService@gmail.com',
            pass: 'acrvnqpvvkcteayf' 
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
            return res.send("<h1>System Error: Could not process registration.</h1>");
        }
        

        transporter.sendMail(mailToUser, (err, info) => {
            if (err) console.log("User thank-you mail failed: ", err);
            

            res.send("<h1>Registration Successful! Check your email.</h1>");
        });
    });
});



module.exports = app;