const db = require('../models');

const Task = db.task

exports.createTask=  async(req, res)=>{
    try{
        const searchTask = await Task.findOne({where: {taskName: req.body.taskName}})
        if(!searchTask){
            const {accessToken , refreshToken, ...restOfData} = req.body

            const newTask = {
                ...restOfData
            }
            await Task.create(newTask)
            const newCreatedTask = await Task.findOne({where: {taskName: req.body.taskName, sectionId:req.body.sectionId}})
            res.status(200).json({task : newCreatedTask})

        }else{
            res.status(400).json({message : 'Une tâche de ce nom est deja cree dans cette section'})
        }
    }catch(error){
        res.status(500).json({ message: "Echec d'ajout de la tâche"+ error })
    }
}

exports.updateTask = async (req, res)=>{
try{
const taskId = req.params.taskId
const taskData = req.body
const searchTask =  await Task.findOne({where:{id:taskId}})
if(!searchTask){
  res.status(404).json({message : 'task not found'})
}else{
const updatedTask = await Task.update(taskData, {where:{id:taskId}})
res.status(200).json({updatedTask})
}
}catch(error){
  res.status(500).json({ message: 'Adding of task failed  '+ error })

}
}

exports.getStatusBasedSectionTasks = async (req, res) => {
    try {
      const sectionId = req.params.sectionId;
      const status = req.params.status
      const sectionTasks = await Task.findAll({ where: { sectionId: sectionId , status: status} });
  
      if (sectionTasks.length === 0) {
        res.status(204).json({ message: 'No tasks found for the requested Section' });
      } else {
        res.status(200).json({ tasks: sectionTasks });
      }
    } catch (error) {
      res.status(500).json({ message: 'Task fetching failed ' + error });
    }
  };
    
exports.updateTaskStatus = async(req,res)=>{
  try{
    const taskId = req.params.taskId
    Task.update({status :req.params.newStatus, startDate : req.body.startDate},{where:{id: taskId}})
    res.status(200).json({message:'Task started successfully'})
  }catch(error){
    res.status(500).json({error})
  }
}

exports.getTasksByTaskIds = async(req, res)=>{
  try {

    const tasks = await Task.findOne({
      attributes: ['id','taskName'],
      where: {
        id: req.params.taskId,
      },
    });
    res.status(200).json({ tasks });
  } catch (error) {
    
    res.status(500).json({ error: 'An error occurred while fetching task names.' + error});
  }
}

exports.getAllTasks = async (req, res)=>{
  try{
const tasks =  await Task.findAll()
res.status(200).json({tasks})
  }catch(error){
    res.status(500).json({ error: 'An error occurred while fetching task names.' + error});
  }
}