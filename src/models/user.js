const mongoose= require('mongoose');
const {Schema}=mongoose;

const userSchema=new Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20
    },
    lastName:{
        type:String,
        minLength:3,
        maxLength:20,
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        immutable:true,
    },
    age:{
        type:Number,
        min:10,
        max:80,
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    problemSolved:{
        // type:[String]
        type:[{
            type:Schema.Types.ObjectId,
            ref:'problem'
        }],
        unique:true
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

// pre ka mtlb pehle chlega isliye yaha pr usko use nhi kiye h
userSchema.post('findOneAndDelete', async function (doc){
    if(userInfo){
        await mongoose.model('submission').deleteMany({userId: userInfo._id});
    }
});

const User=mongoose.model("user",userSchema);

module.exports= User;

