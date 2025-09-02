const User= require("../models/user");
const validate=require('../utils/validator');
const bcrypt=require("bcrypt");
const jwt= require('jsonwebtoken');

const register = async(req,res)=>{
    try{
        // Validate the data
        validate(req.body)

        const {firstName, emailId, password}=req.body;
        req.body.password= await bcrypt.hash(password,10);

        // ye. neeche wala line ek se jyda user ko login nhi krne dega error maar dega
        const user = await User.create(req.body);

        const token = jwt.sign({_id:user._id,emailId:emailId},process.env.JWT_KEY,{expiresIn: 60*60});
        res.cookie("token",token,{maxAge:60*60*1000});
        res.status(201).send("User registered Successfully");

    }
    catch(err){
        res.status(400).send("Error:"+err);
    }
}

const login=async(req,res)=>{

    try{
        const {emailId,password}=req.body;

        if(!emailId)
            throw new Error("Invalid Crendentials");
        if(!password)
            throw new Error("INvalid Credentials");

        const user=await User.findOne({emailId});
        const match= bcrypt.compare(password,user.password); 
        if(!match)
            throw new Error("Inval;id Crendentials");

        const token = jwt.sign({_id:user._id,emailId:emailId},process.env.JWT_KEY,{expiresIn: 60*60});
        res.cookie("token",token,{maxAge:60*60*1000});
        res.status(200).send("Logged in Successfully");
    }
    catch(err){
        res.status(401).send("Error:"+err);
    }
}

// logout feature

const logout= async(req,res)=>{
    try{
        

    }
    catch(err){

    }
}
