//sign up checks if user already exists. If not then it creates a new user in the db
//NEED TO ADD: Send an email to the given email to verify. Should notbe able to login before verifying email
let md5 = require("md5");
let mongoose = require("mongoose");
let db = require("../models/database");
let jwt = require("jsonwebtoken");
let nodemailer = require("../services/nodemailer")
let e = require("express");
let User = require("../models/User")

let JWT_SECRET = "odfnbei0rjhnvg0ernbgert34u2-i3-10394-3)(&%*)@#)(y#%)#jh()jrJSEONSOIJNVG0AOVH"


module.exports.signUp = async function (req, res) {

    let firstname = req.query['firstname']
    let lastname = req.query['lastname']
    let password = md5(req.query['password'])
    let email = req.query['email']
    let _id = new mongoose.Types.ObjectId()

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };
    if (!validateEmail(email)) {
        return res.status(400).json({status: "Invalid Email!"})
    }

    //if email is already in use, dont create new user - works
    let userFound = false;
    await db.collection("users").findOne({
        email: email
    })
        .then(r => {
            if (null === r) return;
            userFound = true;
            return res.json({status: 'Email already in use'})
        })

    let token = jwt.sign({email: email, _id: _id}, JWT_SECRET)
    console.log('In sign up, token created. Token: ' + token)

    if (userFound === true) return;
    //else create a new user
    await db.collection("users").insertOne({
        _id: _id,
        firstname: firstname,
        lastname: lastname,
        password: password,
        email: email,
        status: 'Pending',
        confirmationCode: token
    })
    .then(user => {
        nodemailer.sendConfirmationEmail(firstname,email,token)
        return res.json({status: 'Signed up Successfully. Please verify email to login'})
    })
}


module.exports.login = function (req,res) {
    let email = req.query['email']
    let pwd = md5(req.query['password'])

    //check email and pwd
    try {
        db.collection("users").findOne({
            email: email,
            password: pwd,
        })
            .then(user => {
                if (user==null) {
                    res.statusCode = 400;
                    return res.json({status: 'Incorrect email or password'})
                }
                console.log(user)
                if (user.status !== "Active") {
                    res.statusCode = 400;
                    return res.json({status: 'Please verify your email address'})
                }
                let token = jwt.sign(
                    {
                        email: email,
                        _id: user._id
                    },
                    JWT_SECRET,null,null)
                console.log(token)
                res.cookie('token', token);
                return res.json({status: 'Successful login'})
            })
    } catch (err) {
        res.statusCode = 400;
        return res.json({status: 'Incorrect email or password'})
    }

}

module.exports.verifyUser = async function (req,res) {
    await User.findOne(
        {confirmationCode: req.params.confirmationCode},
    )
        .then((user) => {
            if (!user) {
                return res.status(400).render('errorconfirm')
                //return res.status(404).send({ message: "User Not found." });
            }
            user.status = "Active";
            user.save((err) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                } else {
                    res.render('confirmation')
                    //res.status(200).send({message: "Email successfully verified"});
                }
            });
    })
        .catch((e) => console.log("error", e));
}

module.exports.logOut = async function (req, res) {
    res.clearCookie('token')
    res.json({status: "Logged out"})
}

module.exports.resetPassword = async function (req,res) {

    let email = req.query['email']

    try {
        await User.findOne(
            {email: email}
        ).then((user) => {
            if (user === null) {
                return res.status(400).send({message: "Email does not exist"})
            }
            nodemailer.resetPassword(user.email)
            return res.json({status: "Reset password email sent"})
        })
    } catch (e) {
        return res.json({status: "Could not send reset password email", e})

    }
}