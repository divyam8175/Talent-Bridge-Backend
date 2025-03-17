import mongoose from 'mongoose'
import validator from 'validator'

const applicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        validate: [validator.isEmail, 'Please provide a valid Email']
    },
    phone: {
        type: Number,
        required: [true, 'Phone number is required']
    },
    branch: {
        type: String,
        required: [true, 'Branch name is required']
    },
    resume: {
        public_id: {
            type: String, 
            required: true,
        },
        url: {
            type: String, 
            required: true,
        } 
    },
    applicantID: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        role: {
            type: String,
            enum: ['Junior'],
            required: true
        }
    },
    seniorID: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        role: {
            type: String,
            enum: ["Senior"],
            required: true
        }
    }
})

export const applicationModel = mongoose.model('Application', applicationSchema)