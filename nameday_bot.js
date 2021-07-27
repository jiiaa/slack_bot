const fs = require('fs');

const jsonData = require('./namedays.json');

const date_ob = new Date();

const date = ('0' + date_ob.getDate()).slice(-2);
const month = ('0' + (date_ob.getMonth() + 1)).slice(-2);

const today = month + date;
const names = jsonData.nameday_list.fi[today].join(', ');

console.log(names);

