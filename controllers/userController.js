import { catchAsyncErrors } from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../middlewares/error.js"
import { userModel } from "../models/userModel.js"
import { sendToken } from "../utils/jwtToken.js"

export const register = catchAsyncErrors(async(req,res,next)=>{
    const {name, email, phone, role, password} = req.body
    if(!name || !email || !phone || !role || !password){
        return next(new ErrorHandler('Please fill in the required fields'))
    }
    const existingEmail = await userModel.findOne({email})
    if(existingEmail){
        return next(new ErrorHandler('Email already exists'))
    }
    const user = await userModel.create({name,email,phone,role,password})
    sendToken(user,200,res,'User registered successfully')
})

export const login = catchAsyncErrors(async(req,res,next)=>{
    const {email,password,role} = req.body
    if(!email || !password || !role){
        return next(new ErrorHandler('Please fill in the required fields'))
    }
    const user = await userModel.findOne({email}).select('+password')
    if(!user){
        return next(new ErrorHandler('Invalid email or password', 400))
    }
    const isPasswordMatching = await user.comparePassword(password)
    if(!isPasswordMatching){
        return next(new ErrorHandler('Invalid email or password', 400))
    }
    if(user.role!==role){
        return next(new ErrorHandler('User with this role not found', 400))
    }
    sendToken(user,200,res,'User logged in successfully')
})

export const logout = catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie('token','',{ httpOnly:true, expires:new Date(Date.now()), secure:true, sameSite:"None",
    }).json({
        success: true,
        message: 'User logged out successfully'
    })
})

export const getUser = catchAsyncErrors((req,res,next)=>{
    const user = req.user
    res.status(200).json({
        success: true,
        user
    })
})