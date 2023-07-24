const db = require('../models');

const Task = db.task

exports.createTask=  async(req, res)=>{
    try{
        const searchTask = await Task.findOne({where: {taskName: req.body.taskname}})
        if(!searchTask){
            const {accessToken , refreshToken, ...restOfData} = req.body

            const newTask = {
                ...restOfData
            }
            await Task.create(newTask)
            res.status(200).json({task : newTask})
        }else{
            res.status(400).json({message : 'Task with this name already exists'})
        }
    }catch(error){
        res.status(500).json({ message: 'Adding of project failed '+ err })
    }
}
