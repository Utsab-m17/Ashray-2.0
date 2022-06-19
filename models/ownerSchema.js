const mongoose = require('mongoose')
const schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ownerSchema = new schema({
    address:{
        type: String,
        unique: true,
        required: true
    },city:{
        type: String,
        required: true
    },pincode:{
        type: Number,
        required: true
    },landmark:{
        type: String,
        required: true
    },district:{
        type: String,
        required: true
    },roomNumbers:{
        type: Number,
        required: true
    },price:{
        type: Number,
        required: true
    },userID:{
        type: Object,
        required: true
    }
})






//----------------- Token generation -------------------

// ownerSchema.methods.generateAuthToken = async function(){
//     try {

//         console.log(this._id);
//         const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
//         this.tokens = this.tokens.concat({token: token});
//         await this.save();
//         return token;

//     } catch (error) {

//         res.send("the error part - "+ error);
//         console.log("the error part - "+ error);

//     }
// }




module.exports = mongoose.model('Registerowner', ownerSchema);