const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Vote', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        team: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        matchId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
    }, {
        tableName: 'vote',
        freezeTableName: true,
        timestamps: true,
    });
}