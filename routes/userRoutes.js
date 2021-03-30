const messagesAPI = require('../api/messagesAPI')
const userFunctions = require('./userFunctions')

module.exports = (app, io) => {

    app.post('/api/wsp/receive', async (req, res) => {
        let { text, phoneNumber, userChannel } = req.body

        respuestaAudio = false
        /////////////////////////////////////////////////////////////////

        if(userFunctions.userFounded(phoneNumber)) {
            if(userFunctions.userFounded(phoneNumber).derivar) {
                io.emit('loadData', { text, phoneNumber })
            }
            else {
                const result = await userFunctions.getNluText(phoneNumber, text, io)
                for(let answer of result.answers) {
                    answerText = decodeURI(answer.content)
                    if(answerText){
                        if(!answer.technicalText) {
                            if(respuestaAudio == true){
                                urlmedia = await userFunctions.tts(answerText)
                                await messagesAPI.sendAdvancedMessage(phoneNumber, urlmedia)
                            }else{
                                await messagesAPI.sendMessage(phoneNumber, answerText)
                            }
                        } else {
                            technicalText = JSON.parse(JSON.stringify(answer.technicalText))
                            if(technicalText["media"] == true){
                                await messagesAPI.sendAdvancedMessage(phoneNumber, answerText)
                            }else{
                                await messagesAPI.sendMessage(phoneNumber, answerText)
                            }
                        }
                    }
                }
                try {
                    if(result.userData.messages) {
                        io.emit('loadData', { 'phoneNumber': phoneNumber, 'messages': result.userData.messages, 'sentiment': result.userData.sentiment, 'userChannel': userChannel })
                    } 
                } catch(e) {
                }
            }
        } else {
            let project, channel, eva

            if(userFunctions.getHeaders(text)) {
                project = userFunctions.getHeaders(text).project
                channel = userFunctions.getHeaders(text).channel
                eva = userFunctions.getHeaders(text).eva
                userFunctions.insertUser(phoneNumber, project, channel, userChannel, eva)
                const result = await userFunctions.getNluText(phoneNumber, text)

                for(let answer of result.answers) {
                    answerText = decodeURI(answer.content) 
                    if(!answer.technicalText) {
                        if(respuestaAudio == true){
                                urlmedia = await userFunctions.tts(answerText)
                                await messagesAPI.sendAdvancedMessage(phoneNumber, urlmedia)
                            }else{
                                await messagesAPI.sendMessage(phoneNumber, answerText)
                            }
                    } else {
                        await messagesAPI.sendAdvancedMessage(phoneNumber, answerText)
                    }
                }
            }
        }
        res.status(200).send({ text: ''})
    })

    app.post('/api/wsp/send', async (req,res) => {
        const { phoneNumber, text } = req.body;
        const userChannel = await userFunctions.getUserChannel(phoneNumber)

        if(userChannel === 'twilio'){ 
            messagesAPI.sendMessage(`${phoneNumber}`, text)
        }else{
            io.emit('chat message', { 'sender': 'EVA', 'receiver': phoneNumber, 'message': text})
        }   
        res.status(200).send()
    })

    app.post('/api/wsp/deleteUser', (req,res) => {
        const { phoneNumber } = req.body;
        userFunctions.deleteUser(phoneNumber);
        res.status(200).send()
    })

}

