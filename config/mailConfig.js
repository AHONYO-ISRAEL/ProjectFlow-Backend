const nodemailer = require('nodemailer')

// MAiLER      

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
      user:'edpflow.noreply@gmail.com',
      pass: 'Project_Flow',
    }
  })
  
  const mailSend = (recipient, subject, text)=>{
    const mailOptions ={
      from : 'edpflow.noreply@gmail.com',
      to: recipient,
      subject: subject,
      text: text,
    }
  
    transporter.sendMail(mailOptions, (error, info)=>{
      if(error){
        console.log(error)
      }
      else{
        console.log(info.response)
      }
    })
  }
  
module.exports = mailSend