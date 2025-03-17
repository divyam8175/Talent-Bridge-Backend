import { catchAsyncErrors } from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../middlewares/error.js"
import { applicationModel } from "../models/applicationModel.js"
import cloudinary from 'cloudinary'
import { vacancyModel } from "../models/vacancyModel.js"

export const seniorGetAllApplications = catchAsyncErrors(async(req,res,next)=>{
    const {role} = req.user
    if(role==='Junior'){
        return next(new ErrorHandler('Juniors are not allowed to access this resource', 400))
    }
    const {_id} = req.user
    const applications = await applicationModel.find({'seniorID.user':_id})
    res.status(200).json({
        success: true,
        applications
    })
})

export const juniorGetAllApplications = catchAsyncErrors(async(req,res,next)=>{
    const {role} = req.user
    if(role==='Senior'){
        return next(new ErrorHandler('Seniors are not allowed to access this resource', 400))
    }
    const {_id} = req.user
    const applications = await applicationModel.find({'applicantID.user':_id})
    res.status(200).json({
        success: true,
        applications
    })
})

export const juniorDeleteApplication = catchAsyncErrors(async(req,res,next)=>{
    const {role} = req.user
    if(role==='Senior'){
        return next(new ErrorHandler('Seniors are not allowed to access this resource', 400))
    }
    const {id} = req.params
    const application = await applicationModel.findById(id)
    if(!application){
        return next(new ErrorHandler('Requested application not found', 404))
    }
    await application.deleteOne()
    res.status(200).json({
        success: true,
        message: 'Application deleted successfully'
    })
})

export const postApplication = catchAsyncErrors(async(req,res,next)=>{
    const {role} = req.user
    if(role==='Senior'){
        return next(new ErrorHandler('Seniors are not allowed to submit applications', 400))
    }
    if(!req.files || Object.keys(req.files).length===0){
        return next(new ErrorHandler('Please upload your resume', 400))
    }
    const {resume} = req.files
    const allowedFormats = ['image/png', 'image/jpg', 'image/webp']
    if(!allowedFormats.includes(resume.mimetype)){
        return next(new ErrorHandler('Invalid file type.', 400))
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(resume.tempFilePath)
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error("Cloudinary Error : ", cloudinaryResponse.error || 'Unknown cloudinary error')
        return next(new ErrorHandler('Failed to upload resume', 500))
    }
    const {name,email,phone,branch,vacancyId} = req.body
    const applicantID = {
        user: req.user._id,
        role: 'Junior'
    }
    if(!vacancyId){
        return next(new ErrorHandler('Vacancy not found', 404))
    }
    const vacancyDetails = await vacancyModel.findById(vacancyId)
    if(!vacancyDetails){
        return next(new ErrorHandler('Vacancy not found', 404))
    }
    const seniorID = {
        user: vacancyDetails.postedBy,
        role: 'Senior'
    }
    if(!name || !email || !phone || !branch || !seniorID || !applicantID || !resume){
        return next(new ErrorHandler('Please fill the required fields', 400))
    }
    const application = await applicationModel.create({
        name, email, phone, branch, applicantID, seniorID,
        resume: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        }
    })
    res.status(200).json({
        success: true,
        message: 'Application submitted successfully',
        application
    })
})

