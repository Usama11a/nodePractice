const express = require('express');
const dotenv = require("dotenv");
const nodemailer = require('nodemailer');
dotenv.config();
const app = express();
app.use(express.json());
'use strict';

async function send_reg_emails(email,email_alias){

    if (email_alias == null || email_alias == undefined || email_alias == ""){
        email_alias = 'Default Alias'
    }
    var split_name = email
    var index_of_name = split_name.split('@');
    var name = index_of_name[0];
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'usamasheikh11a@gmail.com',
            pass: 'oemvbiqctzzwbwax'
        }
    });
      
    var mailOptions = {
        from: email_alias+'usamasheikh11a@gmail.com',
        to: email,
        subject: 'Congrats for the Registration !!',
        text: 'Hey '+name+' you have registered successfully!!'
    };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}
module.exports.send_reg_emails = send_reg_emails;