require('dotenv').config();
const request = require('request');

const jsonData = require('./namedays.json');

const date_ob = new Date();

const date = ('0' + date_ob.getDate()).slice(-2);
const month = ('0' + (date_ob.getMonth() + 1)).slice(-2);

const today = month + date;
const names = jsonData.nameday_list.fi[today].join(', ');

const attachments = [
  {
    'mrkdwn_in': ['text'],
    'color': '#36a64f',
    'title': 'Nimipäivät tänään',
    'text': '`Suomalainen kalenteri:` ' + names,
  }
];

const options = {
  url: process.env.BOT_URL,
  json: true,
  body: {
    text: 'Päivän tärkeät tiedot',
    attachments
  }
};

request.post(options, (err) => {
  if (err) {
    console.error('Failed:', err);
  }
});
