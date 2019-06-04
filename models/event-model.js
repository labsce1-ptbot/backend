const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = Schema({
    eventId: {
        type: Number,
        required: true,
        unique: true
    },
    slackID: {
        type: String,
        required: true, 
    },
    startDate: {
        type: Date,
        default: Date.now()
    },
    endDate: {
        type: Date,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Event', eventSchema);