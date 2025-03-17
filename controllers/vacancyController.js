import { catchAsyncErrors } from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../middlewares/error.js"
import { vacancyModel } from "../models/vacancyModel.js"

export const getAllVacancies = catchAsyncErrors(async(req,res,next)=>{
    const vacancies = await vacancyModel.find({expired:false})
    res.status(200).json({
        success: true,
        vacancies
    })
})

export const postVacancy = catchAsyncErrors(async(req,res,next)=>{
    const {role} = req.user
    if(role==='Junior'){
        return next(new ErrorHandler('Juniors are not allowed to post vacancies', 400))
    }
    const {title, description, team} = req.body
    if(!title || !description || !team){
        return next(new ErrorHandler('Please fill in the required fields', 400))
    }
    const postedBy = req.user._id
    const vacancy = await vacancyModel.create({title, description, team, postedBy})
    res.status(200).json({
        success: true,
        message: 'Vacancy created successfully',
        vacancy
    })
})

export const getMyVacancies = catchAsyncErrors(async(req,res,next)=>{
    const {role} = req.user
    if(role==='Junior'){
        return next(new ErrorHandler('Juniors are not allowed to modify vacancies', 400))
    }
    const myVacancies = await vacancyModel.find({postedBy:req.user._id})
    res.status(200).json({
        success: true,
        myVacancies
    })
})

export const updateVacancy = catchAsyncErrors(async(req,res,next)=>{
    const {role} = req.user
    if(role==='Junior'){
        return next(new ErrorHandler('Juniors are not allowed to modify vacancies', 400))
    }
    const {id} = req.params
    let vacancy = await vacancyModel.findById(id)
    if(!vacancy){
        return next(new ErrorHandler('Requested vacancy not found', 404))
    }
    vacancy = await vacancyModel.findByIdAndUpdate(id, req.body, {new:true, runValidators:true, useFindAndModify:false})
    res.status(200).json({
        success: true,
        message: 'Vacancy updated successfully',
        vacancy
    })
})

export const deleteVacancy = catchAsyncErrors(async(req,res,next)=>{
    const {role} = req.user
    if(role==='Junior'){
        return next(new ErrorHandler('Juniors are not allowed to delete vacancies', 400))
    }
    const {id} = req.params
    let vacancy = await vacancyModel.findById(id)
    if(!vacancy){
        return next(new ErrorHandler('Requested vacancy not found', 404))
    }
    await vacancy.deleteOne()
    res.status(200).json({
        success: true,
        message: 'Vacancy deleted successfully'
    })
})

export const getSingleVacancy = catchAsyncErrors(async(req,res,next)=>{
    const {id} = req.params
    try {
        const vacancy = await vacancyModel.findById(id)
        if(!vacancy){
            return next(new ErrorHandler('Vacancy not found', 404))
        }
        res.status(200).json({
            success: true,
            vacancy
        })
    } catch (error) {
        return next(new ErrorHandler('Invalid ID / CastError', 404))
    }
})
