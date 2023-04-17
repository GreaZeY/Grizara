const nodeMailer = require("nodemailer")

const sendEmail = async(option)=>{

    const transporter = nodeMailer.createTransport({
        host : process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        service:process.env.SMTP_SERVICE,
        secure:true,
        auth:{
            user:process.env.MAIL,
            pass:process.env.MAIL_PASSWORD
        }
    })

    const mailOptions = {
        from : process.env.MAIL,
        to:option.email,
        subject:option.subject,
        text:option.message
    }
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail