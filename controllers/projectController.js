const db = require('../models');


const Project = db.project


exports.createProject = async  (req, res, next) => {
    try {
        const searchProject =  await Project.findOne({ where: { name: req.body.name } })
        if (!searchProject) {
            const { accessToken, refreshToken, ...restOfData } = req.body;
  
            const newProject = {
                ...restOfData,
                userId: 1,
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
    res.status(200).json({products: products})
  }}catch(error){
    res.status(500).json({message: error})
  }

}

