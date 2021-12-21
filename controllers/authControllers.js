const path = require('path');
const jwt = require('jsonwebtoken');
const oAuth2Client = require('../config/oAuth2Client');
const User = require('../models/User');

module.exports.getLogin = async (req, res) => {
    res.render('login', {error: null});
}

module.exports.getLogout = async (req, res) => {
  res.cookie('jwt', '', {
    maxAge: 0, // deletes cookie
  })
  .redirect('/auth/login');
}

module.exports.postLogin = async (req, res) => {
  let token = req.cookies['jwt'];

  if (!token) {
    const authCodeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ["https://www.googleapis.com/auth/calendar.readonly", 
      "https://www.googleapis.com/auth/calendar.events.readonly"]
    });
    return res.redirect(authCodeUrl);
  }
  res.redirect('/dashboard');  
}

module.exports.googleRedirect = async (req, res) => {
    let token = req.cookies['jwt'];
    if (token) return res.redirect('/auth/login');
    const code = req.query.code;
  
    try {
      const { tokens } = await oAuth2Client.getToken(code);
  
      let user = await User.findOne({ resresh_token: tokens.refresh_token });
  
      if (!user) {
        const newUser = new User({ 
          access_token: tokens.access_token, 
          refresh_token: tokens.refresh_token, 
          expiryDate: tokens.expiry_date 
        });
        user = await newUser.save();
      }
          
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
      if (!token) return res.status(403).redirect('/auth/login');
  
      res.cookie('jwt', token, {
        maxAge: 9999 * 999999,
        httpOnly: true, // prevents JavaScript cookie access (XSS attacks)
      })
      .redirect('/dashboard');
  
    } catch (err) {
      console.error('Something went wrong...', err);
      res.redirect('/auth/login');
    }
}
