const db = require('../models');

const TaskDev = db.taskDev
const Task = db.task
const Developer = db.developer
const User = db.user
const Section = db.section

exports.createTaskDev = async (req, res) => {
    try {
        const searchDeveloper = await Developer.findOne({where:{userId:req.body.userId}})
        const  searchTask = await Task.findOne({where:{id: req.body.taskId}})
        if(!searchDeveloper || !searchTask){
            res.status(404).json({message: 'Task or Developer not found '})
        }else{
            const developerId = searchDeveloper.id
            const existingAssignment = await TaskDev.findOne({
                where: { devId: developerId,  taskId: req.body.taskId }
            });
            if(existingAssignment){
                res.status(400).json({message : 'Developer already assigned to this task'})
            }else{
        
                newAssignment ={
                    devId: developerId,
                    taskId: req.body.taskId,
                }
                TaskDev.create(newAssignment)
                res.status(201).json({message: 'Developer assigned successfully'})
                
            }
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error assigning developer: ' + error });
    }
};




exports.getTaskDevs = async (req, res) => {

try {
        const taskId = req.params.taskId;

      const task = await  Task.findByPk(taskId, {
        attributes: ['id', 'taskName', 'status'],
        include: [ 
          {
            model:  Developer,
            attributes: ['id', 'email'],
            include: [
              {
                model: User,
                attributes: ['id', 'username'],
              },
            ],
          },
        ],
      });
  
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error : '+error });
    }
};

exports.getAllTasksWithDevs = async (req, res) => {
    try {
      const sectionId =req.params.sectionId
      const tasks = await Task.findAll({
        where :{sectionId: sectionId},
        include: [
          {
            model: Developer,
            attributes: ['id', 'email'],
            include: [
              {
                model: User,
                attributes: ['id', 'username'],
              },
            ],
          },
        ],
      });
  
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error: ' + error });
    }
  };
  
  exports.getAssignedSectionsAndTasks = async (req, res) => {
    try {
      const sections = await Section.findAll({
        where:{projectId:req.params.projectId},
        attributes: ['id', 'sectionName'],
        include: [
          {
            model: Task,
            attributes: ['id', 'taskName', 'status'],
            include: [
              {
                model: Developer,
                where:{userId:req.params.userId},
                attributes: ['id', 'email'],
                include: [
                  {
                    model: User,
                    attributes: ['id', 'username'],
                  },
                ],
              },
            ],
          },
        ],
      });
  
      res.status(200).json(sections);
    }  catch (error) {
      res.status(500).json({ error: 'Internal Server Error: ' + error });
    }
  };

  exports.getTaskWithDevs = async (req, res) => {
    try {
      const taskId = req.params.taskId;
  
      const task = await Task.findByPk(taskId, {
        attributes: ['id', 'taskName', 'status'],
        include: [
          {
            model: Developer,
            attributes: ['id', 'email'],
            include: [
              {
                model: User,
                attributes: ['id', 'username'],
              },
            ],
          },
        ],
      });
  
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error: ' + error });
    }
  };
  