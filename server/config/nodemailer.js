const nodemailer = require('nodemailer');
const key = require('../../keys/keys');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: key.auth
});

const mailOptions = {
  from: '"Youth Draft" <' + key.smtp + '>', // sender address
  to: '', // list of receivers
  subject: '', // Subject line
  html: ''// plain text body
};


const resetPassword = data => {
  return {
    subject:`Resetting Travelball password`,
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
  return new Promise((resolve, reject) => {
    let replaced = ""
    const html = `<p><span style="padding-bottom:2em;display:block">Hello,</span>
  <span style="padding-bottom:0.5em;display:block">Congratulations! You have been added as coach for %%name%% by
    .  You can now sign into either your Youthdraft mobile app or at <a href='http://Youthdraft.com'>
      Youthdraft.com</a> using your email and the following password:</span>
    <span style="padding-bottom:0.5em;display:block">%%password%%</span>
    <span style="padding-bottom:2em;display:block">Once inside your account, please remember to change your password to
      something more memorable.</span>
    <span style="display:block">Sincerely,</span>
    <span style="display:block">The Youthdraft Team</span>`;
    const parts = html.split(/(\%\%\w+?\%\%)/g).map(function(v) {
      replaced = v.replace(/\%\%/g,"");
      return data[replaced] || replaced;
    });
    resolve(parts.join(""))
  })
};

module.exports =  {
  transporter,
  mailOptions,
  resetPassword,
  inviteCoaches
}
