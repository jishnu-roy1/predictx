const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Job', {
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payload: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  });
};
