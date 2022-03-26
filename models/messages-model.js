//mongoDB Schema and Model
const mongoose = require("mongoose");


// 2. Create Schema 
const MessageSchema = mongoose.Schema({
    userId: {type: String, required: [true, "UserID for message is required!"] },
    content: {type:String, required: [true, "Message content is required!"]},
    postedAt: String
});


// 3. Create Student Model
// it will change User to users. make U lowercase and will add s to make it plural
const Message = mongoose.model("Message", MessageSchema);


module.exports = Message;

