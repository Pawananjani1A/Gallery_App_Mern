const jwt = require('jsonwebtoken');
const HttpError = require("../models/http-error");

module.exports = (req,res,next)=>{
  
    //If the request method is switched to OPTIONS due to normal browsr behaviour,just allow it to pass trough the routes
    if(req.method==='OPTIONS') return next();

    try {
       const token = req.headers.authorization.split(' ')[1]; // Authorization:'Bearer TOKEN' 
       if(!token)
    {
       throw new Error('Authentication failed!');
    }

    const decodedToken = jwt.verify(token,process.env.JWT_KEY);
    req.userData = {userId:decodedToken.userId};
    next();
    } catch (err) {
        const error = new HttpError("Authentication Failed!",403);
       return next(error);
    }
    
};