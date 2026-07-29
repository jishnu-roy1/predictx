module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('match', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            imageURL: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            teamA: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            teamB: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            date: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            location: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            winner: {
                type: Sequelize.STRING,
                allowNull: true,
            },
        }, {
            timestamps: true,
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('match');
    },
}