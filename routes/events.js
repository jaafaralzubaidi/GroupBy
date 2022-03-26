var express = require('express');
var router = express.Router();

const mongoose = require("mongoose");
const Event = require('../models/events-model');
const Group = require("../models/groups-model");
const User = require('../models/users-model');

/* GET users Homepage. */
router.get('/', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'}); 
  res.write('Events page:\n');
  res.write('POST   -->  /events/createEvent     --> Takes JSON from body {userId:"", groupId:", name:"",, startsAt:"",endsAt:""}\n');
  res.write('GET    -->  /events/list            --> Takes query for ?groupId="" \n');
  res.write('GET    -->  /events/getEvent        --> Takes query for ?name="" & ?groupId=""\n');
  res.write('PATCH  -->  /event/deleteEvent      --> Takes a query for ?groupId="" & ?name=""\n');
  res.write('PATCH  -->  /event/updateEventName  --> Takes a query for ?eventId="" & ?newName=""\n');
  res.write('PATCH  -->  /event/updateStartsAt   --> Takes a query for ?eventId="" & ?startsAt=""\n');
  res.write('PATCH  -->  /event/updateEndsAt     --> Takes a query for ?eventId="" & ?endsAt=""\n');
  res.end();
});

// CRUD 
/********************************************* CREAT/POST **********************************************/
// userID for the whom created
router.post("/createEvent", validateUserId,validateGroupId, validateDate, function(req, res) {
  const newEvent = new Event({
    createdById: req.body.userId,
    name: req.body.name,
    startsAt: req.body.startsAt,
    endsAt: req.body.endsAt
  });
  Group.findOneAndUpdate(req.body.groupId, {$push: {events: newEvent}}, function(err, response) {
    if(!err)
      res.send({status: 200, message: "The event has been added to the group."});
    else
      res.send(err)
  })

});

// Middleware if user ID in database using the req.body
function validateUserId(req, res, next){
  User.findById(req.body.userId, function(err, response) {
    if(response && !err){
      next();
    }else
      res.send({status: 400, message: "WRONG ID. Check the user ID!"})
  });
  
}
// Middleware if group ID in database using the req.body
function validateGroupId(req, res, next){

  Group.findById(req.query.groupId, function(err, response) {
    if(response && !err){
      next();
    }else
      res.send({status: 400, message: "WRONG ID. Check the group ID!"})
  });
  
}
// Middleware to validate the startsAt and endsAt using req.body
function validateDate(req, res, next){
  const start = Date.parse(req.body.startsAt);
  const end = Date.parse(req.body.endsAt);

  if(isNaN(start) === true)
    res.send({status: 400, message: "Invalid startsAt input. YYY-MM-DD HH:MM:SS" });
  else if(isNaN(end) === true)
    res.send({status: 400, message: "Invalid startsAt input. YYY-MM-DD HH:MM:SS" });
  else if(start > end)
    res.send({status: 400, message: "Invalid input. startsAt must be less than endsAt" });
  else
    next();

}


/********************************************* READ/GET *************************************************/
// Gets all the events
router.get("/list",validateGroupId, function(req, res) {
  const groupIdQuery = req.query.groupId;
  Group.findById(groupIdQuery, function(err, response) {

  if(!err && response !== null)
    res.send({status: 200, length: response.events.length, object: response.events});// array of participants IDs
  
  else if(response === undefined)
    res.send({status: 200, groups: null, message: `No group is found with ID ${groupIdQuery}`});
  else
    res.send(err);
  })
 
});


// Gets a specific event details based on user ID who created the event and a group ID 
router.get("/getEvent",validateEventNameFromQuery, validateGroupIdFromQuery, function(req, res) {
  const nameQuery = req.query.name;
  const groupIdQuery = req.query.groupId;
  
  Group.find({_id: groupIdQuery}, {events: {$elemMatch: {name: nameQuery }}}, function(err, response){
    if(!err)
      res.send({status: 200 ,eventDetails: response});
    else  
      res.send(err);
  });
   
});



// Middleware if user ID in database using the req.query
function validateUserIdFromQuery(req, res, next){
  User.findById(req.query.userId, function(err, response) {
    if(response && !err){
      next();
    }else
      res.send({status: 400, message: "WRONG ID. Check the user ID!"})
  });
  
}
// Middleware if user ID in database using the req.query
function validateGroupIdFromQuery(req, res, next){
  Group.findById(req.query.groupId, function(err, response) {
    if(response && !err){
      next();
    }else
      res.send({status: 400, message: "WRONG ID. Check the group ID!"})
  });
  
}


/********************************************* REMOVE/DELETE *************************************************/
router.patch("/deleteEvent",validateGroupIdFromQuery, validateEventNameFromQuery, function(req, res){
  const groupIdQuery = req.query.groupId;
  const nameQuery = req.query.name;
  
  Group.findOneAndUpdate(groupIdQuery, {$pull: {events: {name: nameQuery} }}, function (err, response){
    if(!err)
      res.send({status: 200, message: "Event has been deleted."});
    else
      res.send(err);
  });
});

// Middleware to check if the event name exist inside the group events
function validateEventNameFromQuery(req, res, next){
  Group.findOne({"events.name": req.query.name}, function(err, response){
    if(!err && response !== null)
      next();
    else if(err)
      res.send(err)
    else
      res.send({status: 400, message: "WRONG Event Name. Event name does not exist in database"})
  });
}

/********************************************* UPDATE/PATCH *************************************************/
// Updating the event name based on ID of Event
router.patch("/updateEventName",  function(req, res){
  const newNameQuery = req.query.newName;
  const eventIdQuery = req.query.eventId;
  
  Group.findOneAndUpdate({"events._id": mongoose.Types.ObjectId(eventIdQuery)}, {$set: {"events.$.name": newNameQuery }}, function (err, response){
    if(!err){
      res.send({status: 200, message: "Event name has been updated"});
    }
    else
      res.send(err);
  });
});

// Updating the startsAt based on ID of Event
router.patch("/updateStartsAt",validateStartsAt,  function(req, res){
  const newStatsAtQuery = req.query.startsAt;
  const eventIdQuery = req.query.eventId;
  
  Group.findOneAndUpdate({"events._id": mongoose.Types.ObjectId(eventIdQuery)}, {$set: {"events.$.startsAt": newStatsAtQuery }}, function (err, response){
    if(!err){
      res.send({status: 200, message: "StartsAt has been updated"});
    }
    else
      res.send(err);
  });
});

// Middleware to validate the startsAt using req.body
function validateStartsAt(req, res, next){
  const start = Date.parse(req.query.startsAt);

  if(isNaN(start) === true)
    res.send({status: 400, message: "Invalid startsAt input. YYY-MM-DD HH:MM:SS" });
  else
    next();

}

// Updating the endsAt based on ID of Event
router.patch("/updateEndsAt",validateEndsAt,  function(req, res){
  const newEndsAtQuery = req.query.endsAt;
  const eventIdQuery = req.query.eventId;
  
  Group.findOneAndUpdate({"events._id": mongoose.Types.ObjectId(eventIdQuery)}, {$set: {"events.$.endsAt": newEndsAtQuery }}, function (err, response){
    if(!err){
      res.send({status: 200, message: "EndsAt has been updated"});
    }
    else
      res.send(err);
  });
});

// Middleware to validate the endsAt using req.body
function validateEndsAt(req, res, next){
  const end = Date.parse(req.query.endsAt);

  if(isNaN(end) === true)
    res.send({status: 400, message: "Invalid endsAt input. YYY-MM-DD HH:MM:SS" });
  else
    next();

}


module.exports = router;
