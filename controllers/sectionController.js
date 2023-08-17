const db = require('../models');
const Section = db.section
const Task = db.task
const Developer = db.developer
const User = db.user

exports.createSection = async (req, res) =>{
    try{
        const section =  await Section.findOne({where:{sectionName: req.body.sectionName, projectId: req.body.projectId}})
if(section){
    res.status(400).json({message : 'This section is already created'})
}else{
    const newSection = {...req.body}
    await Section.create(newSection)
    .then(()=>res.status(201).json({message :'Section created successfully'}))
}
    }catch(error){
        res.status(500).json({error})
    }
}

exports.getAllSections= async (req,res)=>{
    try{
const sections = await Section.findAll()
if(sections.length > 0){
    res.status(200).json({sections : sections})
}
    }catch(error){
        res.status(500).json({error})

    }
}

exports.getProjectSections = async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const projectSections = await Section.findAll({ where: { projectId: projectId } });
   
      if (projectSections.length === 0) {
        res.status(204).json({ message: 'No sections found for the requested project' });
      } else {
        res.status(200).json({ sections: projectSections });
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  };
  
  exports.getSectionsWithTasksAndDevs = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const sections = await Section.findAll({
        where: { projectId: projectId },
        attributes: ['id', 'sectionName'],
        include: [
          {
            model: Task,
            attributes: ['id', 'taskName', 'status'],
          },
        
],
      });
  
      res.status(200).json(sections);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error: ' + error });
    }
  };
  