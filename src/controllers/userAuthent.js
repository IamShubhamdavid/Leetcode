const redisClient = require("../config/redis");
const User= require("../models/user");
const validate=require('../utils/validator');
const bcrypt=require("bcrypt");
const jwt= require('jsonwebtoken');
const Submission = require('../models/submission');


const register = async(req,res)=>{
    try{
        // Validate the data
        validate(req.body);

        const {firstName, emailId, password}=req.body;
        req.body.password= await bcrypt.hash(password,10);
        req.body.role='user'

        // ye. neeche wala line ek se jyda user ko login nhi krne dega error maar dega
        const user = await User.create(req.body);

        const token = jwt.sign({_id:user._id,emailId:emailId, role:'user'},process.env.JWT_KEY,{expiresIn: 60*60});
        res.cookie('token',token,{maxAge:60*60*1000});
        res.status(201).send("User registered Successfully");

    }
    catch(err){
        res.status(400).send("Error:"+err);
    }
}

const login=async(req,res)=>{

    try{
        const {emailId,password} = req.body;

        if(!emailId)
            throw new Error("Invalid Crendentials");
        if(!password)
            throw new Error("INvalid Credentials");

        const user=await User.findOne({emailId});
        const match= await bcrypt.compare(password,user.password); 
        if(!match)
            throw new Error("Inval;id Crendentials");

        const token = jwt.sign({_id:user._id, emailId:emailId, role:user.role},process.env.JWT_KEY,{expiresIn: 60*60});
        res.cookie('token',token,{maxAge:60*60*1000});
        res.status(200).send("Logged in Successfully");
    }
    catch(err){
        res.status(401).send("Error: "+err);
    }
}

// logout feature

const logout = async(req,res)=>{
    try{
         // validate the token
        // Token add kr dunga Redis ke blocklist
        // Cookies ko clear kar dena...
        const {token}=req.cookies;

        const payload= jwt.decode(token);

        await redisClient.set(`token:${token}`,'Blocked');
        await redisClient.expireAt(`token:${token}`,payload.exp);

        res.cookie("tooken",null,{expires: new Date(Date.now())});
        res.send("Logged out Successfully");


    }
    catch(err){
        res.status(503).send("Error: "+err);
    }
}

const adminRegister = async(req,res)=>{
    try{
        // Validate data;
        validate(req.body);
        const {firstName,emailId,password} = req.body;

        req.body.password= await bcrypt.hash(password,10);
        // req.body.role='admin'


        const user = await User.create(req.body);
        // role:'admin'
        const token = jwt.sign({_id:user._id,emailId:emailId, role:user.role},process.env.JWT_KEY,{expiresIn: 60*60});
        res.cookie('token',token,{maxAge:60*60*1000});
        res.status(201).send("User registered Successfully");

    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}

const deleteProfile = async(req,res)=>{

    try{
        const userId = req.result._id;

        // userSchema delete
        await User.findByIdAndDelete(userId);

        // Submission se bhi delete kro
        //await Submission.deleteMany({userId});

        // other method in user.js

        res.status(200).send("Deleted Successfully");

    }
    catch(err){
        res.status(500).send("Internal Server Error");
    }
}

module.exports={register, login, logout, adminRegister, deleteProfile};
