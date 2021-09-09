const nodeMailer = require('../config/nodemailer');

exports.newOtp = (otp) => {
    let htmlString=nodeMailer.renderTemplate({otp:otp},'/otps/new_otp.ejs'); 
    nodeMailer.transporter.sendMail({
        from: 'socailApp',
        to: otp.email,
        subject: "Your otp",
        html: htmlString,
        text: 'mai hu baba'
    },(err,info) =>{
        if(err){console.log('there was an error in sending the comment_mailer',err);return;}
        console('Message sent',info);
        return;
    });
}
