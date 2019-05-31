const mongoose = require('mongoose');
const Schema = mongoose.Schema();

const calendarSchema = new Schema({
    events: {
        type: Date,
        required: true
    },
    vacation: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Calendar', calendarSchema);