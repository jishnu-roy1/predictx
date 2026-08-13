const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Transaction', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
        matchId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'match',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        tableName: 'transactions',
        freezeTableName: true,
        timestamps: true,
    });
};
