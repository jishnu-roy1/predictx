module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('transactions', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'user',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            matchId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'match',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            amount: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            reason: {
                type: Sequelize.STRING,
                allowNull: true,
            },
        }, {
            timestamps: true,
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('transactions');
    },
};
