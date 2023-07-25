const db = require('../models');
const Section = db.section

exports.createSection = async (req, res) =>{
    try{
        const section =  await Section.findOne({where:{sectionName: req.body.sectionName}})
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
  