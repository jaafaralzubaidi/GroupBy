var express = require('express');
var router = express.Router();

const mongoose = require("mongoose");
const Group = require("../models/groups-model");
const User = require("../models/users-model");


/* GET Participants Homepage. */
router.get('/', function(req, res, next) {
  res.writeHead(200, {'Content-Type': 'text/plain'}); 
  res.write('Participants page:\n');
  res.write('patch  -->  /events/add         --> Takes query for ?groupId="" & ?participantId="" \n');
  res.write('GET    -->  /events/list        --> Takes query for ?groupId="" \n');
  res.write('PATCH  -->  /events/remove      --> Takes query for ?groupId="" & ?participantId="" \n');
  res.end();
});

// CRUD 
/********************************************* CREAT/POST **********************************************/
//Will return the participants id's using group id
router.get("/list", function(req, res, next) {
  const groupId = req.query.groupId;
  if(!groupId)
    res.send({status: 400, groups: null, message: `Must enter a groupId to search for participants`}); // A 400 is the most commonly expected error response and indicates that a request failed due to providing bad input. 
  Group.findById(groupId, function(err, response) {
  if(!err && response !== undefined)
    res.send({status: 200, length: response.participants.length, obj: response.participants});// array of participants IDs
  
    //TODO: change the idQuery to show the groupId
  else if(response === undefined)
    res.send({status: 200, groups: null, message: `No group is found with ID ${idQuery}`});
  else
    res.send(err);
  })
});

/********************************************* UPDATE/PUT *************************************************/
// this will add participant to the participants array inside group
router.patch("/add", function(req, res, next) {
  const groupId = req.query.groupId;
  const participantId = req.query.participantId;

  Group.findOneAndUpdate({_id: groupId}, {$push : {participantsIds: participantId }}, function (err, response) {
    if(!err)
      res.send({status: 200, message: `A new participant with ID ${participantId} was added to the group`});
    else
      res.send(err);
  });
});


/********************************************* REMOVE/DELETE *************************************************/
// this will remove participant to the participants array inside group
router.patch("/remove", function(req, res, next) {
  const groupId = req.query.groupId;
  const participantId = req.query.participantId;
  
  Group.findOneAndUpdate({_id: groupId}, {$pull : {participants: participantId }}, function (err, response) {
    if(!err)
      res.send({status: 200, message: `A participant with ID ${participantId} was removed from the group`});
    else
      res.send(err);
  });
});



module.exports = router;
