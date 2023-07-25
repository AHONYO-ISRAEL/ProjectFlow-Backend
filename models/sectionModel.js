
module.exports=(sequelize, DataTypes)=>{
    const Section = sequelize.define('section',{
        sectionName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
          },
          description: {
            type: DataTypes.TEXT,
            allowNull: true,
          },
          startDate: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
          },
          endDate: {
            type: DataTypes.DATE,
            allowNull: true,
          },
          status: {
            type: DataTypes.STRING, 
            defaultValue: 'Not Started',
            validate:{
              isIn :[['Not Started', 'In Progress', 'Completed', 'Suspended']]
            }
          },
    })

    return Section
}