'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const request = require('request');
const puppeteer = require('puppeteer'); 
const cron = require('node-cron');

const logo = "https://upload.wikimedia.org/wikipedia/commons/f/f8/Fiat_logo.svg";
const fromEmail = "orim.ouf@gmail.com";
const toEmail = "orim.ouf@gmail.com";//"Luxels.co@gmail.com";
const pageUrl = "https://www.fiat.dz/fr";//'https://www.google.com/';
const videoElement = '';
const msgSendArray = [];
const matchingUrl = 'data-src="https://fiatdz.com/wp-content/uploads/2025/09/768x888px.mp4,https://fiatdz.com/wp-content/uploads/2025/09/1920x888px.mp4"'

app.set('port', (process.env.PORT || 8000));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Home
app.get('/', function (req, res) {
	res.send('Hello world!');
});
// Start the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'));
});

async function getDataFromSite(page) {
    // console.log("page open ...");
    await new Promise(resolve => setTimeout(resolve, 4000));
    // console.log("Geting Data ...");
    const newUrlsProductArray = await page.evaluate(() => {

        videoElement = document.querySelector("video").innerHTML //"section[id='ID06-CanvasMedia-0effb7e59b']"
        const wordsArray = videoElement.split(' ');

        return wordsArray
    })
    // console.log("---------------------")
    // console.log(newUrlsProductArray);

    const sendWhatsappMsg = (url) => {
         
            // Download the helper library from https://www.twilio.com/docs/node/install
        const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

        // Find your Account SID and Auth Token at twilio.com/console
        // and set the environment variables. See http://twil.io/secure
        const accountSid = process.env.ACCOUNT_SID;
        const authToken = process.env.AUTH_TOKEN;
        const client = twilio(accountSid, authToken);

        async function createMessage() {
        const message = await client.messages.create({
            body: url,
            from: "whatsapp:+14155238886",
            to: "whatsapp:+213791602498",
        })

        console.log(message.body);
        }

        createMessage(); 
    }

    var Match = false
    const found = newUrlsProductArray.find(ele => ele === matchingUrl);

    if (found === undefined) {
        Match = false;
    } else {
        Match = true;
    }

    if (Match) {
        console.log("No New Product Found!");
    } else {
        // sendWhatsappMsg(pageUrl);
        sendEmail(toEmail, fromEmail, logo, false)
    }

    // wait 15s to reload
    // await new Promise(resolve => setTimeout(resolve, 15000));
    // checkout();
      
} 

async function checkout() { 
     // Initiate the browser 
     const browser = await puppeteer.launch({headless: true});//{headless: false}
    try {
        // Create a new page with the default browser context 
        const page = await browser.newPage(); 
        // Go to the target website 
        await page.goto(pageUrl, {timeout: 0}); 
        // await new Promise(resolve => setTimeout(resolve, 10000));
	    // const page = await initBrowser(); 
	    await getDataFromSite(page, msgSendArray);
    } catch (e) {
        console.log("catch Error");
        console.log(e);
        // await new Promise(resolve => setTimeout(resolve, 3000));
        logMessage()
    } 
    finally {
        await browser.close();
    }
} 

function sendEmail(toEmail, fromEmail, logo, check) {
console.log("sending Email check ...");

    request.post(
        'https://api.emailjs.com/api/v1.0/email/send',
        { json : {
            service_id: "service_bukaqyq",
            user_id: "Eow6_b5X8Og5saFTt",
            template_id: (check) ? "template_81w8pyi" : "template_7i0khkn",
            template_params: {
              to_name: toEmail,
              email: fromEmail,
              logo: logo,
              url: pageUrl
            }
          } },
        function (error, response, body) {
            console.log("Email Send : " + response.statusCode);
            
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
        }
    );
}

function logMessage() {
    console.log('Cron job executed at:', new Date().toLocaleString());
    checkout();
   }

   // Schedule the cron job to run every minute
   cron.schedule('*/30 * * * * *', () => {
    logMessage();
   });

   // Schedule the cron job 30 Min to run every minute

   //-----------
//    cron.schedule('*/15 * * * *', () => {
//     console.log('Cron job 30 min executed at:', new Date().toLocaleString());
//     // sending Email to EmailJS
//     sendEmail(toEmail, fromEmail, logo, true)
//    });
   //--------
    // console.log(titles ); 
	// await browser.close(); 

