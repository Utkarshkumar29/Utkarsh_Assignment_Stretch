const mongoose=require('mongoose')

const StudentSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    gravatar:{
        type:String,
    },
    techStack:{
        type:[String],
    },
    location:{
        type:String
    },
    fieldOfInterest:{
        type:[String],
    },
    seeking:{
        type:[String]
    },
    bio:{
        type:String
    },
    githubURL:{
        type:String
    },
    websiteURL:{
        type:String
    },
    twitterURL:{
        type:String
    },
    linkedInURL:{
        type:String
    },
    image:{
        type:[String]   
    }
})

const Student=mongoose.model('Student',StudentSchema)

module.exports=Student