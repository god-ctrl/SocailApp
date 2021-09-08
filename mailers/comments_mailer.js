const nodeMailer = require('../config/nodemailer');

exports.newComment = (comment) => {
    let htmlString=nodeMailer.renderTemplate({comment:comment},'/comments/new_comment.ejs'); 
    nodeMailer.transporter.sendMail({
        from: 'socailApp',
        to: comment.user.email,
        subject: "New Comment Published",
        html: htmlString,
        text: 'mai hu baba'
    },(err,info) =>{
        if(err){console.log('there was an error in sending the comment_mailer',err);return;}
        console('Message sent',info);
        return;
    });
}
