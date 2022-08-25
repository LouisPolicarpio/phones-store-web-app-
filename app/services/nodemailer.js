let nodemailer = require("nodemailer");
require('dotenv').config();

let user = process.env.USER
let pass = process.env.PASSWORD

let transport = nodemailer.createTransport({
    service: "outlook",
    auth: {
        user: user,
        pass: pass,
    },
});


module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
    console.log("Check");
    console.log("USER: " + user);
    transport.sendMail({
        from: user,
        to: email,
        subject: "Please confirm your account",
        html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=http://localhost:3000/confirm/${confirmationCode}> Click here</a>
        </div>`,
    }).catch(err => console.log(err));
};


module.exports.resetPassword = (email) => {
    transport.sendMail({
        from: user,
        to: email,
        subject: "Reset your password",
        html: `<h1>Reset Password confirmation</h1>
        <h2>Hello</h2>
        <p>Please click the link below to reset your password</p>
        <a href=http://localhost:3000/reset/${email}> Click here</a>
        </div>`,
    }).catch(err => console.log(err));
}