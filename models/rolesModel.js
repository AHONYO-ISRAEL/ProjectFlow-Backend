const { v4: UUIDV4 } = require('uuid');

module.exports =(sequelize, DataTypes)=>{

    const Role = sequelize.define('role',{
        uuid:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        roleName:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['admin', 'developer', 'client']],
               
              },
        }
    })

    return Role
}