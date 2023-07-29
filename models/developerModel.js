module.exports = (sequelize, DataTypes) => {
    const Developer= sequelize.define('developer', {
id:{
type: DataTypes.INTEGER,
primaryKey: true,
autoIncrement: true,
},
 email: {  
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    }) 
    return Developer
}

    