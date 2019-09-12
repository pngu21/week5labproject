let mongoose = require('mongoose');
let DateOnly = require('mongoose-dateonly')(mongoose);
let taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    assignTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Developer'
    },
    dueDate: {
        type: DateOnly,
        //default: Date
    },
    status:{
        type: String,
        validate:{
            validator: function(stat){
                return stat ==='Inprogress' || stat ==="Complete"
            }
        }
    },
    description: String
});
module.exports = mongoose.model('Task', taskSchema);