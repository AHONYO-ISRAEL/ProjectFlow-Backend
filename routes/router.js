const express = require('express');
const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({extended : true}))


const userCtrl = require('../controllers/userController')



router.post('/auth/signup', userCtrl.signup)
router.post('/auth/login', userCtrl.login)


module.exports = router;