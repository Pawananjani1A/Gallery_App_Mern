const express = require('express');
const {check} = require("express-validator");


const fileUpload = require("../middleware/file-upload");
const {getUsers,signUp,login} = require("../controllers/users-controller");
var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

const router = express.Router();


router.get("/",getUsers);

router.post("/signup",fileUpload.single('image'),[
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').matches(strongRegex)
],signUp);

router.post("/login",login);

module.exports = router;