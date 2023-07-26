module.exports = (sequelize, DataTypes) => {
    const Developer= sequelize.define('developer', {

    devId: {
            type: DataTypes.STRING,
            allowNull: false,
         
        }, 
        email: {  
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    }) 
    return Developer
}

    