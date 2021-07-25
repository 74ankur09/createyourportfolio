const jwt = require('jsonwebtoken')
const User = require('../model/userModel');

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.authToken;

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

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