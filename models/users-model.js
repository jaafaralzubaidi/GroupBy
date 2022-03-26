//mongoDB Schema and Model
const mongoose = require("mongoose");


// 2. Create Schema 
const userSchema = mongoose.Schema({
    name: {type: String, required: [true, "Name is required!"] },
    joinedAt: String,
    interests: {type:[String], default: "No Interests"},
    active: {type:Boolean, default: false }
});


// 3. Create Student Model
// it will change User to users. make U lowercase and will add s to make it plural
const User = mongoose.model("User", userSchema);


module.exports = User;

