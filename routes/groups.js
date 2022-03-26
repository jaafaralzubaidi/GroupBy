var express = require('express');
var router = express.Router();

const mongoose = require("mongoose");
const Group = require("../models/groups-model");
const User = require('../models/users-model');

/* GET users Homepage. */
router.get('/', function(req, res, next) {
  res.writeHead(200, {'Content-Type': 'text/plain'}); 
  res.write('Group page:\n');
  res.write('POST   -->  /groups/createGroup     --> Takes JSON from body {name:"", participantsIds:[""]}\n');
  res.write('GET    -->  /groups/list\n');
  res.write('GET    -->  /groups/searchById      --> takes ?id= \n');
  res.end();
});

// CRUD 
/********************************************* CREAT/POST **********************************************/
// Create a group by passing name of the group and participants IDs
router.post("/createGroup", function(req, res, next) {
  const newGroup = new Group({
    name: req.body.name,
    participantsIds: req.body.participantsIds
  });
  
  newGroup.save(function(err, newGroup){
    if(!err)
      res.send({status:200, message: "Group has been added to the database", obj: newGroup});
    else
      res.send(err);
  });
});


/********************************************* READ/GET *************************************************/
// List all the created groups
router.get("/list", function(req, res, next) {
  //find all 
  Group.find(function(err, response){
  if(!err)
    res.send({status: 200, length: response.length, groups: response});
  else
    res.send(err);
  });
});

// Search by group IDs
router.get("/searchById", function(req, res, next) {
  const idQuery = req.query.id;
  Group.findById(idQuery, function(err, response){
  if(!err && response !== undefined)
    res.send({status: 200, users: response});
  else if(response === undefined)
    res.send({status: 200, groups: null, message: `No group is found with ID ${idQuery}`});
  else
    res.send(err);
  })
});


module.exports = router;
