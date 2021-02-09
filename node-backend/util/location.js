const axios = require('axios');

const HttpError = require("../models/http-error");

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

function getDummmyCoordsForAddress(address){
   
    return  {
            lat: 27.1751448,
            lng: 78.0421422
        };
}

async function getCoordsForAddress(address){

     const encodedAddress = encodeURIComponent(address);
    const reqUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=+${encodedAddress}&key=${API_KEY}`;
   const response = await axios.get(reqUrl);

   const data = response.data;

   if(!data||data.status==="ZERO_RESULTS")
   {
        const error = new HttpError("Couldnt find location for the specified address.",422);
        throw error;
   }

   const coordinates = data.results[0].geometry.location;
   
    return  coordinates;
}


exports.getCoordsForAddress = getCoordsForAddress;
exports.getDummmyCoordsForAddress = getDummmyCoordsForAddress;

