const mongoose = require('mongoose')
const schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new schema({
    firstName:{
        type: String,
        required: true
    },lastName:{
        type: String,
        required: true
    },email:{
        type: String,
        unique: true,
        required: true
    },number:{
        type: Number,
        required: true
    },employibility:{
        type: String,
        required: true
    },password:{
        type: String,
        required: true
    },tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
})




//----------------- Token generation -------------------

userSchema.methods.generateAuthToken = async function(){
    try {

        console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token: token});
        await this.save();
        return token;

    } catch (error) {

        res.send("the error part - "+ error);
        console.log("the error part - "+ error);

    }
}




//------------------ Password hashing -------------------

userSchema.pre("save", async function(next){

    if(this.isModified("password")){
        
        this.password = await bcrypt.hash(this.password, 10);

    }
    
    next();
})


module.exports = mongoose.model('Registeruser', userSchema);