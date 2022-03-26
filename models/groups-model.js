//mongoDB Schema and Model
const mongoose = require("mongoose");


// 2. Create Schema 
const groupSchema = mongoose.Schema({
    name: {type: String, required: [true, "Must include a Name for the group!"] },
    participantsIds:{type:[String], required:[true, "Must include first participant ID!"]},
    messages: [],
    events:[]
});


// 3. Create Student Model
// it will change User to users. make U lowercase and will add s to make it plural
const Group = mongoose.model("Group", groupSchema);


module.exports = Group;

