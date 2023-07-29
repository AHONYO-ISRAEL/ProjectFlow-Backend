const db = require('../models');
const  auth = require('../middlewares/auth.js')
const User = db.user;
const Role = db.role
const Developer = db.developer 
const Project = db.project
const Task = db.task
const Section = db.section

exports.getProjectInfo = async (req, res) => {
    try {
      const projectId = req.params.projectId;
  
      // Get the specific project with its sections and tasks
      const project = await Project.findByPk(projectId, {
        include: [
          {
            model: Section,
            include: [
              {
                model: Task,
              },
            ],
          },
        ],
        raw: true, // Add this option to load the Sections property as an array
      });
  
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      // Create an object to hold the organized data
      const projectData = {
        id: project.id,
        name: project.name,
        sections: [],
      };
  
      // Loop through the sections of the project
      for (const section of project['Sections']) { // Use project['Sections'] to access the Sections array
        const sectionData = {
          id: section.id,
          name: section.name,
          developers: [],
          tasks: [],
        };
  
        // Loop through the tasks of the section
        for (const task of section.Tasks) {
          const taskData = {
            id: task.id,
            name: task.name,
            developers: [],
          };
  
          // Get all developers assigned to this task
          const developers = await task.getDevelopers();
  
          // Add developers' usernames and emails to the taskData object
          for (const developer of developers) {
            taskData.developers.push({
              id: developer.id,
              username: developer.User.username,
              email: developer.User.email,
            });
          }
  
          // Add the taskData object to the sectionData object
          sectionData.tasks.push(taskData);
        }
  
        // Get all developers assigned to this section
        const developers = await section.getDevelopers();
  
        // Add developers' usernames and emails to the sectionData object
        for (const developer of developers) {
          sectionData.developers.push({
            id: developer.id,
            username: developer.User.username,
            email: developer.User.email,
          });
        }
  
        // Add the sectionData object to the projectData object
        projectData.sections.push(sectionData);
      }
  
      res.json(projectData);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error ' + error });
    }
  };
  