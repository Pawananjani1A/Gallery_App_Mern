const fs = require('fs');
const {validationResult} = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const {getDummmyCoordsForAddress} = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");






const getPlaceById = async(req,res,next)=>{
//   console.log("GET requests in places");
  const pid = req.params.pid;
  let identifiedPlace;
  try{
       identifiedPlace = await Place.findById(pid);
  }catch(err)
  {
      const error = new HttpError("Something went wrong!Couldn't find a place",500);
      return next(error);
  }

  if(!identifiedPlace)
  {
   
    //Throw error is only possible inside synchronous functions
    //Inside async functions (more common with DBs), next(error) is appropriate.
    const error =  new HttpError("No place found with the provided id",404);
    return next(error);
  }
  else {
    //We want to return the place as a normal js object with the "id" property instead of "_id" property
    res.status(200).json({place:identifiedPlace.toObject({getters:true})});
  }
  
};


const getPlacesByUserId = async(req,res,next)=>{
    const uid = req.params.uid;
   
    let userPlaces;
   try{
       userPlaces = await User.findById(uid).populate('places');
   }catch(err){
          const error = new HttpError("Something went wrong!Couldn't find a place",500);
          return next(error);
   }
    if(!userPlaces || userPlaces.length===0) 
    {
       const error  = new HttpError("No places found!Maybe create one?",404);
      //More appropriate than throwing the error away
      return next(error);
    }
   
    res.status(200).json({places:userPlaces.places.map(place=>place.toObject({getters:true}))});
};

const createPlace = async(req,res,next)=>{

   const errors =  validationResult(req);

   if(!errors.isEmpty())
   {  
       console.log(errors);
      return next(new HttpError("Invalid inputs passed.Please check your data",422));
   }

  const {title,address,description} = req.body;
   let coordinates;
   try{
       coordinates = await getDummmyCoordsForAddress(address);
   }catch(err)
   {
        return next(err);
   }

   
    
    const createdPlace = new Place({
        title,
        description,
        address,
        location:coordinates,
        image:req.file.path,
        creator:req.userData.userId

    });

    let user;
    try {
        user = await User.findById(req.userData.userId);
    } catch (err) {
        const error = new HttpError("Creating place failed!Please try again later.",500);
        return next(error);
    }

    if(!user)
    {
        const error = new HttpError("Couldn't find the user for the provided userId",404);
        return next(error);
    }

    console.log(user);


    try{
           const sess = await mongoose.startSession();
           sess.startTransaction();
          await createdPlace.save({session:sess});
          user.places.push(createdPlace);
          await user.save({session:sess});
          await sess.commitTransaction();

    }catch(err) {
        const error = new HttpError("Creating Place Failed!Please try again.",500);
        return next(error);
    }
    // DUMMY_PLACES.push(createdPlace); //we can also do unshift(createdPlace) instead of push
    //201 is the route for creating something successfully

    res.status(201).json({place:createdPlace});
};

const updatePlace = async(req,res,next)=>{

     const errors =  validationResult(req);

   if(!errors.isEmpty())
   {  
       console.log(errors);
       return next(new HttpError("Invalid inputs passed.Please check your data",422));
   }

   const {title,description} = req.body;
   const placeId = req.params.pid;
   let place;
   try {
       place  = await Place.findById(placeId);
   } catch (err) {
        const error = new HttpError("Updating Place Failed!Please try again.",500);
        return next(error);
   }

   if(place.creator.toString() !==req.userData.userId)
   {
       const error = new HttpError("You are not allowed to edit this place.",401);
        return next(error);
   }
   
   if(!place || place.length===0)
   {
          const error = new HttpError("No such place found.Do you want to create one?",404);
          return next(error);
   }
   
  
       place.title = title;
       place.description = description;

        try {
       await place.save();
   } catch (err) {
        const error = new HttpError("Updating Place Failed!Please try again.",500);
        return next(error);
   }
     
       res.status(202).json({place:place.toObject({getters:true})});

};

const deletePlace = async(req,res,next)=>{
   const placeId = req.params.pid;
 
   let place;
   try {
       place = await Place.findById(placeId).populate('creator');
   } catch (err) {
       const error = new HttpError("Deleting Place Failed!Please try again.",500);
        return next(error);
   }

   if(!place)
   {
       const error = new HttpError("No such place found.Do you want to create one?",404);
        return next(error);
   }

   if(place.creator.id!==req.userData.userId)
   {
       const error = new HttpError("You are not allowed to delete this place.",401);
        return next(error);
   }

   const imagePath = place.image;

   try {
       const sess = await mongoose.startSession();
        sess.startTransaction();
        place.creator.places.pull(place);
        await place.creator.save();
        await place.remove();
        
   } catch (err) {
    //    console.log(err);
       const error = new HttpError("Deleting Place Failed!Please try again later",500);
        return next(error);
   }

   //Finally deleting the file from the server.
   fs.unlink(imagePath,err=>{
      console.log(err);
   });
   
   res.status(202).json({message:"Deleted Place"});
};


exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;