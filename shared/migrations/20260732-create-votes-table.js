module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('vote', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            team: {
                type: Sequelize.STRING,
                allowNull: false,
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
        }, {
            timestamps: true,
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('vote');
    },
}