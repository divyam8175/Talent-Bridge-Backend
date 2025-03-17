import mongoose from 'mongoose'

const vacancySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Vacancy title is required']
    },
    description: {
        type: String,
        required: [true, 'Vacancy description is required']
    },
    team: {
        type: String,
        required: [true, 'Team name is required']
    },
    expired: {
        type: Boolean,
        default: false
    },
    vacancyPostedOn: {
        type: Date,
        default: Date.now
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    }
})

export const vacancyModel = mongoose.model('Vacancy', vacancySchema)