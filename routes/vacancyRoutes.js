import express from 'express'
import { deleteVacancy, getAllVacancies, getMyVacancies, getSingleVacancy, postVacancy, updateVacancy } from '../controllers/vacancyController.js'
import { isAuthenticated } from '../middlewares/auth.js'

const router = express.Router()

router.get('/getAll', getAllVacancies)
router.post('/post', isAuthenticated, postVacancy)
router.get('/getMyVacancies', isAuthenticated, getMyVacancies)
router.put('/update/:id', isAuthenticated, updateVacancy)
router.delete('/delete/:id', isAuthenticated, deleteVacancy)
router.get('/:id', isAuthenticated, getSingleVacancy)

export default router