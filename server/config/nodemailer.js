const nodemailer = require('nodemailer');
const key = require('../../keys/keys');

const transporter = nodemailer.createTransport({
  service: 'SendPulse', // no need to set host or port etc.
     auth: {
         user: key.loginInfo.username,
         pass: key.loginInfo.password
     }
});

const mailOptions = {
  from: '"Youth Draft" <' + key.smtp + '>', // sender address
  to: '', // list of receivers
  subject: '', // Subject line
  html: ''// plain text body
};


const resetPassword = data => {
  return {
    subject: `Resetting TravelBall password`,
    html: `<p><span style="padding-bottom:2em;display:block">Hello,</span>
      <span style="padding-bottom:1em;display:block">Your password has been reset for TravelBall. Here is your new password:</span>
      <span style="padding-bottom:1em;display:block">` + data.password + `</span>
      <span style="padding-bottom:2em;display:block">Once inside your account, please remember to change your password to
        something more memorable.</span>
      <span style="display:block">Sincerely,</span>
      <span style="display:block">The Youthdraft Team</span>`
  };
};

const inviteCoaches = data => {
  return {
    subject: `You have been invited to TravelBall`,
    html : `<p><span style="padding-bottom:2em;display:block">Hello,</span>
      <span style="padding-bottom:0.5em;display:block">Congratulations! You have been invited to TravelBall by ` +
      data.inviterEmail + `.  You can download the TravelBall app on the iOS AppStore.
      <span style="padding-bottom:1em;display:block">Use the provided email address: ` + data.email +
      `<span style="padding-bottom:2em;display:block">And this password: ` + data.password +
      `<span style="padding-bottom:2em;display:block">Once inside your account, please remember to change your password to
        something more memorable.</span>
      <span style="display:block">Sincerely,</span>
      <span style="display:block">The Youthdraft Team</span>`
  }
};

module.exports =  {
  transporter,
  mailOptions,
  resetPassword,
  inviteCoaches
}
