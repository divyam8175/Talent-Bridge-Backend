import express from 'express'
import { isAuthenticated } from '../middlewares/auth.js'
import { juniorDeleteApplication, juniorGetAllApplications, postApplication, seniorGetAllApplications } from '../controllers/applicationController.js'

const router = express.Router()

router.get('/junior/getAll', isAuthenticated, juniorGetAllApplications)
router.get('/senior/getAll', isAuthenticated, seniorGetAllApplications)
router.delete('/delete/:id', isAuthenticated, juniorDeleteApplication)
router.post('/post', isAuthenticated, postApplication)

export default router