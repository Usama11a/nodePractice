const express = require('express');
const dotenv = require("dotenv");
const converter = require('json-2-csv');
const filesystem = require("fs")
dotenv.config();
const jwt = require("jsonwebtoken"); 
const MongoClient = require('mongodb').MongoClient;
const {ObjectId } = require('mongodb');
const app = express()
app.use(express.json());
const Joi = require('joi');
const uri = process.env.uri;
const jwt_val = require('./jwt_validation');
const field_validation = require("./validation")
const sentmail = require('./reg_email')
const db_con = require('./server')


//Create User API
app.post('/api/user',jwt_val, (req, res) => {
  const validation_response = field_validation.user_validation(req.body);
  if(validation_response.error) res.json({Message: validation_response.error.details[0].message});
  else{
    var skip_email = req.body.skip_email;
    const date_modified = null;
    const date_created = field_validation.date_created_cal();
    const query = {User_Info: req.body, date_created: date_created, date_modified: date_modified}
    const insert_date = db_con.insertData(query,skip_email)
    if (insert_date)
    res.json(query);
    else
    res.json({msg: "Data not inserted for some reason"})
  }
});

//Add course
app.post('/api/course',jwt_val, (req, res) => {
  const validation_response = field_validation.course_validation(req.body);
  if(validation_response.error) res.json({Message: validation_response.error.details[0].message});
  else{
    MongoClient.connect(uri, (err, db) =>{
      if (err) throw err;
      var dbo = db.db("myFirstDatabase");
      dbo.collection("courses").insertOne(req.body, (err, result)=>{
        if (err) throw err;
        res.json(req.body);
      });
    });
  }
});


//Get user by id API
app.get('/api/user/:id',jwt_val, (req, res) => {
  const user_id = {_id:new ObjectId(req.params.id)}
  MongoClient.connect(uri, (err, db)=>{
    if (err) throw err;
    var dbo = db.db("myFirstDatabase");
    dbo.collection("Test").find(user_id).toArray((err, result) => {
      if (err) throw err;
      else if (result) res.json(result);
      else res.json({Message: "No id found against this key"});
    });
  });
});

//List users in the table
app.get('/api/list/users',jwt_val ,(req, res) => {
  MongoClient.connect(uri, (err, db)=>{
    if (err) throw err;
    var dbo = db.db("myFirstDatabase");
    const { page = 1, limit = 10 } = req.query;
    const range = (page-1)*limit
    dbo.collection("Test").count({}, (err,total_count)=>{
      if(err) throw err
    
    dbo.collection("Test").find({}).limit(limit*1).skip(range).toArray((err, result) => {
      if (err) throw err;
      var total_pages = Math.ceil(total_count/limit)
     res.json({
        Result:result,
        range: range,
        Total_Pages: total_pages
      });
      })
    });
  });
});


// Update user by id
app.put('/api/user/:id',jwt_val, (req, res) => {
const validation_response = field_validation.user_validation(req.body);
if(validation_response.error) res.json({Message: validation_response.error.details[0].message});
else{
  MongoClient.connect(uri, (err, db) => {
    const date_modified = field_validation.date_created_cal();
    const query = {
      date_modified: date_modified,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      age: req.body.age,
      city:req.body.city
    }
    if (err) throw err;
    var dbo = db.db("myFirstDatabase");
    var userToUpdate = {_id: new ObjectId(req.params.id)};
    dbo.collection("Test").updateOne(userToUpdate,{$set:query},
      (err, result)=>{
        try{
          res.json(req.body);
        }
        catch{ throw err;}
      });
    });
  }
});

//delete user by id
app.delete('/api/user/:id', jwt_val,(req,res)=>{
  if (req.params.id.length < 24) res.send({Message: "Invalid Object ID"});
  MongoClient.connect(uri, (err,db)=>{
    if (err) throw err;
    var dbo = db.db("myFirstDatabase");
    dbo.collection("Test").remove({_id:new ObjectId(req.params.id)},
      (err, result)=>{
        if (err) throw err;
        else if (result != "" || result != undefined || result != null) 
          res.json({Message: "Data deleted Scccessffully"});
        else res.json({Message: "Id not Found"});
      });
  });
});

app.post('/api/login',(req,res) => {
  const email = req.body.email;
  const password = req.body.password;
  const validation_response = field_validation.login_validation({email,password});
  if(validation_response.error) res.send({Message: validation_response.error.details[0].message});
  else{
    MongoClient.connect(uri, (err,db)=>{
      if (err) throw err;
      var dbo = db.db("myFirstDatabase");
      var query = {email: req.body.email, password: req.body.password};
      dbo.collection("Test").findOne(query, (err, result)=>{
        if (err) throw err;
          if(result == null || result == undefined || result == "") res.json({message: "Invalid Email or Password"});
          else{
              jwt.sign({email: req.body.email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '120000s'}, (err,token)=>{
              const login_data = {
                email: email,
                password: password,
                token: token,
              }
              res.json(login_data)
            })
          } 
        });
    });
  }
})

//Generate Report of existing Users
app.get('/api/report',jwt_val ,(req, res) => {
  MongoClient.connect(uri, (err, db)=>{
    if (err) throw err;
    var dbo = db.db("myFirstDatabase");
    dbo.collection("Test").find({},{ projection: { _id: 0, name: 1, email: 1 ,User_Info:{first_name:'First Name',city:1}} }).toArray((err, result) => {
        res.setHeader('Content-Type', 'text/csv')
        converter.json2csv(result, (err, user_report) => {
          if (err) throw err;      
            res.send(user_report);
        })
    })
  });
});


app.listen(3000, () => console.log("Listning to port 3000"));