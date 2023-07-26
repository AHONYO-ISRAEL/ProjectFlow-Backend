const db = require('../models');

const ProjectDev = db.projectDev
const Project = db.project
const Developer = db.developer
const User = db.user

exports.createProjectDev = async (req, res) => {
    try {
        const searchDeveloper = await Developer.findOne({where:{devId:req.body.devId}})
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
                res.status(201).json({message: 'Developer assigned successfully'})
            }
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error assigning developer: ' + error });
    }
};




exports.getProjectDevs = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const searchProjectDevs = await ProjectDev.findAll({ where: { projectId: projectId } });

        if (searchProjectDevs.length === 0) {
            return res.status(404).json({ message: 'No developer has been assigned to this project.' });
        } else {
            const devIds = searchProjectDevs.map(dev => dev.devId);
            const devProjectUsers = await User.findAll({ where: { id: devIds } });

            if (devProjectUsers.length > 0) {
                return res.status(200).json({ projectDevs: devProjectUsers });
            } else {
                return res.status(404).json({ message: 'No users found for the developers in this project.' });
            }
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error getting the developers in this project: ' + error });
    }
};