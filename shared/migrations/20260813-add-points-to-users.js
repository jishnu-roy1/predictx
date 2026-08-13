module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('user', 'points', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        });
    },
    down: async (queryInterface) => {
        await queryInterface.removeColumn('user', 'points');
    },
};
