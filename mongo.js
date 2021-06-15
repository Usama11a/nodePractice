const express = require('express');
const dotenv = require("dotenv");
dotenv.config();
const app = express()
app.use(express.json());
const jwt_val = require('./jwt_validation');
const router = require('./crud_router');
const report = require('./generate_report');

//Create User API
app.post('/api/user',jwt_val, (req, res) => {
  router.creat_user(req,res);
});

//Add course
app.post('/api/course',jwt_val, (req, res) => {
  router.add_course(req,res);
});

//Get user by id API
app.get('/api/user/:id',jwt_val, (req, res) => {
  router.get_userby_id(req,res);
});

//List users in the table
app.get('/api/list/users',jwt_val ,(req, res) => {
  router.list_users(req,res);
});

// Update user by id
app.put('/api/user/:id',jwt_val, (req, res) => {
  router.get_userby_id(req,res);
});

//delete user by id
app.delete('/api/user/:id', jwt_val,(req,res)=>{
  router.delete_user(req,res);
});

app.post('/api/login',(req,res) => {
  router.login_user(req,res);
})

//Generate Report of existing Users
app.get('/api/report',jwt_val ,(req, res) => {
  report.generate_user_report(req,res);
});


app.listen(3000, () => console.log("Listning to port 3000"));