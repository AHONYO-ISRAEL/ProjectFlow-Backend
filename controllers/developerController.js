const db = require('../models'); 
const { Op } = require('sequelize');
const Developer = db.developer
const User = db.user
const Task = db.task
const Project = db.project
const Section = db.section
const TaskDev = db.taskDev

exports.getDevelopersWithProjectsAndTasks = async (req, res) => {
  try {
    const developers = await Developer.findAll({
      attributes: ['id', 'email'],
      include: [
        {
          model: User,
          attributes: ['id', 'username'],
        },
        {
          model: Project,
          attributes: ['id', 'name'],
          include: [
            {
              model: Section,
              attributes: ['id', 'sectionName'],
              include: [
                {
                  model: Task,
                  attributes: ['id', 'taskName'],
                },
              ],
            },
          ],
        },
      ],
    });

    res.status(200).json(developers);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error: ' + error });
  }
};


exports.getDevWithTasks= async (req, res) => {
  try {
    const developers = await Developer.findAll({
      attributes: ['id', 'email'],
      include: [
        {
          model: User,
          attributes: ['id', 'username'],
        },
        {      
          model: Task,
          through: {
            attributes: [], // Exclude the join table attributes from the result
          },
        },
      ],
    });

    // Organize the data separately for projects and tasks


    res.status(200).json(developers);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error: ' + error });
  }
};





exports.getAssignedTasks= async (req, res) => {
  try {
   const userId = req.params.userId
    const dev =  await Developer.findOne({where:{userId: userId}, attributes:['id']})
    const devId = dev.id
    const developers = await Developer.findOne({
      where:{id: devId},
      attributes: ['id', 'email'],
      include: [
        {
          model: User,
          attributes: ['id', 'username'],
        },
        {
          model: Task,
          where:{status:'Not Started'},
          attributes: ['id', 'taskName','status'],
          through: {
            attributes: [], 
          },
        },
      ],
    });
  res.status(200).json({developers});
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error: ' + error });
  }
};
exports.getUnassignedTasks= async (req, res) => {
  try {

     const devId = req.params.id
     const unassignedTasks = await Developer.findAll({
       attributes: [],
       include: [
         {
           model: User,
           attributes: [],
         },
         {
           model: Task,
           where:{status:'Not Started'},
           attributes: ['id', 'taskName','status'],
           through: {
             attributes: [], 
             where: { devId:{[Op.not]: devId }}
           },
         },
       ],
     });
     
   res.status(200).json({unassignedTasks});
   } catch (error) {
     res.status(500).json({ error: 'Internal Server Error: ' + error });
   }
};



exports.getAssignedProjects = async (req, res) => {
  try {
    const userId = req.params.userId
    const dev =  await Developer.findOne({where:{userId: userId}, attributes:['id']})
    const devId = dev.id
    const developer = await Developer.findByPk(devId, {
      include: [
        {
          model: Project,
        },
      ],
    });

    if (!developer) {
      return res.status(404).json({ error: 'Developer not found' });
    }

    res.status(200).json(developer);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error: ' + error.message });
  }
};    
/*
exports.getUnassignedTasks  = async (req, res) =>{
  try{
    let unassignedTasks = []
const devId = req.params.id
const unassigned  = await TaskDev.findAll()
const unassignedDevTasks = unassigned.filter((task)=>task.devId !==parseInt(devId) )
const tasks  = await  Task.findAll()
unassignedDevTasks.map((unassignedDevTask)=>(
   unassignedTasks =  tasks.filter((task)=>task.id !==unassignedDevTask.taskId )

))
res.status(200).json({unassignedTasks}) 
  }catch(error){
    res.status(500).json({ error: 'Internal Server Error: ' + error.message });

  }
}
*/
// exports.getUnassignedTas= async(req,res)=>{
//   try{
// const devId = req.params.id
// const devUnassigned = Developer.findOne({
//   where: {id: devId},
//   include:[{
// model: Task,
// through:{
//   where: { devId:{[Op.not]: devId }}
// }
//     },
 
//   ]}

// )
// res.status(200).json({devUnassigned})

//   }catch(error){
//     res.status(500).json({ error: 'Internal Server Error: ' + error });
//   }
// }


// exports.getUnassignedTask = async (req, res) => {
//   try {
//     const devId = req.params.id;

//     // Find the tasks that are not assigned to the specified developer
//     const unassignedTasks = await Task.findAll({
//       where: {
//         '$developers.id$': { [Op.not]: devId } // Filter tasks not associated with the developer
//       },
//       include: [
//         {
//           model: Developer,
//           as: 'developers',
//           required: false,
//           attributes: [],
//           where: { id: devId }
//         }
//       ]
//     });

//     res.status(200).json(unassignedTasks);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error: ' + error });
//   }
// };
