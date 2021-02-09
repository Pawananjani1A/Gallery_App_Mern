const {validationResult} = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");


var salt = bcrypt.genSaltSync(9);


const getUsers = async(req,res,next)=>{
    
    let users;
   try {
       //Find all users in the DB but don't fetch their passwords.
       users = await User.find({},"-password");
   } catch (err) {
       const error = new HttpError("Fetching users failed!Please try again later",500);
       return next(error);
   }

   if(!users || users.length===0)
   {
       const error = new HttpError("No user found",404);
       return next(error);
   }

    res.status(200).json({users:users.map(user=>user.toObject({getters:true}))});
     
};


const signUp = async(req,res,next)=>{

    const errors = validationResult(req);
    // console.log(req);
    if(!errors.isEmpty())
    {
        // console.log(errors);
       return next(new HttpError("Invalid inputs passed.Please check your data",422));
    }

  const {name,email,password} = req.body;

   let existingUser;
 try{
     existingUser = await User.findOne({email:email});
 }catch(err)
 {
    const error = new HttpError("SignUp failed!Please try again",500);
       return next(error);
 }

 if(existingUser)
 {
     const error = new HttpError("User exists already!Please login instead",422);
       return next(error);
 }
  
 let hashedPassword;
 try {
     hashedPassword = await bcrypt.hash(password,salt);
 } catch (err) {
     console.log(err);
     const error = new HttpError("Couldn't create user!Please try again",500);
     return next(error);
 }

  const createdUser = new User({
       name,
       email,
       password:hashedPassword,
       image:req.file.path,
       places:[]
  });

 
  try {
        await createdUser.save();
  } catch (err) {
      const error = new HttpError("SignUp failed!Please try again",500);
       return next(error);
  }

  let token;
  try {
      token = jwt.sign(
          {userId:createdUser.id,email:createdUser.email},
          process.env.JWT_KEY,
          {expiresIn:'1h'});

  } catch (err) {
      const error = new HttpError("SignUp failed !!Please try again",500);
       return next(error);
  }

  res.status(201).json({userId:createdUser.id,email:createdUser.email,token:token});
}

const login = async(req,res,next)=>{

    
   const {email,password} = req.body;

     let existingUser;
 try{
     existingUser = await User.findOne({email:email});
 }catch(err)
 {
    const error = new HttpError("Login failed!Please try again later",500);
       return next(error);
 }


   
   if(!existingUser)
   {
       return next(new HttpError("Please enter correct credentials.Couldn't login.",403)); //401 == Authentication Failed
   }

   let isValidPassword;
   try {
       isValidPassword = await bcrypt.compare(password,existingUser.password);
   } catch (err) {
       const error = new HttpError("Couldn't log you in,please try again later.",500);
       return next(error);
   }

   if(!isValidPassword)
   {
       return next(new HttpError("Please enter correct credentials.Couldn't login.",403)); //401 == Authentication Failed
   }

   let token;
  try {
      token = jwt.sign(
          {userId:existingUser.id,email:existingUser.email},
          process.env.JWT_KEY,
          {expiresIn:'1h'});

  } catch (err) {
      const error = new HttpError("Login failed!Please try again",500);
       return next(error);
  }


   res.status(202).json({userId:existingUser.id,email:existingUser.email,token:token});
}




exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;