const Joi = require('joi');
const jwt = require('jsonwebtoken');

 function user_validation(bodyObj){
  
    const user_object = Joi.object({
        first_name: Joi.string().min(3).max(8).required(),
        last_name: Joi.string().min(3).max(8).required(),
        age: Joi.number().min(3).max(8).optional(),
        city: Joi.string().min(3).max(8).optional(),
        email:Joi.string(),
        email_alias:Joi.string(),
        skip_email: Joi.boolean().required(),
    });
    const validator = user_object.validate(bodyObj);
    return validator;
  }

function login_validation(email,password){

    const login_object = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().min(5).max(15).required(),
  });
  const validator = login_object.validate(email,password);
  return validator;
}

function course_validation(body_object){

  const course_object = Joi.object({
    course_name: Joi.string().min(3).max(8).required(),
    credit_hours: Joi.string().max(8).required(),
  });
const validator = course_object.validate(body_object);
return validator;
}


function  date_created_cal() {
  let ts = Date.now();
  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  const date_created = (year + "-" + month + "-" + date+ " " + hours + ":" + minutes + ":" + seconds);
  return date_created;
}

module.exports.date_created_cal = date_created_cal
module.exports.course_validation = course_validation
module.exports.login_validation = login_validation
module.exports.user_validation = user_validation