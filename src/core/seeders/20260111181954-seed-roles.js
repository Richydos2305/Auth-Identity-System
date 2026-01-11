'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        id: 1,
        name: 'USER',
        description: 'Standard user with basic permissions',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'ADMIN',
        description: 'Administrator with full system access',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
