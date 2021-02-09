const multer = require('multer');
const { v4: uuidv4 } = require("uuid");

const MIME_TYPE_MAP = {
    'image/png':'png',
    'image/PNG':'png',
    'image/jpeg':'jpeg',
    'image/JPEG':'jpeg',
    'image/jpg':'jpg',
    'image/JPG':'jpg',
    'image/gif':'gif',
    'image/GIF':'GIF'
};

const fileUpload = multer({
    limits:500000,
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,'uploads/images');
        },
        filename:(req,file,cb)=>{
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null,uuidv4()+'.'+ext);
        },
     fileFilter:(req,file,cb)=>{
         //The double ! sign is used to convert undefined to false and defined to true
         const isValid = !!MIME_TYPE_MAP[file.mimetype];
         let error = isValid?null:new Error("Invalid mimetype!");
         cb(error,isValid);
     }
    })
});



module.exports = fileUpload;