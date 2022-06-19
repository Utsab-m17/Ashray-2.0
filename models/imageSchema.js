const mongoose = require('mongoose')
const schema = mongoose.Schema;
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

const imageSchema = new schema({
    filename: {
        type: String,
        unique:true,
        required: true
    }, contentType: {
        type: String,
        required: true
    }, imageBase64: {
        type: String,
        required: true
    }, userID:{
        type: Object,
        required: true
    }
})


module.exports = mongoose.model('Image', imageSchema);