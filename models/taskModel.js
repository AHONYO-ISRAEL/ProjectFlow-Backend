module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('task', {
    taskName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    durationDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    durationHours: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE, 
      allowNull: true,
   
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Not Started',
      validate: {
        isIn: [['Not Started', 'In Progress', 'Completed', 'Suspended']],
      },
    }, 

  });

  return Task;
};
