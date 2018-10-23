module.exports = function() {
  var prod = process.env.DEVELOPMENT ? false : true;
  prod
    ? console.log('Checking environment variables...')
    : console.log('Starting server under \x1b[34mdevelopment\x1b[0m mode...');

  var port = process.env.PORT
      ? '\x1b[32m\u2714 defined\x1b[0m'
      : '\x1b[31m\u2716 not defined\x1b[0m',
    databaseURL = process.env.DATABASE_URL
      ? '\x1b[32m\u2714 defined\x1b[0m'
      : '\x1b[31m\u2716 not defined\x1b[0m',
    sendgridUser = process.env.SENDGRID_USER
      ? '\x1b[32m\u2714 defined\x1b[0m'
      : '\x1b[31m\u2716 not defined\x1b[0m',
    sendgridPass = process.env.SENDGRID_PASS
      ? '\x1b[32m\u2714 defined\x1b[0m'
      : '\x1b[31m\u2716 not defined\x1b[0m',
    sessionSecret = process.env.SESSION_SECRET
      ? '\x1b[32m\u2714 defined\x1b[0m'
      : '\x1b[31m\u2716 not defined\x1b[0m';

  console.log('            PORT: ' + port);
  console.log('    DATABASE_URL: ' + databaseURL);
  console.log('   SENDGRID_USER: ' + sendgridUser);
  console.log('   SENDGRID_PASS: ' + sendgridPass);
  console.log('  SESSION_SECRET: ' + sessionSecret);

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
      'Application is set for production, however, environment variables have not been properly set.'
    );
  }
};
