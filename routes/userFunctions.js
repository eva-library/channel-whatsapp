const util = require('util')

const axios = require('axios')
const apiDB = require('./apiDB')
let users = []

getUsers = () => {
    return users
}

getUserChannel = async (phoneNumber) => {
    const number = phoneNumber.toString()
    let userChannel
    await users.find(u => {
        if (u.phoneNumber == number) {
            userChannel = u.userChannel
        }
    })
    return userChannel
}

deleteUser = (phoneNumber) => {
    const number = phoneNumber.toString()
    users.find((u, i) => {
        if (u.phoneNumber == number) {
            users.splice(i, 1)
        }
    })
}

listUsers = () => {
    return users
}

userFounded = (phoneNumber) => {
    return users.find(u => u.phoneNumber == phoneNumber)
}

getHeaders = (text) => {
    var headers = null

		headers = { apikey:'EVA_APIKEY_BOT', project: 'EVA_PROJECT_BOT', channel: 'EVA_CHANNEL_BOT', locale:'INSERT_LOCALE_BOT'};
	
    return headers
    
    
}

insertUser = (phoneNumber, project, channel, userChannel, eva) => {
    users.push({ phoneNumber, project, channel, sessionCode: '', userChannel, eva})
}

updateUser = (phoneNumber, project, channel, userChannel) => {
    users.forEach(u => {
        if (u.phoneNumber == phoneNumber) {
            u.project = project
            u.channel = channel
            u.sessionCode = ''
            u.userChannel = userChannel
        }
    })
}

getNluText = async (phoneNumber, text, io) => {
    const user = userFounded(phoneNumber)
    let eva = user.eva
    var headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'API-KEY': user.apikey,
        'PROJECT': user.project,
        'CHANNEL': user.channel,
        'OS': 'Windows',
        'USER-REF': phoneNumber,
        'LOCALE': user.locale
    }
    var body = {
        "text": text,
        "context": user.context,
    }
    var brokerUrl = `URL_BROKER_EVA` + user.sessionCode
    
    const { data } = await axios.post(brokerUrl, body, { headers: headers })
    let userData = null
    updateUserAttribute(phoneNumber, 'sessionCode', data.sessionCode)
    updateUserAttribute(phoneNumber, 'context', data.context)
   
    answer = data.answers[0].text
    let answers = data.answers
    if (data.answers.length > 1) answer = data.answers[0].text + ' ' + data.answers[1].text
    return { answers, userData, phoneNumber }
}

updateUserAttribute = (phoneNumber, key, value) => {
    users.forEach(u => {
        if (u.phoneNumber == phoneNumber)
            u[key] = value
    })
}

getUserText = (text, phoneNumber) => {
    return text.includes(phoneNumber) ? 'Hi' : text
}

module.exports = {
    listUsers,
    userFounded,
    getHeaders,
    updateUser,
    getNluText,
    insertUser,
    getUserChannel,
    deleteUser,
    tts,
    stt,
}