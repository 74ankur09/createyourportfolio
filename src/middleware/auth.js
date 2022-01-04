const jwt = require('jsonwebtoken')
const User = require('../model/userModel');

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.authToken;
        
        const JWT_SECRET = process.env.JWT_SECRET
        const decoded = jwt.verify(token, JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id })

        if (!user) {
            return res.render('login', {
                layout: false
            });
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        return res.redirect('/user');
    }
}

module.exports = auth
