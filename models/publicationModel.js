module.exports = (sequelize, DataTypes) =>{
    const Publication = sequelize.define('publication',{
        title: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          content: {
            type: DataTypes.TEXT,
            allowNull: true,
          },
          fileLink: {
            type: DataTypes.TEXT, 
            allowNull: true,
          },
    })
    return Publication
}