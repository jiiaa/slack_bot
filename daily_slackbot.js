require('dotenv').config();
const { WebClient, LogLevel } = require('@slack/web-api');
const jsonData = require('./namedays.json');

// Define the basic settings
const username = 'Päivän parhaat';
let emoji = ':nerd_face';
const channelId = 'C021WNBS5S4'; // #random
// const channelId = 'C02BQRTKEJ1'; // #slackbot-test
// const channelId = 'C02BXP7S64U'; // #slackbot-dev

// For translating the weekday to Finnish
const weekdays = {
  1: 'Maanantai',
  2: 'Tiistai',
  3: 'Keskiviikko',
  4: 'Torstai',
  5: 'Perjantai',
  6: 'Lauantai',
  0: 'Sunnuntai'
}

// Something fun to post
const specialDates = {
  "0908": "Tänään on Jukan viimeinen varsinainen työpäivä Redlandilla.",
  "0910": "Tänään on Jukan viimeinen päivä redlanderina.",
  "0913": "Tänään on Jukan ensimmäinen työpäivä Terveystalolla.",
  "0915": "Tänään Ilkka tulessa ja liekeissä Solitan golf-kisassa. Tsemii! Voitto kotiin!"
}

// Get the numbers of today
const date_obj = new Date();
const date = date_obj.getDate();
const month = date_obj.getMonth() + 1;
const year = date_obj.getFullYear();

// Set the weekday in Finnish
const weekday = weekdays[date_obj.getDay()].toLowerCase();

const startOfYear = new Date(year, 0, 1, 02, 00, 00);
const endOfYear = new Date(year, 11, 31, 23, 59, 59);

// Count the serial number of today and number of days in this year
const serialOfDay = Math.floor((date_obj - startOfYear) / 86400000);
const daysInYear = Math.floor(((endOfYear - startOfYear) / 86400000) + 1);

// Count the week number
const weekNumber = Math.floor(serialOfDay / 7);

// Build the text string
const text = `Tänään on ${weekday} ${date}.${month}.${year}.
Päivä ${serialOfDay}/${daysInYear}. Viikko ${weekNumber}.`;

// Change the emoji if it is Friday
if (date_obj.getDay() === 5)
  emoji = ':pizza';

// Need the day and the month in 2-digit value
const date2digit = ('0' + date_obj.getDate()).slice(-2);
const month2digit = ('0' + (date_obj.getMonth() + 1)).slice(-2);

// Build the name day string
const today = month2digit + date2digit;
const names = jsonData.nameday_list.fi[today].join(', ');

// Build the name day text as an array
const attachments = [
  {
    'mrkdwn_in': ['text'],
    'color': '#36a64f',
    'title': 'Nimipäivät tänään',
    'text': '`Suomalainen kalenteri:` ' + names,
  }
];

// Check if it is a special day
const specialNote = specialDates[today];
let specialAttachment = {};
if (specialNote) { 
  specialAttachment = {
    'mrkdwn_in': ['text'],
    'color': '#0021FF',
    'title': 'Hox!',
    'text': specialNote,
  };
}

attachments.push(specialAttachment);

const sendMessage = async () => {
  const client = new WebClient(process.env.SLACK_BOT_TOKEN, {
    logLevel: LogLevel.DEBUG
  });
  
  try {
    const result = await client.chat.postMessage({
      channel: channelId,
      username,
      icon_emoji: emoji,
      text,
      attachments
    });
    console.log('result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};

sendMessage();
