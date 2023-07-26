const db = require('../models');

const TaskDev = db.taskDev
const Task = db.task
const Developer = db.developer
const User = db.user


exports.createTaskDev = async (req, res) => {
    try {
        const searchDeveloper = await Developer.findOne({where:{devId:req.body.devId}})
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
        const searchTaskDevs = await TaskDev.findAll({ where: { taskId: taskId } });

        if (searchTaskDevs.length === 0) {
            return res.status(404).json({ message: 'No developer has been assigned to this Task.' });
        } else {
            const devIds = searchTaskDevs.map(dev => dev.devId);
            const devTaskUsers = await User.findAll({ where: { id: devIds } });

            if (devTaskUsers.length > 0) {
                return res.status(200).json({ TaskDevs: devTaskUsers });
            } else {
                return res.status(404).json({ message: 'No users found for the developers in this Task.' });
            }
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error getting the developers in this Task: ' + error });
    }
};