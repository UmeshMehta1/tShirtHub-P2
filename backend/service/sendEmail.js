const nodemailer = require("nodemailer")


const sendEmail = async(optional)=>{
    var transport = nodemailer.createTransport({
        service:"gmail",
        auth:{
        user: "mehtaumesh1245@gmail.com",
        pass:"dgyuxzdbyhhdufvo"
    }
    })
  

    const mailoptions={
       from:"tShirtHub <tshirthub@gmail.com",
       to:optional.email,
       subject:optional.subject,
       text:optional.message
    };

    await transport.sendMail(mailoptions)

}

module.exports= sendEmail