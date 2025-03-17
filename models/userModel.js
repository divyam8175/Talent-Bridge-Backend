import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Name is required']
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        validate: [validator.isEmail, 'Enter a valid email']
    },
    phone:{
        type: Number,
        required: [true, 'Phone number is required']
    },
    password:{
        type: String,
        required: [true, 'Password is required'],
        select: false
    },
    role:{
        type: String,
        required: [true, 'Role is required'],
        enum: ['Junior', 'Senior']
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password,10)
})

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

userSchema.methods.getJWTToken = function(){
    return JWT.sign({id:this._id}, process.env.JWT_SECRET_KEY, {expiresIn:process.env.JWT_EXPIRE})
}

export const userModel = mongoose.model('User', userSchema)