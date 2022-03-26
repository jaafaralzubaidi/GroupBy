var express = require('express');
var router = express.Router();

const mongoose = require("mongoose");
const Group = require('../models/groups-model');
const { findById } = require('../models/messages-model');
const Message = require("../models/messages-model");
const User = require("../models/users-model");

/* GET users Homepage. */
router.get('/', function(req, res) {
  res.send('Messages homepage');
});


// CRUD 
/********************************************* CREAT/POST **********************************************/
router.post("/newMessage", validateUserId, validateGroupId, function(req, res) {
  const newMessage = new Message({
    userId: req.body.userId,
    content: req.body.content,
    postedAt: req.timestamp
  });
  
  Group.findByIdAndUpdate(req.body.groupId, {$push: {messages: newMessage} }, function(err, response){
    console.log("am here")
    
      if(!err)
        res.send({status:200, message: "Message has been added to the group"});
      else
        res.send(err);
    
  });

});
// Middleware to check for if user is in the group
function validateUserId(req, res, next){
  User.findById(req.body.userId, function(err, response) {
    if(response && !err){
      console.log("user ", req.body.userId)
      next();
    }else
      res.send({error: err, message: "WRONG ID. Check the user ID!"})
  });
  
}
function validateGroupId(req, res, next){
  Group.findById(req.body.groupId, function(err, response) {
    if(response && !err){
      console.log("group ", req.body.groupId)
      next();
    }else
      res.send({error: err, message: "WRONG ID. Check the Group ID!"})
  });
  
}



/********************************************* READ/GET *************************************************/

router.get("/list", function(req, res) {
  //find all 
  Group.findById(req.query.groupId, function(err, response){
  if(!err)
    res.send({status: 200, length: response.messages.length, object: response.messages});
  else
    res.send(err);
  }).select("messages.content");
});

/********************************************* UPDATE/PATCH *************************************************/
router.patch("/replaceContent", function(req, res) {
  const userIdQuery = req.query.userId;
  const messageContentQuery = req.query.messageContent;
  const groupIdQuery = req.query.groupId;
  //find all 
  Group.findOneAndUpdate({_id: groupIdQuery, "messages.userId": userIdQuery }, {$set: {"messages.$.content": messageContentQuery}}, function(err, response){
    if(!err)
      res.send({status: 200, message: "Content has been updated!"})
    else 
      res.send(err);
  } ).select("messages");

});


module.exports = router;
