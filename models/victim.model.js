const mongoose = require('mongoose');

const victimSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
    },
    address : {
        type : String,
    },
    contact : {
        type : String,
    },
    status : {
        type : String,
        enum : ['none', 'pending', 'declined', 'accepted'],
        default : 'none'
    }
});

const Victim = mongoose.model('Victim', victimSchema);

module.exports = { Victim };