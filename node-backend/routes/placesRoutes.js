const express = require('express');
const {check} = require("express-validator");

const placesController = require("../controllers/places-controller");
const fileUpload = require("../middleware/file-upload");
const authenticate = require("../middleware/authenticate");

const {getPlaceById,getPlacesByUserId,createPlace,updatePlace,deletePlace}  = placesController;

const router = express.Router();




router.get("/:pid",getPlaceById);

router.get("/user/:uid",getPlacesByUserId);

//Any route after this line will have to pass through authentication process
router.use(authenticate);

router.post("/",fileUpload.single('image'),[
    check('title').not().isEmpty(),
    check('description').isLength({min:5}),
    check('address').not().isEmpty(),
],createPlace);

router.patch("/:pid",[
    check('title').not().isEmpty(),
    check('description').isLength({min:5})
],updatePlace);

router.delete("/:pid",deletePlace);


module.exports = router;