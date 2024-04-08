"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Overviews", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      code: {
        type: Sequelize.STRING,
      },
      area: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.STRING,
      },
      target: {
        type: Sequelize.STRING,
      },
      bonus: {
        type: Sequelize.STRING,
      },
      expired: {
        type: Sequelize.DATE,
      },
      created: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Overviews");
  },
};
