const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports.isAuth = async (req, res, next) => {
    let token = req.cookies['jwt'];
    if (!token) return res.redirect('/auth/login');

    try {
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);  
        const user = await User.findById(tokenData.id);
        req.user = user;
        next();
    } catch (err) {
        if (err.message === 'jwt expired') return res.redirect('/auth/logout');
        res.status(400).json({ error: err });
    }
}
