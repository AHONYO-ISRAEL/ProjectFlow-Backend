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
db.project = require('./projectsModel')(sequelize, DataTypes)


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


// SYNCING DATA  BETWEEN API AND DB
db.sequelize.sync({force : false})
.then(()=>{
    console.log('re-sync done')
})

module.exports = db