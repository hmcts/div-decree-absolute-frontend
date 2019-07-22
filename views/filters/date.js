const moment = require('moment');

const date = input => {
  const dateAsMoment = moment(new Date(input));
  if (dateAsMoment.isValid()) {
    return dateAsMoment.format('DD MMMM YYYY');
  }
  return input;
};

module.exports.date = date;
