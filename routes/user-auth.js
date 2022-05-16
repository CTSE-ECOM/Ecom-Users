const router=require("express").Router();
const {signup, signin,signout,getAllUsers,getUserbyID,deleteByID,updateuser}=require('../controller/user-auth');
const { validateSigninRequest,validateSignupRequest, isRequestValidated } = require('../validations/auth')
const {validationResult,check}=require('express-validator');




router.post('/signup',validateSigninRequest, isRequestValidated,signup)
router.post("/signin",validateSignupRequest,isRequestValidated,signin);
router.post("/signout",validateSignupRequest,isRequestValidated,signout);
router.get("/user/viewuser",getAllUsers);
router.get('/user/getuserbyid/:_id',getUserbyID);
router.delete('/user/del/:_id',deleteByID);
router.put('/user/edit/:_id',updateuser);

module.exports=router;