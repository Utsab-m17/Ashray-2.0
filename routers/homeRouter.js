const express = require("express");
const Router = express.Router();
const homeSchema = require('../models/homeSchema')
const bcrypt = require('bcryptjs');



//----------------------- signup -----------------------

Router.get("/signup", function (req, res) {
    res.render('signup', { title: 'Register here', password: '', email: '' });
});

Router.post('/signup', async (req, res) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const number = req.body.number;
        const employibility = req.body.employibility;
        const password = req.body.password;
        const cPassword = req.body.cPassword;


        if (password === cPassword) {
            const userData = new homeSchema({
                firstName,
                lastName,
                email,
                number,
                employibility,
                password
            })

            console.log("the success part - "+ userData);

            const token = await userData.generateAuthToken();
            console.log("the token part - "+ token);

            const registered = await userData.save();
            console.log("the page part - "+ registered);
            res.status(201).render('home',{main: 'স্বাগতম'});

            // userData.save(err => {
            //     if (err) {
            //         console.log("err")
            //     } else {
            //         res.render('home',{main: 'স্বাগতম'});
            //     }
            // })

            const userEmail = await homeSchema.findOne({ email: email });
            if (email === userEmail.email) {
                res.render('signup', { title: '', password: '', email: 'This email is already in use!' });
            } else {
                console.log("err");
            }

        } else {
            res.render('signup', { title: '', password: 'Password is not matching!', email: '' });
        }

    } catch (error) {

        res.render('signup', { title: 'Error in Code', password: '', email: '' });
    }
})





// -------------------- login ---------------------

Router.get("/login", function (req, res) {
    res.render('login', { title: 'log in here', password: ''});
});

Router.post('/login', async(req, res)=>{

    try{
        const{
                email,
                password
            } = req.body;

        const userEmail = await homeSchema.findOne({email:email});

        const isMatch = await bcrypt.compare(password, userEmail.password);

        const token = await userEmail.generateAuthToken();
        console.log("the token part - "+ token);

        if(isMatch){
            res.status(201).render('home',{main: 'স্বাগতম'});
        }else{
            res.status(400).render('login', { title: '', password: 'You entered a wrong password!'});
        }
    }catch(error){
        res.status(400).send("invalid login details");
    }
})






//--------------------- Forget-password ---------------------

Router.get("/forget", function (req, res) {
    res.render('forget', { title: 'Please enter your registered email-id', password: '', email: '' });
});






//------------------------ home-page --------------------------

Router.get("/", function (req, res) {
    res.render('home', {main: 'স্বাগতম'});
});

module.exports = Router;