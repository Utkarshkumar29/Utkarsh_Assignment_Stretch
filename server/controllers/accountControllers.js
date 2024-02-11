const express=require('express')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const jwtsecretKey='Bytive'

const AccountModel=require('../db/student')

const fetchAccount=async(req,res)=>{
    try {
        const response = await AccountModel.find()
        if(!response){
            res.status(404).json("No account found")
        }else{
            res.status(200).json(response)
        }
    } catch (error) {
        console.log("Error getting accounts from database",error)
    }
}

const handleAccountSignUp=async(req,res)=>{
    const {name, email, password, location, github, twitter, website, linkedIn, fieldOfInterest, seeking, techStack, bio, image}=req.body
    const hashedPassword=await bcrypt.hash(password,10)
    console.log(image)
    try {
        const student=new AccountModel({
            name:name,
            email:email,
            password:hashedPassword,
            location:location,
            githubURL:github,
            twitterURL:twitter,
            websiteURL:website,
            linkedInURL:linkedIn,
            fieldOfInterest:fieldOfInterest,
            seeking:seeking,
            techStack:techStack,
            bio:bio,
            image:image
        })
        const response=await student.save()
        jwt.sign({
            email:email,
            userId:response._id
        },jwtsecretKey,{},(err,token)=>{
            if(err) throw err
            res.cookie('token',token).json("Student Info saved")
        })
    } catch (error) {
        console.log("Error sending data from server to the database",error)
    }
}

const handleLogin=async(req,res)=>{
    const {email,password}=req.body
    try {
        const response=await AccountModel.findOne({email})
        const confirmPassword=bcrypt.compareSync(password,response.password)
        if(!response) {
            return res.status(404).json("Account not found")
        }else if(!confirmPassword){
            return res.status(401).json("Password is incorrect")
        }
        const token=jwt.sign({email:email,userId:response._id}, jwtsecretKey,{})
        res.status(200).cookie('token',token).json(response._id)
    } catch (error) {
        console.log("Error finding acount",error)   
    }
}

const fetchUserAccount=async(req,res)=>{
    const token = req.cookies.token
    console.log(token)
    if (!token) {
        return res.status(401).json({error: "Unauthorized: No token provided"})
    }
    try {
        const decoded=jwt.verify(token,jwtsecretKey)
        const user=await AccountModel.findOne({email:decoded.email})
        if(!user){
            return res.status(404).json("Error")
        }
        res.status(200).send(user)
    } catch (error) {
        return res.status(401).json({error: "Unauthorized: Invalid token"})
    }
}

const handleUpdate=async(req,res)=>{
    const {id}=req.params
    const token=req.cookies.token
    const {name, email, location, github, twitter, website, linkedIn, fieldOfInterest, seeking, techStack, bio, image}=req.body
    try {
        const useraccountData=jwt.verify(token, jwtsecretKey)
        if (useraccountData.userId!==id) {
            return res.status(403).json({ error: "Forbidden: You don't have permission to update this account" });
        }
        const updatedAccount=await AccountModel.findByIdAndUpdate(id)
        if (!updatedAccount) {
            return res.status(404).json("Account not found");
        }
        updatedAccount.set({
            name:name,
            location:location,
            githubURL:github,
            twitterURL:twitter,
            websiteURL:website,
            linkedInURL:linkedIn,
            fieldOfInterest:fieldOfInterest,
            seeking:seeking,
            techStack:techStack,
            bio:bio,
            image:image
        })
        const response=await updatedAccount.save()
        if(!response){
            return res.status(404).json("Failed storing the data")
        }
        res.status(200).json('Account Updated')
    } catch (error) {
        console.log("Error updating the data",error)
    }
}

const handleDelete=async(req,res)=>{
    const {id}=req.params
    try {
        const response=await AccountModel.findByIdAndDelete(id)
        if(!response){
            return res.status(404).json("Failed deleting the account")
        }
        res.status(200).send("Deleted Successfully")
    } catch (error) {
        console.log("Error deleting the account",error)
    }
}

module.exports={
    fetchAccount,
    handleAccountSignUp,
    handleLogin,
    fetchUserAccount,
    handleUpdate,
    handleDelete
}