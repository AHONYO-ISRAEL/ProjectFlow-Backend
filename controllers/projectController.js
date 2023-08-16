const db = require('../models');


const Project = db.project
const User = db.user
const Task = db.task
const Section = db.section
exports.createProject = async  (req, res, next) => {
    try {
        const searchProject =  await Project.findOne({ where: { name: req.body.name } })
        if (!searchProject) {
            const { accessToken, refreshToken, ...restOfData } = req.body;
  
            const newProject = {
                ...restOfData,
            }
            await Project.create(newProject)
            const newCreatedProject = await Project.findOne({where: {name: req.body.name}})
            res.status(200).json({ project: newCreatedProject})
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


exports.getClientProject = async (req, res)=>{
 try {
    const clientId = req.params.clientId;

    const project = await Project.findAll({
      where: { clientId: clientId },
      include: [
        {
          model: Section,
          attributes: ['id', 'sectionName'],
          include: [
            {   
              model: Task,
              attributes: ['id', 'taskName', 'status'],
            },
          ],
        },
      ],
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error: ' + error });
  } 
}

exports.changeStatus = async (req, res)=>{
  try{
    const projectId = req.params.id
    await Project.update({status:'In Progress'}, {where:{id:projectId}})
    res.status(200).json({message: 'Project updated successfully'})
  }catch(error){
    res.status(500).json({ error: 'Internal Server Error: ' + error });
  }
}    

exports.getTasksForProject = async (req, res) => {
  const projectId = req.params.projectId; // Assuming you're passing projectId as a parameter

  try {
    const project = await Project.findByPk(projectId, {
      include: {
        model: Section,
        include: Task,
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const tasks = project.Sections.reduce((acc, section) => {
      return acc.concat(section.Tasks);
    }, []);

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'An error occurred while fetching tasks' ,error});
  }
};