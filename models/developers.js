let mongoose = require('mongoose');
let developerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:{
        firstName:{
            type: String,
            required: true
        },
        lastName:{
            type: String,
            required: true
        }
    },
    level: {
        type: String,
        validate:{
            validator: function(level){
                return level ==="BEGINNER" || level ==="EXPERT"
            }
        },
        required: true
    },
    address:{
        state: {
            type: String,
            required: true
        },
        suburb: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        unit: {
            type: String,
            required: true
        }
    }
    /*created: {
        type: Date,
        default: Date.now
    }*/
});
module.exports = mongoose.model("Developer", developerSchema);