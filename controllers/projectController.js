const db = require('../models');


const Project = db.project
const User = db.user

exports.createProject = async  (req, res, next) => {
    try {
        const searchProject =  await Project.findOne({ where: { name: req.body.name } })
        if (!searchProject) {
            const { accessToken, refreshToken, ...restOfData } = req.body;
  
            const newProject = {
                ...restOfData,
            }
            await Project.create(newProject)
            res.status(200).json({ message: 'Project created successfuly' })
        }
        else {
            res.status(400).json({ message: 'Project with this name already exists' })
        }

    } catch (err) {
        res.status(500).json({ message: 'Adding of project failed '+ err })
    }
}

exports.getAllProject = async (req, res)=>{
 try{ const projects = await   Project.findAll()
  if(projects.length ===0){
    res.status(404).json({message: 'No Project Found'})
  }else{
    res.status(200).json({projects: projects})
  }}catch(error){
    res.status(500).json({message: error})
  }

}

exports.getStartedProject = async(req,res)=>{
    try {
        const startedProject = await Project.findAll({where:{status : 'In Progress'}})
        if(startedProject.length ===0){
            res.status(404).json({message: 'No Project Found'})
          }else{
            res.status(200).json({projects: startedProject})
    }
}catch(error){
    res.status(500).json({message: error})
    }
}

exports.getAProject = async(req,res)=>{
  const projectId = req.params.id; 
  try{
    const project = await Project.findOne({where:{id: projectId}})
    if(project){
      if(project.clientId){
        const client = await  User.findOne({where:{id: project.clientId}})
        clientName = client.username
        res.status(200).json({project: project, clientName}) 
      }else{
        res.status(200).json({project: project})
      }
      
    }else{
      res.status(404).json({message: 'This project is not registered'}) 
    }
  }catch(error){
    res.status(500).json({message: error})
  }
}

exports.updateProjectWithClient= async (req, res)=>{
  try{
    const projectId = req.params.id; 
    await Project.update({clientId: req.body.id}, {where:{id: projectId}})
    res.status(200).json({message: 'Updated Client Id'})
  }catch(error){
    res.status(500).json({message: error})

  }
}