//mongoDB Schema and Model
const mongoose = require("mongoose");


// 2. Create Schema 
const eventSchema = mongoose.Schema({
    createdById: {type: String, required: [true, "User ID is required!"] },
    name:{type:String, required:[true, "Events name is required!"]},
    startsAt: String,
    endsAt: String
});


// 3. Create Student Model
// it will change User to users. make U lowercase and will add s to make it plural
const Event = mongoose.model("Event", eventSchema);


module.exports = Event;

