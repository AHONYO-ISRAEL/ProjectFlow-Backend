const express = require('express');
const  auth = require('../middlewares/auth.js')
const  gnrt = require('../middlewares/generatenewtoken.js')

const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({extended : true}))


const userCtrl = require('../controllers/userController')
const roleCtrl = require('../controllers/roleController')
const projectCtrl = require('../controllers/projectController')



router.post('/auth/signup', userCtrl.signup)
router.post('/auth/login', userCtrl.login)
router.post('/auth/refreshAccessToken', gnrt)


router.post('/role', roleCtrl.postRole)

router.post('/admin/project/add', auth,projectCtrl.createProject)
router.post('/admin/project/get', auth,projectCtrl.getAllProject)


router.post('/auth/refreshAccessToken')


router.get('/auth/test', auth, gnrt, (req,res)=>{
    res.send(req.data)
})

module.exports = router;