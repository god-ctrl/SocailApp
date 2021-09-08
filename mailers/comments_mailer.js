const nodeMailer = require('../config/nodemailer');

exports.newComment = (comment) => {
    console.log('inside new comment mailer');
     
    nodeMailer.transporter.sendMail({
        from: 'socailApp',
        to: comment.user.email,
        subject: "New Comment Published",
        html: '<h1>yup your comment is published</h1>',
        text: 'mai hu baba'
    },(err,info) =>{
        if(err){console.log('there was an error in sending the comment_mailer',err);return;}
        console('Message sent',info);
        return;
    });
}
