const express = require('express');
const auth = require('../middlewares/auth.js');
const gnrt = require('../middlewares/generatenewtoken');

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// User Controller
const userCtrl = require('../controllers/userController');

// Authentication
router.post('/auth/signup', userCtrl.signup);
router.post('/auth/login', userCtrl.login);
router.post('/auth/send', userCtrl.sendMail);
router.post('/auth/refreshAccessToken', gnrt.gnrtNewToken);

// Admin Actions
router.get('/admin/client/get', userCtrl.getClients);
router.get('/admin/dev/get', userCtrl.getDevs);

// Role Controller
const roleCtrl = require('../controllers/roleController');
router.post('/role', roleCtrl.postRole);

// Project Controller
const projectCtrl = require('../controllers/projectController');
router.post('/admin/project/add', projectCtrl.createProject);
router.get('/admin/project/get', projectCtrl.getAllProject);
router.get('/admin/project/progress/get', projectCtrl.getStartedProject);
router.get('/admin/project/get/:id', projectCtrl.getAProject);
router.post('/admin/project/update/:id', projectCtrl.updateProjectWithClient);

// Section Controller
const sectionCtrl = require('../controllers/sectionController');
router.post('/admin/section/add', sectionCtrl.createSection);
router.get('/admin/section/get', sectionCtrl.getAllSections);
router.get('/admin/section/get/:projectId', sectionCtrl.getProjectSections);

// Task Controller
const taskCtrl = require('../controllers/taskController');
router.post('/admin/task/add', taskCtrl.createTask);
router.get('/admin/task/get/:status/:sectionId', taskCtrl.getStatusBasedSectionTasks);

// Project Developer Controller
const projectDevCtrl = require('../controllers/projectDevController');
router.post('/admin/project/assign/dev', projectDevCtrl.createProjectDev);
router.get('/admin/project/:projectId/dev', projectDevCtrl.getProjectDevs);

// Task Developer Controller
const taskDevCtrl = require('../controllers/taskDevController');
router.post('/admin/task/assign/dev', taskDevCtrl.createTaskDev);
router.get('/admin/task/:taskId/dev', taskDevCtrl.getTaskDevs);

// Test Route with Authentication Middleware
router.get('/auth/test', auth, (req, res) => {
  res.send(req.data);
});

module.exports = router;
