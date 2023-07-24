const express = require('express');
const  auth = require('../middlewares/auth.js')
const  gnrt = require('../middlewares/generatenewtoken')

const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({extended : true}))

 
const userCtrl = require('../controllers/userController')
const roleCtrl = require('../controllers/roleController')
const projectCtrl = require('../controllers/projectController')



router.post('/auth/signup', userCtrl.signup)
router.post('/auth/login', userCtrl.login)
router.post('/auth/send', userCtrl.sendMail)
router.post('/auth/refreshAccessToken', gnrt.gnrtNewToken)
  
router.get('/admin/client/get', userCtrl.getClients)

router.post('/role', roleCtrl.postRole)

router.post('/admin/project/add', projectCtrl.createProject)
router.get('/admin/project/get',projectCtrl.getAllProject)
router.get('/admin/project/progress/get',projectCtrl.getStartedProject)
router.get('/admin/project/get/:id', projectCtrl.getAProject)
router.post('/admin/project/update/:id', projectCtrl.updateProjectWithClient)


router.get('/auth/test', auth, (req,res)=>{
    res.send(req.data)
})

module.exports = router;