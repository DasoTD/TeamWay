import { login , createUser} from './auth.controller'

import  express  from 'express'

const router = express.Router()

router.post('/login', login)
router.post('/user', createUser)