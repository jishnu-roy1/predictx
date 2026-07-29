const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Match', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        imageURL: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        teamA: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        teamB: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        winner: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });
}