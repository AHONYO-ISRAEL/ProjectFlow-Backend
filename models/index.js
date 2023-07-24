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
db.task = require('./taskModel')(sequelize, DataTypes)
db.project = require('./projectsModel')(sequelize, DataTypes)
db.developer = require('./developerModel')(sequelize,DataTypes)
db.taskModel = require('./devTaskModel')(sequelize,DataTypes)
db.devProject = require('./devProjectModel')(sequelize, DataTypes)
//Foreign keys
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
    through: 'DevProject',
    foreignKey: 'projectId',
})


db.developer.belongsToMany(db.project,{
    through: 'DevProject',
    foreignKey:'developerId'
})


//Developer ---- Task
db.task.belongsToMany(db.developer,{
    through: 'DevTask',
    foreignKey: 'taskId'
})

db.developer.belongsToMany(db.task,{
    through: 'DevTask',
    foreignKey:'developerId'
})

//Project --- Task
db.project.hasMany(db.task, {
    foreignKey: 'projectId'
})

db.task.belongsTo(db.project,{
    foreignKey:'projectId'
})


db.user.addHook('afterCreate', async (user , options)=>{
    try {
        const role = await db.role.findOne({where:{uuid: user.roleUuid}})
     if(role && role.roleName === 'developer'){
        await db.developer.create({
            devUuid: user.uuid,
            devId: user.id,
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