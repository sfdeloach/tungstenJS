const colors = require('colors');

const CHECK = '\u2714';
const X = '\u2716';
const defined = `${CHECK} defined`.green;
const notDefined = `${X} not defined`.red;

module.exports = function() {
  var prod = process.env.DEVELOPMENT ? false : true;
  prod
    ? console.log('Starting server in ' + 'production'.blue.bold + ' mode...')
    : console.log('Starting server in ' + 'development'.blue.bold + ' mode...');

  const m = {};
  m.port = process.env.PORT ? defined : notDefined;
  m.databaseURL = process.env.DATABASE_URL ? defined : notDefined;
  m.sendgridUser = process.env.SENDGRID_USER ? defined : notDefined;
  m.sendgridPass = process.env.SENDGRID_PASS ? defined : notDefined;
  m.sessionSecret = process.env.SESSION_SECRET ? defined : notDefined;

  console.log('            PORT: ' + m.port);
  console.log('    DATABASE_URL: ' + m.databaseURL);
  console.log('   SENDGRID_USER: ' + m.sendgridUser);
  console.log('   SENDGRID_PASS: ' + m.sendgridPass);
  console.log('  SESSION_SECRET: ' + m.sessionSecret);

  if (
    prod &&
    !(
      process.env.PORT &&
      process.env.DATABASE_URL &&
      process.env.SENDGRID_USER &&
      process.env.SENDGRID_PASS &&
      process.env.SESSION_SECRET
    )
  ) {
    throw new Error(
      'Application flagged for production, but environment variables are not set.'
    );
  }
};
