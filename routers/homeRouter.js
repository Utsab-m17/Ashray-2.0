const express = require("express");
const Router = express.Router();
const homeSchema = require('../models/homeSchema');
const bcrypt = require('bcryptjs');
const auth = require("../middleware/auth");
const store = require("../middleware/multer");
const ownerSchema = require('../models/ownerSchema');
const imageSchema = require('../models/imageSchema');
const fs = require('fs');
const { Promise } = require("mongoose");





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

            console.log("the success part - " + userData);

            const token = await userData.generateAuthToken();
            console.log("the token part - " + token);

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 500000),
                httpOnly: true
            });

            const registered = await userData.save();
            console.log("the page part - " + registered);
            res.status(201).render('home', { main: 'স্বাগতম' });

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
    res.render('login', { title: 'log in here', password: '' });
});

Router.post('/login', async (req, res) => {

    try {
        const {
            email,
            password
        } = req.body;

        const userEmail = await homeSchema.findOne({ email: email });

        const isMatch = await bcrypt.compare(password, userEmail.password);

        const token = await userEmail.generateAuthToken();
        console.log("the token part - " + token);

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 50000000),
            httpOnly: true
        });

        if (isMatch) {
            res.status(201).render('home', { main: 'স্বাগতম' });
        } else {
            res.status(400).render('login', { title: '', password: 'You entered a wrong password!' });
        }
    } catch (error) {
        res.status(400).send("invalid login details");
    }
})





//------------------------- logout -------------------------

Router.get("/logout", auth, async function (req, res) {
    try {

        // req.user.tokens = req.user.tokens.filter((currentElement)=>{
        //     return currentElement.token !== req.token;
        // })

        req.user.tokens = [];

        res.clearCookie("jwt");
        console.log("logout successfully.");

        await req.user.save();
        res.render('login', { title: 'log in here', password: '' });

    } catch (error) {
        res.status(500).send(error);
    }
});








//--------------------- Forgot-password ---------------------

Router.get("/forget", function (req, res, next) {
    res.render('forget', { title: 'Please enter your registered email-id'});
});

Router.post("/forget", (res, req, next) => {
    // try {
    const {
        email
    } = req.body;

    res.send(email);
    // const userEmail = await homeSchema.findOne({ email: email });
    // if (email !== user.email) {
    //     res.send('This user is not registered yet.');
    //     return;
    // }
    // } catch (error) {
    //     res.send("invalid login details");
    // }
})







//------------------------ home-page --------------------------

Router.get("/", function (req, res) {
    res.render('home', { main: 'স্বাগতম' });
});





//----------------------  owner-page ---------------------------
Router.get("/owner", function (req, res) {
    res.render('owner', { title: 'Add details about your property', price: ''});
});

Router.post('/owner', async (req, res) => {
    try {
        const address = req.body.address;
        const city = req.body.city;
        const pincode = req.body.pincode;
        const landmark = req.body.landmark;
        const district = req.body.district;
        const roomNumbers = req.body.roomNumbers;
        const price = req.body.price;
    

        

        if(price>0){
            const ownerData = new ownerSchema({
                    address,
                    city,
                    pincode,
                    landmark,
                    district,
                    roomNumbers,
                    price
                })
            
                ownerData.save(err=>{
                    if(err){
                        res.render('owner', { title:"", price: "You have already registered a property on this address."});
                    }else{
                        res.render('image', { title: 'Add images for your property'});
                    }
                })

        }else{
            res.render('owner', { title:"", price: "price can't be zero."});

        }
        
    
            // console.log("the success part - " + ownerData);
    
            // const token = await userData.generateAuthToken();
            // console.log("the token part - " + token);
    
            // res.cookie("jwt", token, {
            //     expires: new Date(Date.now() + 500000),
            //     httpOnly: true
            // });
    
        //     const registered = await ownerData.save();
        //     console.log("the page part - " + registered);
        //     res.status(201).render('image', { title: 'Add images for your property'});
        // }else{
        //     res.status(400).render('owner', { title: 'price is higher'});
        // }
    } catch (error) {
        res.render('owner', { title: 'Error in Code', price: ''});
    }
})



//----------------------- image-page --------------------------

Router.get("/image", function (req, res) {
    res.render('image', { title: 'Add images for your property'});
});

Router.post("/image", store.array('images', 12), (req, res, next) => {

    const files = req.files;

    if (!files) {
        const error = new Error('Please choose images');
        error.httpStatusCode = 400;
        return next(error);
    }


    // converting images into base64 encoding
    const imgArray = files.map((file) => {
        const img = fs.readFileSync(file.path)

        return encode_image = img.toString('base64');
    })



    const result = imgArray.map((src, index) => {
            const finalimg = {
                filename: files[index].originalname,
                contentType: files[index].mimetype,
                imageBase64: src
            }
            const newUpload = new imageSchema(finalimg);

            return newUpload
                .save()
                .then(() => {
                    return { msg: `${files[index].originalname} uploaded successfully...!` }
                })
                .catch(error => {
                                if (error) {
                                    if (error.name === 'MongoError' && error.code === 11000) {
                                        return Promise.reject({ error: `Duplicate ${files[index].originalname}. File already exists!` })
                                    }
                                    return Promise.reject({ error: error.massage || `Cannot Upload ${files[index].originalname} something is missing!` })
                                }
                });
        });

    Promise.all(result)
       .then(msg =>{
        res.redirect('/')
        // res.json(msg)
       })
       .catch(err =>{
        res.json(err)
       })
});
        
        

    




//---------------------- display-page ------------------------

Router.get("/display", async function (req, res) {
    const all_images = await imageSchema.find()
    const all_owners = await ownerSchema.find()
    // console.log(all_owners)
    res.render('display', { images: all_images, price: all_owners.price, city: all_owners.city, roomNumbers: all_owners.roomNumbers });
});






//----------------------- about-page --------------------------

Router.get("/about", function (req, res) {
    res.render('about');
});




module.exports = Router;