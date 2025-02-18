'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDefinition = await queryInterface.describeTable('users');

    console.log('Running add-name-fields migration...');
    await queryInterface.addColumn('users', 'firstName', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('users', 'lastName', {
      type: Sequelize.STRING,
      allowNull: true
    });

    if (!tableDefinition.googleId) {
      await queryInterface.addColumn('users', 'googleId', {
        type: Sequelize.STRING,
        allowNull: true
      });
    } else {
      console.log('Column googleId already exists, skipping.');
    }
    console.log('Migration completed successfully');
  },

  async down(queryInterface, Sequelize) {
    const tableDefinition = await queryInterface.describeTable('users');

    if (tableDefinition.googleId) {
      await queryInterface.removeColumn('users', 'googleId');
    }
    await queryInterface.removeColumn('users', 'firstName');
    await queryInterface.removeColumn('users', 'lastName');
  }
};
