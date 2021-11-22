
[![N|Solid](https://i.ibb.co/LtT31vK/eva-150px.png)](https://eva.bot/)

## Pre-requisites
- [Twilio account](https://www.twilio.com/)

## Create account Twlilio

> The first thing we must do is create an account in Twilio.

> Once the account is created, we go to the Functions option and create one.


| Create Function |   |
| ------ | ------ |
| Function Name | sendMessage |
| Path | URL_TWILIO/sendMessage |

And in the option code insert a similar code.
```sh
const axios = require('axios');
const { escape } = require('querystring');
let sessions = {};
exports.handler = function (context, event, callback) {
    let twiml = new Twilio.twiml.MessagingResponse();
    let query = decodeURIComponent(escape(event.Body));
    let number1 = escape(event.From);
    let mediaContent = ''
    let link = ''
    if(event.MediaContentType0 == "application/pdf"){
        query = query+' Link del pdf '
        link = event.MediaUrl0
    }else if(event.MediaUrl0){
        const image = event.MediaUrl0
        const type = event.MediaContentType0
        mediaContent = {
            image,
            type
        }
    }
    const number = number1.slice(14);
    let inputText = query.replace(/%20/g, " ");
    console.log(number)
    const body = {
        "text": query,
        "phoneNumber": number,
        "userChannel": 'twilio',
        "mediaUrl": mediaContent,
        "mediaLink": link
    };
    let headers = {
        'Content-Type': 'application/json'
    };
    console.log(body);
    axios.post('URL_TO_SERVICE_POST/api/wsp/receive', body, { headers: headers });
}
```
> We modify the whatsapp connector. Open the **messagesAPI.js** file and find the variables
- accountSid
- authToken

[![N|Solid](https://i.ibb.co/GRNHBHG/001.png)](https://i.ibb.co/GRNHBHG/001.png)

> And replace with the credentials that your twilio account gives you.

> With all the connector variables modified, it only remains to deploy the code in any cloud (Azure, GCP, Aws, etc..)

Thanks!

**eva professional services**

*Components are not supported
