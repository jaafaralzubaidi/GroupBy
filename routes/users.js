var express = require('express');
var router = express.Router();

const mongoose = require("mongoose");
const User = require("../models/users-model");

/* GET users Homepage. */
router.get('/', function(req, res, next) {
  res.writeHead(200, {'Content-Type': 'text/plain'}); 
  res.write('Users page:\n');
  res.write('POST   -->  /users/add             --> Takes JSON from body {name:"", interests:[""], active:true/false}\n');
  res.write('GET    -->  /users/list            --> will list all users \n');
  res.write('GET    -->  /users/searchById      --> takes ?id= \n');
  res.write('PUT    -->  /users/updateInterests --> takes ?name= & ?interest= \n');
  res.write('PUT    -->  /users/updateStatus    --> takes ?name= & ?status= \n');
  res.end();
});

// CRUD 
/********************************** CREAT/POST **********************************************/
router.post("/add", function(req, res, next) {
  const newUser = new User ({
    name: req.body.name,
    joinedAt: req.timestamp,
    interests: req.body.interests,
    active: req.body.active
  });
  // using the save() method to add to the database
  newUser.save(function (err, newUser) {
  
    if(!err)
      res.send({status: 200, message: "User has been added to the database", obj: newUser});
    else 
      res.send(err)
  });
});




/********************************** READ/GET ***********************************************/
router.get("/list", function(req, res, next) {
  // finds all user
  User.find(function(err, response){
    if(!err)
      res.send({status: 200, length: response.length, users: response});
    else
      res.send(err);
  });
});


router.get("/searchById", function(req, res, next) {
  const idQuery = req.query.id;
  // finds user with an id
  console.log(idQuery)
  User.findById(idQuery, function(err, response){
    if(!err && response !== undefined)
      res.send({status: 200, users: response});
    else if(response === undefined)
      res.send({status: 200, users: null, message: `No user is found with ID ${idQuery}`});
    else
      res.send(err);
  });
});



/********************************** UPDATE ***************************************************/
// This will add interest to the interests array of a user
router.put("/updateInterests", function(req, res, next) {
  const nameQuery = req.query.name;
  const interestsQuery = req.query.interest; 
  // finds user with a given name
  User.findOneAndUpdate({name: nameQuery},{$push: {interests: interestsQuery}}, function(err, response){
    if(!err && response !== undefined)
      // Sending back the updated object
      User.findOne({name: nameQuery}, function(err, updatedResponse){
        res.send({status: 200, message: "User was updated", users: updatedResponse});
      });
      
    else if(response === undefined)
      res.send({status: 200, users: null, message: `No user is found with ${idQuery}`});
    else
      res.send(err);
  });
});

router.put("/updateStatus", function(req, res, next) {
  const nameQuery = req.query.name;
  const statusQuery = req.query.status; 
  // finds user with a given name
  User.findOneAndUpdate({name: nameQuery},{status: statusQuery}, function(err, response){
    if(!err && response !== undefined)
      // Sending back the updated object
      User.findOne({name: nameQuery}, function(err, updatedResponse){
        res.send({status: 200, message: "User was updated", users: updatedResponse});
      });
      
    else if(response === undefined)
      res.send({status: 200, users: null, message: `No user is found with ${idQuery}`});
    else
      res.send(err);
  });
});



module.exports = router;
