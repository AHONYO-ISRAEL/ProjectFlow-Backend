const express = require('express');
const  auth = require('../middlewares/auth.js')
const  gnrt = require('../middlewares/generatenewtoken.js')

const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({extended : true}))


const userCtrl = require('../controllers/userController')
const roleCtrl = require('../controllers/roleController')



router.post('/auth/signup', userCtrl.signup)
router.post('/auth/login', userCtrl.login)

router.post('/role', roleCtrl.postRole)


router.get('/auth/test', auth, gnrt, (req,res)=>{
    res.send(req.data)
})

module.exports = router;