const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const CLIENT_ID = process.env.CLIENT_ID_EMAIL;
const CLIENT_SECRET = process.env.CLIENT_SECRET_EMAIL;
const REDIRECT_URL = process.env.REDIRECT_URL;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URL);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN}); 
accessToken = oAuth2Client.getAccessToken();
const ejs = require('ejs');
const path = require('path');
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken, 
         
    } 
});

let renderTemplate = (data,relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        function(err,template) {
            if(err){console.log('error in rendering template');return;}
            mailHTML = template; 
        }
    )

    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}