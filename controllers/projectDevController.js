const db = require('../models');

const ProjectDev = db.projectDev
const Project = db.project
const Developer = db.developer
const User = db.user

exports.createProjectDev = async (req, res) => {
    try {
        const searchDeveloper = await Developer.findOne({where:{userId:req.body.userId}})
        const  searchProject = await Project.findOne({where:{id: req.body.projectId}})
        if(!searchDeveloper || !searchProject){
            res.status(404).json({message: 'Project or Developer not found '})
        }else{
            const developerId = searchDeveloper.id
            const existingAssignment = await ProjectDev.findOne({
                where: { devId: developerId,  projectId: req.body.projectId }
            });
            if(existingAssignment){
                res.status(400).json({message : 'Developer already assigned to this project'})
            }else{
        
                newAssignment ={
                    devId: developerId,
                    projectId: req.body.projectId,
                }
                ProjectDev.create(newAssignment)
                res.status(200).json({message: 'Developer assigned successfully'})
            }
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error assigning developer: ' + error });
    }
};




exports.getProjectDevs = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        const project = await Project.findByPk(projectId, {
          attributes: ['id', 'name'],
          include: [
            {
              model: Developer,
              attributes: ['id'],
              include: [
                {
                  model: User,
                  attributes: ['id', 'username'],
                },
              ],
            },
          ],
        });
    
        if (!project) {
          return res.status(404).json({ error: 'Project not found' });
        }
    
        res.status(200).json({projects :project});
      } catch (error) {
        console.error('Error fetching developers on project:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
};


exports.deleteAssignment = async (req, res)=>{
  try{
   const  projectId =  req.params.projectId
   const devId = req.params.devId
   ProjectDev.destroy({where:{projectId:projectId, devId:devId}})
   res.status(200).json({message:'succes'})
  }catch(error){
    res.status(500).json({ error: 'Internal Server Error: ' + error });
}
}