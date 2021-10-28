require('dotenv').config();
const axios = require('axios');
const { WebClient, LogLevel } = require('@slack/web-api');

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
  0: 'Sunnuntai',
};

const getNamesOfDate = async (thisDate) => {
  const url = `https://api-the-great.herokuapp.com/api/v1/nameday?date=${thisDate}&fi=1&se=1`;
  const config = {
    headers: {
      'x-api-key': process.env.API_KEY,
    },
  };

  try {
    const res = await axios.get(url, config);
    return res.data;
  } catch (err) {
    console.error('error:', err);
  }
};

const getDailyChuck = async () => {
  try {
    const res = await axios.get('https://api.chucknorris.io/jokes/random');
    const chuck = {
      mrkdwn_in: ['text'],
      color: '#3e3e3e',
      title: 'Daily Chuck Norris :muscle:',
      text: res.data.value,
    };
    return chuck;
  } catch (err) {
    console.error(err);
    return {};
  }
};

const getDailyTrump = async () => {
  try {
    const res = await axios.get(
      'https://api.whatdoestrumpthink.com/api/v1/quotes/random'
    );
    const trump = {
      mrkdwn_in: ['text'],
      color: '#3e3e3e',
      title: 'Daily Donald Trump :sheep:',
      text: res.data.message,
    };
    return trump;
  } catch (err) {
    console.error(err);
    return {};
  }
};

const sendMessage = async (text, attachments) => {
  const client = new WebClient(process.env.SLACK_BOT_TOKEN, {
    logLevel: LogLevel.DEBUG,
  });

  try {
    await client.chat.postMessage({
      channel: channelId,
      username,
      icon_emoji: emoji,
      text,
      attachments,
    });
  } catch (error) {
    console.error('Error:', error);
  }
};

const dailySlackBot = async () => {
  // Get the numbers of today
  const date_obj = new Date();
  const date = date_obj.getDate();
  const month = date_obj.getMonth() + 1;
  const year = date_obj.getFullYear();

  // Set the weekday in Finnish
  const weekday = weekdays[date_obj.getDay()].toLowerCase();

  // eslint-disable-next-line
  const startOfYear = new Date(year, 0, 1, 02, 00, 00);
  const endOfYear = new Date(year, 11, 31, 23, 59, 59);

  // Count the serial number of today and number of days in this year
  const serialOfDay = Math.floor((date_obj - startOfYear) / 86400000);
  const daysInYear = Math.floor((endOfYear - startOfYear) / 86400000 + 1);

  // Build the text string
  const text = `Tänään on ${weekday} ${date}.${month}.${year}. Päivä ${serialOfDay}/${daysInYear}.`;

  // Change the emoji if it is Friday
  if (date_obj.getDay() === 5) emoji = ':pizza';

  // Need the day and the month in 2-digit value
  const date2digit = ('0' + date_obj.getDate()).slice(-2);
  const month2digit = ('0' + (date_obj.getMonth() + 1)).slice(-2);

  // Get the names of the date from the nameday API
  const today = month2digit + date2digit;
  const allNames = await getNamesOfDate(today);

  // Build the name day text as an array
  let attachments = [];
  if (allNames.fi && allNames.se) {
    attachments = [
      {
        mrkdwn_in: ['text'],
        color: '#36a64f',
        title: 'Nimipäivät tänään :flag-fi:',
        text: '`Suomenkielinen kalenteri:` ' + allNames.fi.join(', '),
      },
      {
        mrkdwn_in: ['text'],
        color: '#36a64f',
        title: 'Namnsdagar idag :flag-se:',
        text: '`Ruotsinkielinen kalenteri:` ' + allNames.se.join(', '),
      },
    ];
  }

  // Check if it is a special day
  // const specialNote = specialDates[today];
  // let specialAttachment = {};
  // if (specialNote) {
  //   specialAttachment = {
  //     mrkdwn_in: ['text'],
  //     color: '#0021FF',
  //     title: 'Hox!',
  //     text: specialNote,
  //   };
  // }
  // attachments.push(specialAttachment);

  const chuckNorris = await getDailyChuck();
  attachments.push(chuckNorris);

  const donaldTrump = await getDailyTrump();
  attachments.push(donaldTrump);

  sendMessage(text, attachments);
};

dailySlackBot();
