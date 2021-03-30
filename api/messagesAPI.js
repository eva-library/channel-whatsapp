const api = {}
const accountSid = 'TWILIO_ACCOUNT_SID';
const authToken = 'TWILIO_ACCOUNT_TOKEN';
const client = require('twilio')(accountSid, authToken);

api.sendMessage = async (phoneNumber, text) => {
    await client.messages
          .create({
            body: text,
            from: 'PHONE_NUMBER',
            to: `whatsapp:+${phoneNumber}`
          })
}

api.sendAdvancedMessage = async (phoneNumber, mediaUrl) => {
  await client.messages.create({
      body: '',
      from: 'whatsapp:+PHONE_NUMBER',
      to: `whatsapp:+${phoneNumber}`,
      mediaUrl: mediaUrl,
  })
}

api.sendSMSMessage = async (phoneNumber, codigo) => {
  const text = 'Your authentication code is : ' + codigo
  try{
    client.messages.create({
        body: text,
        from: 'TWILIO_NUMBER',
        to: `+${phoneNumber}`,
    })
    .then(message => {
                console.log(message.sid);
                res.send({ status: 200 })
    });
  }catch(e){
      console.log("SMS sending error")
      console.log(e)
      res.send({ status: 500 })
  }
}


module.exports = api