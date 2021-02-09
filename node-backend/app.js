const fs = require('fs');
const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const placesRoutes = require("./routes/placesRoutes");
const usersRoutes= require("./routes/usersRoutes");
const HttpError = require("./models/http-error");



const app = express();



app.use(bodyParser.json());

app.use('/uploads/images',express.static(path.join('uploads','images')));


app.use((req,res,next)=>{

   //'*' denotes which domains are allowed cross-site access.Here we're allowing all sites.
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE');

    next();
});


app.use("/api/places",placesRoutes);

app.use("/api/users",usersRoutes);



app.use((req, res,next)=>{
    
    const error = new HttpError("Couldn't find this route.",404);
     throw(error);
});

//This error handler(with 4 parameters) middleware is automatically triggered 
//whenever some function in the above lines throw or pass any error.
app.use((error,req, res,next)=>{
   
    if(req.file)
    {
        fs.unlink(req.file.path,err=>{
            console.log(error);
        });
    }
    if(res.headerSent) return next(error);

    res.status(error.code || 500);
    res.json({message:error.message||"An unknown error occured."});
});


const options = {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
};


mongoose
.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.eidmm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,options)
.then(()=>{
app.listen(5000,()=>{
    console.log("App is running on port 5000");
});
})
.catch(error=>{
    // console.log(process.env.DB_NAME);
    console.log(error);
});



