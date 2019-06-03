const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
    slackID: {
        type: String,
        required: true,
        unique: true
    },
    slackWorkplace: {
        type: String,
        required: true
    }, 
    startDate: {
        type: Date,
        default: Date.now()
    },
    
    endDate: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('User', userSchema);