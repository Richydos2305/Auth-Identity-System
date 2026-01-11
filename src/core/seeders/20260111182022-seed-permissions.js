'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('permissions', [
      {
        id: 1,
        name: 'users_read',
        resource: 'users',
        action: 'read',
        description: 'View user profiles and information',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'users_create',
        resource: 'users',
        action: 'create',
        description: 'Create new user accounts',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'users_update',
        resource: 'users',
        action: 'update',
        description: 'Update user profiles and information',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        name: 'users_delete',
        resource: 'users',
        action: 'delete',
        description: 'Delete user accounts',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        name: 'roles_read',
        resource: 'roles',
        action: 'read',
        description: 'View roles and permissions',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        name: 'roles_manage',
        resource: 'roles',
        action: 'manage',
        description: 'Create, update, and delete roles',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        name: 'profile_read',
        resource: 'profile',
        action: 'read',
        description: 'View own profile',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 8,
        name: 'profile_update',
        resource: 'profile',
        action: 'update',
        description: 'Update own profile',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 9,
        name: 'profile_delete',
        resource: 'profile',
        action: 'delete',
        description: 'Delete own account',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
