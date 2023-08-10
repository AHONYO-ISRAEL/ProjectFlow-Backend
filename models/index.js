const dbConfig = require('../config/dbConfig.js')
const {Sequelize, DataTypes} = require('sequelize')

//  CONNECTION TO THE DATABASE 
const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,

        pool:{
            max:dbConfig.pool.max,
            min:dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,  
            idle: dbConfig.pool.idle
        }
    }
 )
 
sequelize.authenticate()
.then(()=>{
    console.log('Connection to the database established successfully')
})
.catch((err)=>{
    console.error(err)
})

// INITIALIZING DB
const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

// GETTING EACH MODEL
db.user = require('./userModel')(sequelize, DataTypes)
db.role = require('./rolesModel')(sequelize, DataTypes)
db.developer = require('./developerModel')(sequelize,DataTypes)
db.project = require('./projectsModel')(sequelize, DataTypes)
db.section = require('./sectionModel')(sequelize, DataTypes)
db.task = require('./taskModel')(sequelize, DataTypes)
db.taskDev= require('./taskDevModel')(sequelize,DataTypes)
db.projectDev= require('./projectDevModel')(sequelize,DataTypes)
db.publication= require('./publicationModel')(sequelize,DataTypes)

//Foreign keys


//Project --- Publication
db.project.hasMany(db.publication, {
    foreignKey:'projectId'      
})

db.publication.belongsTo(db.project,{
    foreignKey:'projectId'
})
//Section --- Publication
db.section.hasMany(db.publication, {
    foreignKey:'sectionId'
})

db.publication.belongsTo(db.section,{
    foreignKey:'sectionId'
})
//Task --- Publication
db.task.hasMany(db.publication, {
    foreignKey:'taskId'
})

db.publication.belongsTo(db.task,{
    foreignKey:'taskId'
})
//User --- Publication
db.user.hasMany(db.publication, {
    foreignKey:'userId'
})

db.publication.belongsTo(db.user,{
    foreignKey:'userId'
})

//User --- Developer
db.user.hasOne(db.developer, {foreignKey:'userId'})
db.developer.belongsTo(db.user, {through:'userId'})

// Role ---- User

db.role.hasMany(db.user,{
    foreignKey:'roleId',
})

db.user.belongsTo(db.role,{
    foreignKey:'roleId',
})

//User --- Project
    db.user.hasMany(db.project,{
        foreignKey:'userId'
    })

    db.project.belongsTo(db.user,{
        foreignKey: 'userId'
    })


// Developer ---- Project 
db.project.belongsToMany(db.developer,{
    through: db.projectDev,
    foreignKey:'projectId'

})


db.developer.belongsToMany(db.project,{
    through: db.projectDev,
    foreignKey:'devId'

})

   
//Developer ---- Task
db.task.belongsToMany(db.developer,{
    through: db.taskDev,
foreignKey:'taskId'
})

db.developer.belongsToMany(db.task,{
    through: db.taskDev,
    foreignKey:'devId'
})

//Project --- Section
db.project.hasMany(db.section, {
    foreignKey: 'projectId'
})

db.section.belongsTo(db.project,{
    foreignKey:'projectId'
})

//Section -- Task
db.section.hasMany(db.task, {
    foreignKey: 'sectionId'
})

db.task.belongsTo(db.section,{
    foreignKey:'sectionId'
})



db.user.addHook('afterCreate', async (user , options)=>{
    try {
        const role = await db.role.findOne({where:{id: user.roleId}})
     if(role && role.roleName === 'developer'){
        await db.developer.create({
            userId: user.id,
            email: user.email,
        })
     }
    } catch (error) {
        console.log('Error creating developer : ', error)
    }
})

// SYNCING DATA  BETWEEN API AND DB
db.sequelize.sync({force : false})
.then(()=>{
    console.log('re-sync done')
})

//HOOKS


   


module.exports = db