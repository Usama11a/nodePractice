const express = require('express');
const dotenv = require("dotenv");
const converter = require('json-2-csv');
dotenv.config();
const MongoClient = require('mongodb').MongoClient;
const app = express()
app.use(express.json());
const uri = process.env.uri;

//Generate Report of existing Users
function generate_user_report(req,res){
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
}

module.exports.generate_user_report = generate_user_report