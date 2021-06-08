const jwt = require('jsonwebtoken');
module.exports = function (req,res,next) {
    const token = req.header('auth-user');
    if(!token){
        return res.status('401').send('Access Denied');
    }
    try{
        const verified_token = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        req.user = verified_token
        next()
    }catch (err){
        res.status(401).json({Message: 'Invalid Token in the Header'})
    }
}