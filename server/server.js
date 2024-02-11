const express=require('express')
const app=express()
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const cookieParser=require('cookie-parser')
const multer=require('multer')
const fs=require('fs')
const cors=require('cors')

app.use(express.json())
app.use(cookieParser())
app.use(cors())
require('dotenv').config()
const AccountModel=require('./db/student')
const jwtsecretKey='Bytive'
app.use('/uploads',express.static(__dirname+'/'))

app.get('/',(req,res)=>{
    res.send('Hello world')
})

const authController=require('./controllers/accountControllers')

mongoose.connect(process.env.MongoDB_URL).then(() => {
    console.log("MongoDB Connected")
}).catch((error) => {
    console.log(error)
}) 

const photosMiddleware=multer({dest:'uploads/'})

app.post('/upload',photosMiddleware.array('photos',100),(req,res)=>{
    const uploadFiles=[]
    for (let i=0; i<req.files.length; i++) {
        const {path,originalname}=req.files[i]
        const parts=originalname.split('.')
        const ext=parts[parts.length - 1]
        const newPath=path+'.'+ext
        fs.renameSync(path,newPath)
        uploadFiles.push(newPath.replace('uploads/',''))
    }
    console.log('Files uploaded successfully:',uploadFiles)
    res.json(uploadFiles)
})

app.get('/accounts',authController.fetchAccount)
app.post('/accountSignUp',authController.handleAccountSignUp)
app.post('/login',authController.handleLogin)
app.get('/user',authController.fetchUserAccount)
app.put('/updateAccount/:id',authController.handleUpdate)
app.delete('/delete/:id',authController.handleDelete)

app.listen(4000,async()=>{
    try {
        console.log("Connected to the server at 4000");
    } catch (error) {
        console.error("Server start error:", error);
    }
})
