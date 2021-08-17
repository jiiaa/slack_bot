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
    'pretext': 'Nyt se toimii',
    'author_name': 'Name Day Bot',
    'title': 'Nimipäivät tänään',
    'text': '`Suomalainen kalenteri:` ' + names,
  }
]

const options = {
  url: process.env.BOT_URL,
  json: true,
  body: {
    username: 'Nodejs bot',
    attachments
  }
};

request.post(options, (err, res, body) => {
  if (err) {
    console.error('Failed:', err);
  }
  console.log('Code: %s\nMessage: %s', res.statusCode, res.statusMessage);
  console.log('Body:', body);
});

console.log(names);

